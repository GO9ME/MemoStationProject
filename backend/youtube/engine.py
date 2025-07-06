import re
import requests
import pandas as pd
import numpy as np
from openai import OpenAI
from googleapiclient.discovery import build
import json
from io import StringIO
from utils import cosine_similarity
from config import OPENAI_API_KEY, YOUTUBE_API_KEY, CATEGORY_EXPLANATIONS, CATEGORY_DIMENSION_WEIGHTS, DIMENSION_INFO, KEYWORD_SYNONYMS

from dotenv import load_dotenv
import os
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key = OPENAI_API_KEY)
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

def extract_keywords(contents: str) -> list:
    if not contents or not isinstance(contents, str):
        return []

    keywords = []
    keyword_labels = ["관심사", "관심사 키워드", "일상 키워드", "키워드"]

    # 1. 코드블럭 내부 CSV 구조 감지
    if '```' in contents and any(label in contents for label in keyword_labels):
        blocks = re.findall(r"```(.*?)```", contents, flags=re.DOTALL)
        for block in blocks:
            if any(label in block for label in keyword_labels):
                try:
                    df = pd.read_csv(StringIO(block))
                    for label in keyword_labels:
                        if label in df.columns:
                            for val in df[label].dropna():
                                split_kw = re.split(r"[\,\|/\\·•\s]+", str(val))
                                keywords.extend([k.strip() for k in split_kw if k.strip()])
                except Exception:
                    continue

    # 2. 마크다운 표 구조 감지
    elif '|' in contents and any(label in contents for label in keyword_labels):
        lines = contents.splitlines()
        header_idx = next((i for i, l in enumerate(lines) if any(label in l for label in keyword_labels) and '|' in l), None)
        if header_idx is not None and header_idx + 2 < len(lines):
            data_lines = lines[header_idx + 2:]
            header_line = lines[header_idx].split('|')
            col_index = None
            for idx, h in enumerate(header_line):
                if any(label in h for label in keyword_labels):
                    col_index = idx
                    break
            if col_index is not None:
                for row in data_lines:
                    cols = row.split('|')
                    if len(cols) > col_index:
                        raw = cols[col_index].strip()
                        split_kw = re.split(r"[\,\|/\\·•\s]+", raw)
                        keywords.extend([k.strip() for k in split_kw if k.strip()])

    # 3. 대괄호 기반 키워드 블록 감지 ([일상 키워드])
    matches = re.findall(r"\[(관심사 키워드|일상 키워드|키워드|관심사)\]\s*\n?(.*?)(?=\n\[|\n\Z|$)", contents, flags=re.DOTALL)
    for _, block in matches:
        line = block.strip().split('\n')[0]
        split_kw = re.split(r"[\,\|/\\·•\s]+", line)
        keywords.extend([k.strip() for k in split_kw if k.strip()])

    # 4. 일반 라벨: 키워드: ... 형식
    for label in keyword_labels:
        match = re.search(rf"{label}\s*[:：]\s*([^\n]+)", contents)
        if match:
            kw_raw = match.group(1).strip()
            split_kw = re.split(r"[\,\|/\\·•\s]+", kw_raw)
            keywords.extend([kw.strip() for kw in split_kw if kw.strip()])

    return list(set(keywords))


# 2. GPT 요약 + 관련 메모 ID 추출
def summarize_texts(df, keyword):
    matched_df = df[df['extracted_keywords'].apply(lambda lst: keyword in lst)]
    texts = matched_df['clean_text'].tolist()
    memo_ids = matched_df['id'].tolist()
    input_text = "\n".join(texts[:5])
    prompt = f"""다음은 '{keyword}'와 관련된 사용자의 메모들입니다. 이 내용을 기반으로 핵심만 요약해 주세요. 최대 2~3문장으로 정리:\n\n{input_text}"""
    
    res = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.5
    )
    return res.choices[0].message.content.strip(), memo_ids

