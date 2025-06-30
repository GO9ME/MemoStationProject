import json
import faiss
import numpy as np
import time
import os
import re
import nltk


from pathlib import Path
from dotenv import load_dotenv
from typing import List, Dict, Optional, Tuple
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
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
        # self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

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

        print(os.getenv("OPENAI_API_KEY"))

        if not self.api_key:
            raise ValueError("OpenAI API 키가 필요합니다.")
        self.openai_client = OpenAI(api_key=self.api_key)

        # 한국어/영어 불용어 설정
        self.stop_words = set(stopwords.words("english"))
        try:
            self.stop_words.update(stopwords.words("korean"))
        except:
            pass

        # TF-IDF 벡터라이저
        self.vectorizer = TfidfVectorizer(
            max_features=5000, stop_words=list(self.stop_words), ngram_range=(1, 2)
        )

        # 블로그 데이터 저장소
        self.blog_data = []
        self.blog_embeddings = None
        self.blog_tfidf_matrix = None

        # 카테고리 매핑
        self.category_mapping = {
            "지식동향": [
                "교육학문",
                "어학외국어",
                "비즈니스경제",
                "건강의학",
                "사회정치",
                "IT컴퓨터",
            ],
            "취미여가여행": [
                "맛집",
                "세계여행",
                "국내여행",
                "취미",
                "자동차",
                "사진",
                "스포츠",
                "게임",
            ],
            "생활노하우쇼핑": [
                "원예재배",
                "상품리뷰",
                "요리레시피",
                "인테리어DIY",
                "패션미용",
                "좋은글이미지",
                "반려동물",
                "육아결혼",
                "일상생각",
            ],
            "엔터테인먼트예술": [
                "방송",
                "만화애니",
                "스타연예인",
                "드라마",
                "음악",
                "공연전시",
                "미술디자인",
                "영화",
                "문학책",
            ],
        }

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

    def categorize_memo(self, memo_text: str, n: int = 2) -> str:
        # LLM 분류는 선택적으로 사용 (API 오류 방지)
        try:
            prompt = f"""

반드시 아래와 같은 형식으로 Json 형태로 만들어줘.

"category": "추천 카테고리",
"user_type": "사용자의 성향을 분석하여 넣어준다.",
"prompt": "쿼리 내용을 배열로 넣어준다."

### 사용자 메모 분석
{memo_text[:1000]}

### 추천 category 예시
- 지식동향 >  IT·컴퓨터 
- 생활노하우쇼핑 > 일상생각

### 사용자 성향 예시
- 실용적이고 분석적인 글 선호
- AI와 직무개발에 관심 많음
- 외로움/소통 문제도 느끼고 있음

## 블로그 category:
1. 지식동향: 건강의학, 교육학문, 비즈니스경제, 사회정치, 어학외국어, IT·컴퓨터
2. 취미여가여행: 게임, 국내여행, 맛집, 사진, 세계여행, 스포츠, 자동차, 취미
3. 생활노하우쇼핑: 반려동물, 상품리뷰, 요리레시피, 원예재배, 육아결혼, 인테리어DIY, 일상생각, 좋은글이미지, 펴션미용
4. 엔터테인먼트예술: 공연전신, 드라마, 만화애니, 문학책, 미술디자인, 방송, 스타연예인, 영화, 음악


※ 어학/학습/공부/표현/영어/외국어 관련 단어가 하나라도 나오면 반드시 '지식동향'으로 분류하세요.
※ 음식/요리/레시피 관련 단어가 나오면 반드시 '생활노하우쇼핑'으로 분류하세요.
※ 게임/RPG/플레이 관련 단어가 나오면 반드시 '취미여가여행'으로 분류하세요.
※ 위의 카테고리에 명확히 해당하지 않을 때는 가장 근접한 카테고리를 선택하세요. '기타'는 사용하지 마세요.
            """

            system_prompt = f"""
                        당신은 메모 기반 성향 분석 데이터를 가지고 쿼리를 작성해 주는 전문가입니다. 그 아래는 사용자의 최근 메모에 대해 사전 분석된 항목입니다. 
                        이를 기반으로 사용자의 성향을 요약하고, 
                        가장 적절한 블로그 카테고리 1~2개를 선택해 주세요. 또한, 추천된 카테고리와 분석된 사용자 성향을 넣어 블로그 콘텐츠를 저장한 벡터디비에서 추천할 수 있는 
                        LLM용 쿼리를 함께 작성해주고 의미는 유지하면서 다양한 표현방식으로 재작성한 쿼리를 {n}개 만들어줘. 
                        LLM용 쿼리에는 추천 category도 포함해줘, '기타' 카테고리는 사용하지 마세요.
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
            # if llm_category != "기타":
            #     return llm_category
            return llm_category

        except Exception as e:
            print(f"LLM 카테고리 분류 중 오류 발생: {e}")
            # LLM 오류 시 키워드 기반 분류 결과 사용

    def get_openai_embedding(self, text: str):
        response = self.openai_client.embeddings.create(
            input=[text], model=self.embedding_model
        )
        return response.data[0].embedding

    def load_documents_from_folder(self):
        all_docs = []
        for filename in os.listdir(self.folder_path):
            if filename.endswith(".json"):
                filepath = os.path.join(self.folder_path, filename)
                with open(filepath, "r", encoding="utf-8") as f:
                    try:
                        data = json.load(f)
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
                self.doc_ids.extend(meta["ids"])
                self.doc_texts.extend(meta["texts"])
                self.doc_meta.extend(meta["meta"])
            return self.index

        print("[INFO] 파일로드중..")
        documents = self.load_documents_from_folder()
        self.doc_texts = [doc["content"] for doc in documents]
        self.doc_ids = [doc.get("id", idx) for idx, doc in enumerate(documents)]
        self.doc_meta = [
            {
                "title": doc.get("title", ""),
                "url": doc.get("url", ""),
                "thumbNailUrl": doc.get("thumbNailUrl", ""),
                "category": doc.get("category", ""),
            }
            for doc in documents
        ]
        print("[INFO] embedding중...")
        embeddings = []
        for i, text in enumerate(self.doc_texts):
            emb = self.get_openai_embedding(text)
            embeddings.append(emb)
            time.sleep(0.5)
            print(f"[{i+1}/{len(self.doc_texts)}] 임베딩 완료")

        embeddings = np.array(embeddings).astype("float32")

        dim = embeddings.shape[1]
        self.index = faiss.IndexFlatL2(dim)
        self.index.add(embeddings)

        np.save(self.embed_path, embeddings)
        faiss.write_index(self.index, self.index_path)
        with open(self.meta_path, "w", encoding="utf-8") as f:
            json.dump(
                {"ids": self.doc_ids, "texts": self.doc_texts, "meta": self.doc_meta},
                f,
                ensure_ascii=False,
            )

        print("[INFO] 인덱스 및 메타데이터 저장 완료")
        return self.index

    def search(self, query: str, top_k: int = 3):
        if self.index is None:
            raise ValueError(
                "FAISS 인덱스가 초기화되지 않았습니다. 먼저 build_or_load_index()를 호출하세요."
            )

        query_vec = np.array([self.get_openai_embedding(query)]).astype("float32")
        D, I = self.index.search(query_vec, top_k)

        results = []
        for i in I[0]:
            idx = int(i)
            results.append(
                {
                    "id": self.doc_ids[idx],
                    "content": self.doc_texts[idx],
                    "title": self.doc_meta[idx]["title"],
                    "url": self.doc_meta[idx]["url"],
                    "thumbNailUrl": self.doc_meta[idx]["thumbNailUrl"],
                    "category": self.doc_meta[idx]["category"],
                }
            )
        return results


def main():
    """메인 실행 함수"""
    # 환경 변수 로드
    load_dotenv()

    # 시스템 초기화
    recommender = RAGBlogRecommender()
    # recommender.initialize_system()

    # 메모에서 추출한 데이터
    momo_result = """
        {
        "contents": "오늘 사내 AI 워크숍에서 최신 자연어 처리 기술 동향 파악. 실시간 토론 중 소통...",
        "interests": ["AI 트렌드", "기술 동향", "직업 개발"],
        "pain_points": ["대인 관계", "소통 문제", "외로움"],
        "style": "분석적인",
        "최신성": 1.0,
        "신뢰성": 1.0,
        "실용성": 1.0,
        "아카이브성": 1.0,
        "다양성": 0.5,
        "분석성": 1.0,
        "category": "cautious_type"
        }
    """

    # LLM을 통한 성향 카테고리, 사용자 성향, 프롬프트를 뽑는다.
    response = recommender.categorize_memo(momo_result)
    print(response)

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

    print("\n🔍 유사 문서:")
    for r in results_all:
        print(f"- ID: {r['id']}")
        print(f"  🔹 Title: {r['title']}")
        print(f"  🔹 Category: {r['category']}")
        print(f"  🔹 URL: {r['url']}")
        print(f"  🔹 thumbNailUrl: {r['thumbNailUrl']}")
        print(f"  🔹 Content: {r['content'][:500]}...\n")


if __name__ == "__main__":
    main()
