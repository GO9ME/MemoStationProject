import json
import faiss
import numpy as np
import time
import os
import re
import nltk
import hashlib
from datetime import datetime

from pathlib import Path
from dotenv import load_dotenv
from typing import List, Dict, Optional, Tuple
from nltk.corpus import stopwords
from tqdm import tqdm
from openai import OpenAI


# NLTK 데이터 다운로드
try:
    nltk.download("punkt", quiet=True)
    nltk.download("stopwords", quiet=True)
except:
    pass


class RAGBlogRecommender:
    def __init__(
        self,
        folder_path: str = "new_naver_crawl/crawl_new_data2",
        # folder_path: str,
        embedding_model: str = "text-embedding-3-small",
        index_path: str = "faiss_index_basic.faiss",
        embed_path: str = "embeddings_basic.npy",
        meta_path: str = "doc_metadata_basic.json",
        api_key: str = None,
    ):

        self.folder_path = folder_path
        self.embedding_model = embedding_model
        self.index_path = index_path
        self.embed_path = embed_path
        self.meta_path = meta_path

        self.doc_texts = []
        self.doc_ids = []
        self.doc_meta = []
        self.index = None

        """
        RAG 기반 블로그 추천 시스템 초기화

        Args:
            blog_data_path: 블로그 크롤링 데이터 경로
            api_key: OpenAI API 키
        """
        self.blog_data_path = Path(folder_path)
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")

        if not self.api_key:
            raise ValueError("OpenAI API 키가 필요합니다.")
        self.openai_client = OpenAI(api_key=self.api_key)

        # 한국어/영어 불용어 설정
        self.stop_words = set(stopwords.words("english"))
        try:
            self.stop_words.update(stopwords.words("korean"))
        except:
            pass

        # 블로그 데이터 저장소
        self.blog_data = []
        self.blog_embeddings = None
        self.blog_tfidf_matrix = None

    def preprocess_text(self, text: str) -> str:
        """텍스트 전처리"""
        if not text:
            return ""

        # HTML 태그 제거
        text = re.sub(r"<[^>]+>", "", text)

        # 특수문자 제거 (한글, 영문, 숫자, 공백만 유지)
        text = re.sub(r"[^\w\s가-힣]", " ", text)

        # 연속된 공백을 하나로
        text = re.sub(r"\s+", " ", text)

        # 앞뒤 공백 제거
        text = text.strip()

        return text

    def extract_json_prompt(self, text: str) -> str:
        """
        LLM 응답 문자열에서 JSON 블럭을 추출하고 'prompt' 값만 반환
        """
        # 코드블럭 제거: ```json 또는 ``` 으로 감싸진 부분 삭제
        cleaned = re.sub(
            r"^```json|^```|```$", "", text.strip(), flags=re.MULTILINE
        ).strip()

        # JSON 파싱
        try:
            data = json.loads(cleaned)
            return data.get("prompt", "")
        except json.JSONDecodeError as e:
            print("❌ JSON 파싱 오류:", e)
            print("입력값:", cleaned[:200])
            return ""

    def categorize_memo(self, memo_text: str, n: int = 5) -> str:
        # LLM 분류는 선택적으로 사용 (API 오류 방지)
        try:

            prompt = f"""

아래에 제시된 키워드 그룹들을 참고하여, 각 그룹마다 **블로그 콘텐츠 검색용 쿼리 문장**을 작성해 주세요.  
각 쿼리는 다음 기준을 따릅니다:            

### 메모 기반 성향 데이터
{memo_text}

## [지시사항: 입력값에 따라 유동적으로 구성하세요]
1. 목적: 사용자가 흥미로워할 블로그 글을 벡터 유사도 기반으로 검색하기 위함
2. 형식: `키워드 그룹 기반 자연어 쿼리 문장` 5개 (그룹 0~4)
3. 톤: 구체적이고 정보 중심
4. 길이: 1문장 ~ 2문장 이내
5. 정보 소비 가중치를 바탕으로 다음을 반영하세요(메모기반 성향 데이터에 따라 유동적으로 변해야 함):
   - **신뢰성(credibility)** > **다양성(diversity)** > **분석성(analyticity)** > **실용성(utility)** > **복습성(archive)** 순서로 정보 선호
   - **최신성(recency)**은 매우 낮으므로 반영하지 않아도 무방
6. 추천할 블로그 카테고리도 블로그 category를 참조하여 함께 제안하세요. 예:
   - `"지식동향 > IT·컴퓨터"`  
   - `"생활노하우쇼핑 > 일상생각"`  
7. 구성 예시: `"최근 [키워드]와 관련된 실용적인 정보를 다룬 블로그 글 추천해줘"`  
  또는 `"사용자의 관심사를 고려하여 [키워드]를 중심으로 한 콘텐츠를 찾기 위한 쿼리"`
8. 정보 소비 가중치를 바탕으로 가중치가 큰 순서대로 나열하시오

## [블로그 category:
# 1. 지식동향: 건강의학, 교육학문, 비즈니스경제, 사회정치, 어학외국어, IT·컴퓨터
# 2. 취미여가여행: 게임, 국내여행, 맛집, 사진, 세계여행, 스포츠, 자동차, 취미
# 3. 생활노하우쇼핑: 반려동물, 상품리뷰, 요리레시피, 원예재배, 육아결혼, 인테리어DIY, 일상생각, 좋은글이미지, 펴션미용
# 4. 엔터테인먼트예술: 공연전신, 드라마, 만화애니, 문학책, 미술디자인, 방송, 스타연예인, 영화, 음악

# ※ 어학/학습/공부/표현/영어/외국어 관련 단어가 하나라도 나오면 반드시 '지식동향'으로 분류하세요.
# ※ 음식/요리/레시피 관련 단어가 나오면 반드시 '생활노하우쇼핑'으로 분류하세요.
# ※ 게임/RPG/플레이 관련 단어가 나오면 반드시 '취미여가여행'으로 분류하세요.
# ※ 위의 카테고리에 명확히 해당하지 않을 때는 가장 근접한 카테고리를 선택하세요. '기타'는 사용하지 마세요.   

## [category 별 정의]
# 트렌드 추종형(trend_type) : 최신 정보, 신제품, 실시간 이슈, 빠른 변화에 민감. 정보의 신선도와 속도 중시
# 신중 검증형(cautious_type):  검증된 정보, 전문가 의견, 리뷰, 오랜 경험 중시. 신뢰성, 근거, 반복성 강조
# 균형형(balanced_type): 최신성과 검증성을 상황에 따라 조화롭게 소비. 새로움과 신뢰성 모두 일정 비율 고려
# 회고/복습형(retrospective_type): 과거 기록, 복습, 반복 학습, 아카이브 정보 선호. 누적성, 반복성, 장기 가치 중시
# 실용/즉시형(practical_type): 당장 쓸 수 있는 실용 정보, How-to, 요약, 팁 선호. 적용 가능성, 즉시성 강조

## [query 예시]
"아침 루틴이나 바이오 리듬처럼 생활의 움직임과 관련된 실용적인 팁을 담은 블로그 글을 찾아줘"
"해외 시장 동향이나 기업의 변화 예측과 같은 실용적인 정보를 다룬 블로그 글을 추천해줘"
"영화 속 자동화 기술이나 환경 변화에 대해 다룬 분석적인 블로그 글을 검색해줘"
"AI, UX, 제품 디자인과 관련된 최신 기술 트렌드를 소개한 블로그 콘텐츠를 추천해줘"
"우정, 안정감, 생존 이슈처럼 인간관계나 사회적 가치를 중심으로 한 콘텐츠를 찾아줘"

## [출력 형식 예시]

```json

  "user_category": "balanced_type",
  "user_intent_summary": "사용자는 최신성과 신뢰성을 모두 중요시하며, 분석적이고 실용적인 콘텐츠를 선호합니다. 음악과 오디오 기술, 직장 내 효율성 관련 주제를 자주 다룹니다.",
  "category": ["지식동향 > IT, 컴퓨터", "생활노하우쇼핑 > 일상"],
  "prompt": ["query의 갯수에 따라 유동적으로 변함"],
  "info_weight" : "신뢰성, 다양성 .. "
  
                       """
            print(f" prompt : {prompt}")

            system_prompt = f"""
                당신은 사용자의 관심사를 바탕으로 벡터 데이터베이스에서 유사한 블로그 글을 검색하기 위한 쿼리를 만드는 역할을 합니다.
            """
            print(f"[INFO]system_prompt : ==== {system_prompt}")
            response = self.openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "system",
                        "content": system_prompt,
                    },
                    {"role": "user", "content": prompt},
                ],
                temperature=0.3,
            )

            llm_category = response.choices[0].message.content.strip().strip('"')

            return llm_category

        except Exception as e:
            print(f"LLM 카테고리 분류 중 오류 발생: {e}")
            # LLM 오류 시 키워드 기반 분류 결과 사용

    def get_openai_embedding(self, text: str):
        response = self.openai_client.embeddings.create(
            input=[text], model=self.embedding_model
        )
        return response.data[0].embedding

    def compute_meta_score(self, meta: Dict) -> float:
        return (
            0.3 * meta.get("credibility", 0)
            + 0.2 * meta.get("recency", 0)
            + 0.2 * meta.get("utility", 0)
            + 0.2 * meta.get("diversity", 0)
            + 0.1 * meta.get("analyticity", 0)
        )

    def load_documents_from_folder(self):
        all_docs = []
        for filename in os.listdir(self.folder_path):
            if filename.endswith(".json"):
                filepath = os.path.join(self.folder_path, filename)
                with open(filepath, "r", encoding="utf-8") as f:
                    try:
                        data = json.load(f)
                        for d in data:
                            d["credibility"] = float(d.get("credibility", 0))
                            d["recency"] = float(d.get("recency", 0))
                            d["utility"] = float(d.get("utility", 0))
                            d["diversity"] = float(d.get("diversity", 0))
                            d["analyticity"] = float(d.get("analyticity", 0))
                        all_docs.extend(data)
                        print(f"[INFO] {filename} → {len(data)}건 로드")
                    except Exception as e:
                        print(f"[ERROR] {filename} 실패: {e}")
        return all_docs

    def build_or_load_index(self, force_rebuild=False):
        if (
            not force_rebuild
            and os.path.exists(self.index_path)
            and os.path.exists(self.meta_path)
        ):
            print("[INFO] 저장된 FAISS 인덱스와 메타데이터 로드 중...")
            self.index = faiss.read_index(self.index_path)
            with open(self.meta_path, "r", encoding="utf-8") as f:
                meta = json.load(f)
                self.doc_ids = meta["ids"]
                self.doc_texts = meta["texts"]
                self.doc_meta = meta["meta"]
            return self.index

        print("[INFO] 새로 문서 로드 중...")
        documents = self.load_documents_from_folder()
        self.doc_texts = [doc["content"] for doc in documents]
        self.doc_ids = [
            doc.get("id", hashlib.md5(doc["content"].encode()).hexdigest())
            for doc in documents
        ]
        self.doc_meta = [
            {
                "title": doc.get("title", ""),
                "url": doc.get("url", ""),
                "thumbNailUrl": doc.get("thumbNailUrl", ""),
                "category": doc.get("category", ""),
                # 신뢰성 "전문가" "출처"
                "credibility": doc.get("credibility", 0),
                # 최신성(날짜)
                "recency": doc.get("recency", 0),
                # "팁", "정리", "방법", "요약"
                "utility": doc.get("utility", 0),
                # 다양성 단어의 다양성
                "diversity": doc.get("diversity", 0),
                # 분석성 "분석", "결과", "이유", "패턴"
                "analyticity": doc.get("analyticity", 0),
            }
            for doc in documents
        ]

        print("[INFO] 임베딩 중...")
        embeddings = []
        for i, text in enumerate(self.doc_texts):
            emb = self.get_openai_embedding(text)
            embeddings.append(emb)
            print(f"[{i+1}/{len(self.doc_texts)}] 임베딩 완료")
            time.sleep(0.3)  # OpenAI 호출 시 제한 고려

        embeddings = np.array(embeddings).astype("float32")
        self.index = faiss.IndexFlatL2(embeddings.shape[1])
        self.index.add(embeddings)

        np.save(self.embed_path, embeddings)
        faiss.write_index(self.index, self.index_path)
        with open(self.meta_path, "w", encoding="utf-8") as f:
            json.dump(
                {"ids": self.doc_ids, "texts": self.doc_texts, "meta": self.doc_meta},
                f,
                ensure_ascii=False,
            )
        print("[INFO] 인덱스 및 메타 저장 완료")

    def search(self, query: str, top_k: int = 3, alpha: float = 0.5):
        if self.index is None:
            raise ValueError("FAISS 인덱스가 초기화되지 않았습니다.")

        query_vec = np.array([self.get_openai_embedding(query)]).astype("float32")
        D, I = self.index.search(query_vec, top_k * 3)

        results = []
        for i in I[0]:
            idx = int(i)
            if idx >= len(self.doc_ids):
                continue
            meta = self.doc_meta[idx]
            vector_score = 1 / (1 + D[0][list(I[0]).index(i)])  # L2 거리 → 유사도
            meta_score = self.compute_meta_score(meta)
            final_score = alpha * vector_score + (1 - alpha) * meta_score
            results.append(
                {
                    "id": self.doc_ids[idx],
                    "content": self.doc_texts[idx],
                    "title": meta.get("title", ""),
                    "url": meta.get("url", ""),
                    "thumbNailUrl": meta.get("thumbNailUrl", ""),
                    "category": meta.get("category", ""),
                    "score": round(final_score, 4),
                }
            )

        results.sort(key=lambda x: x["score"], reverse=True)
        return results[:top_k]