# 3. 카테고리 선택 로직
def choose_category(df, keyword):
    subset = df[df['extracted_keywords'].apply(lambda lst: keyword in lst)]

    if subset.empty:
        return 'balanced_type'
    cat_counts = subset['category'].value_counts()

    if len(cat_counts) == 1:
        return cat_counts.idxmax()
    
    dims = ['recency', 'credibility', 'utility', 'archive', 'diversity', 'analyticity']
    avg_dims = subset[dims].mean().sort_values(ascending=False)
    top2_dims = avg_dims.head(2).index.tolist()

    candidates = []
    for cat, weights in CATEGORY_DIMENSION_WEIGHTS.items():
        score = sum([weights.get(dim, 0) for dim in top2_dims])
        candidates.append((cat, score))
    candidates.sort(key=lambda x: x[1], reverse=True)
    return candidates[0][0] if candidates else 'balanced_type'

# 4-1. 검색어 추출 (GPT)
def extract_search_keywords(summary: str, keyword: str) -> list:
    prompt = f"""
아래 요약문은 사용자의 관심 메모를 바탕으로 생성되었습니다. 이 내용을 YouTube에 검색하기 가장 적합한 핵심 키워드 최대 5개를 추출하여 한 줄로 출력해 주세요. 쉼표 없이 공백으로 구분된 단어들로 구성해 주세요.

- 원 키워드: {keyword}
- 요약문:
{summary}

형식: 키워드1 키워드2 키워드3 키워드4 키워드5
"""
    res = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.5
    )
    return res.choices[0].message.content.strip().split()[:3]  # 최대 3개만


# 4-2. 사용자 요약문을 기반으로 GPT가 자연어 검색 문장을 생성하는 함수
def generate_search_query_by_gpt(summary: str) -> str:
    prompt = f"""
사용자의 관심사 요약은 다음과 같아:

\"\"\"{summary}\"\"\"

이 사용자가 유튜브에서 검색할 법한 자연스러운 검색 문장 1개만 만들어줘.
너무 길거나 복잡하지 않고, 직관적인 단문으로.
"""
    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.4
    )

    return response.choices[0].message.content.strip()


# 5-1. 영상 임베딩 가능 여부 with 캐싱
embedable_cache = {}
def is_video_embedable(video_id: str) -> bool:
    if video_id in embedable_cache:
        return embedable_cache[video_id]
    url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={video_id}&format=json"
    try:
        response = requests.get(url, timeout=3)
        valid = response.status_code == 200
    except requests.exceptions.RequestException:
        valid = False
    embedable_cache[video_id] = valid
    return valid


# 5-2. 단일 쿼리 문장(자연어 or 키워드 OR 연결)을 기반으로 YouTube API에서 영상 검색
def fetch_youtube_videos_by_query(query: str, max_results=20) -> list:
    url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        "part": "snippet",
        "q": query,
        "type": "video",
        "maxResults": max_results,
        "key": YOUTUBE_API_KEY
    }
    res = requests.get(url, params=params)
    print(f"[YouTube API] status_code: {res.status_code}")
    print(f"[YouTube API] response: {res.text[:300]}")
    
    if res.status_code != 200:
        return []
    videos = []
    for item in res.json().get("items", []):
        video_id = item['id'].get('videoId')
        # if not video_id or not is_video_embedable(video_id):
        #     continue
        videos.append({
            "title": item['snippet']['title'],
            "url": f"https://www.youtube.com/watch?v={video_id}",
            "description": item['snippet']['description'],
            "video_id": video_id
        })
    return videos


# 5-3. 하이브리드 서치
def hybrid_youtube_search(summary: str, keyword: str) :
    # (1) 키워드 기반 검색어 (기존 방식)
    keywords = extract_search_keywords(summary, keyword)
    keyword_query = " OR ".join(keywords)   # 너무 많으면 노이즈
    keyword_videos = fetch_youtube_videos_by_query(keyword_query, max_results=20)

    # (2) 자연어 문장 검색어 (GPT 방식)
    natural_query = generate_search_query_by_gpt(summary)
    natural_videos = fetch_youtube_videos_by_query(natural_query, max_results=20)

    # (3) 병합 + 중복 제거
    seen = {}
    merged_videos = []
    for video in keyword_videos + natural_videos:
        vid = video.get("video_id")
        if not vid:
            continue
        if vid not in seen:
            video["duplicate_count"] = 1
            video["sources"] = ["keyword"] if video in keyword_videos else ["natural"]
            seen[vid] = video
        else:
            seen[vid]["duplicate_count"] += 1
            source = "keyword" if video in keyword_videos else "natural"
            if source not in seen[vid]["sources"]:
                seen[vid]["sources"].append(source)

    merged_videos = list(seen.values())

    return merged_videos, keyword_query, natural_query