def main():
    """메인 실행 함수"""
    # 환경 변수 로드
    load_dotenv()

    # 시스템 초기화
    recommender = RAGBlogRecommender()

    # 메모에서 추출한 추천 데이터
    memo_result = """
{
    "user_id": "사용자_012",
    "memo_id": [
      "de88e2a0-5954-4ab3-96ab-46f9391079ea",
      "e80519ad-03d3-4ea6-b3cc-605f728b397a",
      "7f7e7f02-be28-498f-bdd2-e7b92f69d097",
      "94a109d8-290c-410d-afa6-9c520e5b4181",
      "ae9383c8-a521-4259-9a40-c9cf168a448e",
      "dcced74a-0556-445b-8465-c97bd012a540",
      "6940a3a6-9cf8-4f7d-905a-63ec5993542c",
      "b16c561c-fa62-4a61-afec-985348657634",
      "b7ac06f5-f6f1-4399-b123-648050524bbf",
      "f599af60-6b1d-4f45-aa2d-4023ab11c3b0",
      "83bd22d0-c3ee-4ee2-a2ab-ba51d010e344",
      "48344ece-2a9b-4595-ab8d-3e4db80364d3",
      "570e15cf-dec2-4dd3-bf02-fdfbd97f23b1",
      "cd833753-3c4f-4474-af6d-3cd7ec6e76e2",
      "efef251a-d886-4a83-9361-7cfcab4445b6",
      "06773fbf-4a30-4a60-8943-01278c3c5365",
      "f418141f-786a-495a-8ffe-06d2e9598f58",
      "8a543cc1-607a-42fa-8026-cdcc1aa8aa9e",
      "d566b32f-e041-44bc-bc8a-3d7561bd539f",
      "9fd361df-709e-464b-be14-928f8b764dd0"
    ],
    "recommend_value": {
      "keyword": {
        "0": [
          "이론",
          "온라인",
          "이동",
          "시장",
          "실전",
          "인지",
          "인상",
          "이른",
          "진로",
          "이해"
        ],
        "1": [
          "생각",
          "여행",
          "공강",
          "방식",
          "자격증",
          "강조",
          "가장",
          "강연",
          "중간고사",
          "작성"
        ],
        "2": [
          "체험",
          "라이트",
          "마이크",
          "피로감",
          "초여름",
          "어려우",
          "입감",
          "연구",
          "챕터",
          "추천"
        ],
        "3": [
          "task",
          "q",
          "school",
          "work",
          "career",
          "time",
          "life",
          "design",
          "keyword",
          "teamwork"
        ],
        "4": [
          "붙잡",
          "취업",
          "양보",
          "해야",
          "절약",
          "설계",
          "끝판",
          "청취",
          "위해",
          "단위"
        ]
      },
      "forgetting_curve_weight": 0.457160751985381,
      "recency": 0.15143227660774675,
      "credibility": 0.26604827665160324,
      "utility": 0.14226336154766567,
      "archive": 0.1964882140340277,
      "diversity": 0.052423400160111946,
      "analyticity": 0.19134447099884475,
      "category": "retrospective_type"
    }
  }
    """

    # LLM을 통한 성향 카테고리, 사용자 성향, 프롬프트를 뽑는다.
    response = recommender.categorize_memo(memo_result)
    print("🎯 response:", response)

    prompt = recommender.extract_json_prompt(response)
    print("🎯 Prompt:", prompt)

    recommender = RAGBlogRecommender(
        folder_path="./new_naver_crawl/crawl_new_data2",
        # api_key="sk-...",  # 또는 환경변수로 설정
    )

    index = recommender.build_or_load_index(
        force_rebuild=False
    )  # force_rebuild=True 가능

    # query = """사용자께서는 IT와 컴퓨터 분야에 높은 관심을 가지고 계십니다. 최신 기술 동향, IT 트렌드..."""

    results_all = []

    for q in prompt:
        print(f"{q}")
        results_all += recommender.search(q)

    # ✅ ID 기준 중복 제거 함수
    def deduplicate_by_id(items: list[dict], id_key: str = "id") -> list[dict]:
        seen = set()
        unique = []
        for item in items:
            item_id = item.get(id_key) or item.get("ID")  # 유연하게 처리
            if item_id and item_id not in seen:
                seen.add(item_id)
                unique.append(item)
        return unique

    # ✅ 중복 제거 적용
    results_all = deduplicate_by_id(results_all)
    print(results_all)

    # JSON 파일로 저장
    # with open("./user_test/blogs_user_010.json", "w", encoding="utf-8") as f:
    #     json.dump(list(results_all), f, ensure_ascii=False, indent=2)
    with open("./user_test/blogs_user_012.json", "w", encoding="utf-8") as f:
        json.dump(results_all, f, ensure_ascii=False, indent=2, default=str)

    print("✅ 검색 결과가 blogs_user_012.json으로 저장되었습니다.")

    # score에 의한 정렬하기
    # results_all.sort(key=lambda x: x["score"], reverse=True)

    print("\n🔍 유사 문서:")
    for i, r in enumerate(results_all, start=1):
        print(f"- ID: {i}. {r['id']}")
        print(f"  🔹 Title: {r['title']}")
        print(f"  🔹 Category: {r['category']}")
        print(f"  🔹 URL: {r['url']}")
        print(f"  🔹 thumbNailUrl: {r['thumbNailUrl']}")
        print(f"  🔹 Content: {r['content'][:500]}...\n")
        print(f"  🔹 score: {r['score']}...\n")


if __name__ == "__main__":
    main()