# 6-1. GPT 임베딩
def get_embedding(text: str):
    response = client.embeddings.create(input=[text], model="text-embedding-3-large")
    return response.data[0].embedding


# 6-2. 리랭크 함수 (summary, keyword_query, natural_query 기준 비교)
def rerank_videos_multiple_methods(summary: str, keyword_query: str, natural_query: str, videos: list):
    summary_vec = get_embedding(summary)
    keyword_vec = get_embedding(keyword_query)
    natural_vec = get_embedding(natural_query)

    reranked = []
    for v in videos:
        video_text = f"{v['title']} {v['description']}"
        video_vec = get_embedding(video_text)
        sim_summary = cosine_similarity(summary_vec, video_vec)
        sim_keyword = cosine_similarity(keyword_vec, video_vec)
        sim_natural = cosine_similarity(natural_vec, video_vec)
        reranked.append((v, sim_summary, sim_keyword, sim_natural))
    return reranked



# 7. GPT 추천 이유 생성
def generate_gpt_reason(summary: str, category: str, video: dict, age: int, keyword: str) -> str:
    prompt = f"""
당신은 개인화 추천 시스템을 설계하는 전문가입니다.
다음 정보를 바탕으로 해당 유튜브 영상을 추천하는 이유를 2~3문장으로 설명해 주세요:

- 사용자 나이: {age}
- 관심 키워드: {keyword}
- 카테고리 성향: {category}
- 메모 요약: {summary}
- 영상 제목: {video['title']}
- 영상 설명: {video['description']}
"""
    res = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.5
    )
    return res.choices[0].message.content.strip()


# 8. 메인 추천 실행 함수
def recommend_for_users(df_filtered: pd.DataFrame) -> list:
    results = []
    df_filtered['extracted_keywords'] = df_filtered['contents'].apply(extract_keywords)
    
    for user_id, user_df in df_filtered.groupby('user_id'):
        age = int(user_df['persona_age'].iloc[0])
        all_kws = sum(user_df['extracted_keywords'].tolist(), [])
        top5 = pd.Series(all_kws).value_counts().head(5).index.tolist()

        rec_count = 0
        for kw in top5:
            if rec_count >= 20:
                break

            summary, memo_ids = summarize_texts(user_df, kw)
            category = choose_category(user_df, kw)
            explanation = CATEGORY_EXPLANATIONS.get(category, "")

            # 유튜브 서치 및 리랭킹
            videos, keyword_query, natural_query = hybrid_youtube_search(summary, kw)
            reranked = rerank_videos_multiple_methods(summary, keyword_query, natural_query, videos)

            added = 0

            for v, sim_summary, sim_keyword, sim_natural in reranked:
                gpt_reason = generate_gpt_reason(summary, category, v, age, kw)
                final_reason = (
                    f"{age}세 사용자의 '{kw}' 관심사를 반영한 요약문과 '{category}' 성향({explanation})에 기반해 추천되었습니다.\n"
                    f"GPT 추천 의견: {gpt_reason}"
                )
                results.append({
                    'user_id': user_id,
                    'user_age': age,
                    'keyword': kw,
                    'search_keywords': keyword_query,
                    'summary': summary,
                    'summary_source_memo_ids': memo_ids,
                    'category': category,
                    'category_explanation': explanation,
                    'youtube_title': v['title'],
                    'youtube_url': v['url'],
                    'similarity_summary': round(sim_summary, 4),
                    'similarity_keyword_query': round(sim_keyword, 4),
                    'similarity_natural_query': round(sim_natural, 4),
                    'duplicate_count': v.get("duplicate_count", 1),
                    'source_count': len(set(v.get("sources", []))),
                    'reason': final_reason
                })
                rec_count += 1
                added += 1
                if added >= 4:
                    break
    return results
