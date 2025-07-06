from fastapi import FastAPI, Request, Query, HTTPException, Response, Body
from fastapi.middleware.cors import CORSMiddleware
import requests
import os
from dotenv import load_dotenv
import json
import csv
import pandas as pd
import pymysql  # mysql.connector 대신 pymysql 사용
import glob
import re
from typing import List, Dict, Any, Optional
import openai
import sys
import os as _os
sys.path.append(_os.path.join(_os.path.dirname(__file__), 'youtube'))
from engine import hybrid_youtube_search

# .env 파일 로드
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'))

app = FastAPI()

# CORS 허용 (로컬 개발용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 실제 서비스에서는 도메인 제한 권장
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

NOTION_TOKEN = os.getenv("NOTION_TOKEN")
# NOTION_DATABASE_ID는 하이픈 없는 32자리 문자열(예: 32c63b2b0b0e40a0a0e2229ff7e6472f)로 입력해도 정상 동작합니다.
NOTION_DATABASE_ID = os.getenv("NOTION_DATABASE_ID")

DATA_PATH = os.path.join(os.path.dirname(__file__), 'data', 'notion', 'notion_notes.json')
MEMO_CSV_PATH = os.path.join(os.path.dirname(__file__), 'data', 'memo', 'generated_memos (2).csv')
persona_id = "사용자_001"

# MySQL 접속 정보 환경변수에서 불러오기
MYSQL_CONFIG = {
    'host': 'localhost',  # 127.0.0.1 대신 localhost 사용
    'port': 3306,
    'user': 'root', # 사용자_001 님께서 제공하신 정보로 수정
    'password': '1234', # 사용자_001 님께서 제공하신 정보로 수정
    'database': 'memostation', # 사용자_001 님께서 제공하신 정보로 수정
    'charset': 'utf8mb4',  # pymysql에서 한글 지원을 위한 설정
    'cursorclass': pymysql.cursors.DictCursor,  # 딕셔너리 형태로 결과 반환
    'connect_timeout': 10  # 연결 시간 늘림
}

def get_mysql_connection():
    """
    MySQL DB 커넥션 반환 함수 (pymysql 사용)
    """
    print("[Debug] MySQL 연결 시도 중...") # 디버그
    try:
        conn = pymysql.connect(**MYSQL_CONFIG)
        print("[Debug] MySQL 연결 성공.") # 디버그
        return conn
    except Exception as e:
        print(f"[Debug] MySQL 연결 오류: {e}") # 디버그
        return None

@app.post("/api/notion")
def get_notion_pages():
    url = f"https://api.notion.com/v1/databases/{NOTION_DATABASE_ID}/query"
    headers = {
        "Authorization": f"Bearer {NOTION_TOKEN}",
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
    }
    response = requests.post(url, headers=headers)
    return response.json()

@app.post("/api/notion-save")
def save_notion_notes(request: Request):
    # 프론트에서 받아온 노션 데이터(JSON)를 파일로 저장
    data = None
    try:
        data = request.json()
    except Exception:
        return {"error": "잘못된 요청입니다."}
    with open(DATA_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    return {"success": True}

@app.get("/api/notion-notes")
def get_saved_notion_notes():
    # 저장된 노션 노트 데이터를 반환
    if not os.path.exists(DATA_PATH):
        return []
    with open(DATA_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)

@app.get("/api/memo-notes")
def get_memo_notes(page: int = Query(1, ge=1), size: int = Query(30, ge=1, le=100)):
    """
    메모 CSV 파일을 페이지네이션하여 JSON 리스트로 반환합니다.
    page: 1부터 시작, size: 1~100 (기본 30)
    최신순 정렬, 전체 개수(total)도 함께 반환
    """
    if not os.path.exists(MEMO_CSV_PATH):
        return {"total": 0, "notes": []}
    try:
        df = pd.read_csv(MEMO_CSV_PATH, encoding='utf-8')
        if 'date' in df.columns:
            df = df.sort_values('date', ascending=False)
        total = len(df)
        start = (page - 1) * size
        end = start + size
        notes = df.iloc[start:end].to_dict(orient='records')
        return {"total": total, "notes": notes}
    except Exception as e:
        return {"total": 0, "notes": []}

@app.get("/api/memos")
def get_memos(page: int = Query(1, ge=1), size: int = Query(8, ge=1, le=100)):
    """
    MySQL DB에서 memos 테이블의 메모를 페이지네이션하여 반환합니다.
    새 테이블 구조
    """
    try:
        conn = get_mysql_connection()
        if not conn:
            return {"memos": [], "has_more": False, "error": "DB 연결 실패"}
        cursor = conn.cursor()  # pymysql에서는 이미 DictCursor로 설정되어 있음
        offset = (page - 1) * size
        cursor.execute("""
            SELECT id, memo_type, persona_id, persona_age, persona_profession, 
                   date, content, interests, pain_points, style, keyword, summary 
            FROM memos 
            ORDER BY date DESC 
            LIMIT %s OFFSET %s
        """, (size + 1, offset))
        rows = cursor.fetchall()
        memos = rows[:size]
        has_more = len(rows) > size
        conn.close()
        return {"memos": memos, "has_more": has_more}
    except Exception as e:
        return {"memos": [], "has_more": False, "error": str(e)}

@app.get("/api/memos/{note_id}")
def get_memo_detail(note_id: int):
    """
    MySQL DB에서 memos 테이블의 특정 메모 상세 정보를 반환합니다.
    새 테이블 구조: id, memo_type, persona_id, persona_age, persona_profession, date, content, interests, pain_points, style, keyword, summary
    """
    try:
        conn = get_mysql_connection()
        if not conn:
            raise HTTPException(status_code=500, detail="DB 연결 실패")
        cursor = conn.cursor()  # pymysql에서는 이미 DictCursor로 설정되어 있음
        cursor.execute("""
            SELECT id, memo_type, persona_id, persona_age, persona_profession, 
                   date, content, interests, pain_points, style, keyword, summary 
            FROM memos 
            WHERE id=%s
        """, (note_id,))
        row = cursor.fetchone()
        conn.close()
        if row:
            return row
        else:
            raise HTTPException(status_code=404, detail="메모를 찾을 수 없습니다.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/memos/{note_id}")
def update_memo(note_id: int, data: dict = Body(...)):
    """
    특정 메모(note_id)의 내용을 수정하는 엔드포인트입니다.
    요청 body에서 content, summary, keyword, interests, memo_type(=mood) 등을 받아 DB를 업데이트합니다.
    """
    # 수정 가능한 필드 목록
    allowed_fields = ["content", "summary", "keyword", "interests", "memo_type"]
    update_fields = {k: v for k, v in data.items() if k in allowed_fields and v is not None}
    if not update_fields:
        raise HTTPException(status_code=400, detail="수정할 데이터가 없습니다.")
    try:
        conn = get_mysql_connection()
        if not conn:
            raise HTTPException(status_code=500, detail="DB 연결 실패")
        cursor = conn.cursor()
        # 동적으로 SET 절 생성
        set_clause = ", ".join([f"{k}=%s" for k in update_fields.keys()])
        values = list(update_fields.values())
        values.append(note_id)
        sql = f"UPDATE memos SET {set_clause} WHERE id=%s"
        cursor.execute(sql, values)
        conn.commit()
        conn.close()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="해당 메모를 찾을 수 없습니다.")
        return {"success": True, "updated_fields": list(update_fields.keys())}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"메모 수정 중 오류 발생: {str(e)}")

# 추천 시스템 관련 함수들
def extract_keywords_from_text(text: str) -> List[str]:
    """텍스트에서 키워드를 추출합니다."""
    print(f"[Debug] extract_keywords_from_text 호출됨: 텍스트 길이 {len(text) if text else 0}") # 디버그
    if not text:
        return []
    
    # 간단한 키워드 추출 (한글 2글자 이상)
    keywords = re.findall(r'[가-힣]{2,}', text)
    return list(set(keywords))

def load_blog_data() -> List[Dict]:
    """data 폴더의 블로그 데이터를 모두 로드합니다."""
    data_dir = os.path.join(os.path.dirname(__file__), 'data')
    blog_files = glob.glob(os.path.join(data_dir, '*.json'))
    
    all_blogs = []
    for file_path in blog_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                blogs = json.load(f)
                for blog in blogs:
                    blog['data_source'] = os.path.basename(file_path)
                all_blogs.extend(blogs)
        except Exception as e:
            print(f"파일 로드 오류 {file_path}: {e}")
    
    return all_blogs

def recommend_blogs_for_user(user_keywords: List[str], blog_data: List[Dict], limit: int = 10) -> List[Dict]:
    """사용자 키워드를 바탕으로 블로그를 추천합니다."""
    print(f"[Debug] recommend_blogs_for_user 호출됨: 사용자 키워드 {user_keywords}, 블로그 데이터 {len(blog_data)}개") # 디버그
    scored_blogs = []
    
    for blog in blog_data:
        score = 0
        title = blog.get('title', '')
        content = blog.get('content', '')
        
        # 썸네일 이미지 URL 추가 (기존 데이터에 없으면 기본값 설정)
        if 'thumbNailUrl' not in blog:
            # 기본 이미지 URL 목록
            default_images = [
                "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg",
                "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg",
                "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg",
                "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg",
                "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg",
                "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg", # 노트북 코딩 이미지
                "https://images.pexels.com/photos/4974915/pexels-photo-4974915.jpeg", # 노트북 작업 이미지
                "https://images.pexels.com/photos/4050291/pexels-photo-4050291.jpeg" # 노트북 타이핑 이미지
            ]
            
            # 노트북 관련 이미지 (코딩, 프로그래밍 등 키워드가 있을 때 사용)
            laptop_images = [
                "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg",
                "https://images.pexels.com/photos/4974915/pexels-photo-4974915.jpeg",
                "https://images.pexels.com/photos/4050291/pexels-photo-4050291.jpeg"
            ]
            
            # 코딩/개발 관련 키워드가 있는지 확인
            coding_keywords = [
                '코딩', '프로그래밍', '개발', '소프트웨어', '엔지니어', 'IT', '컴퓨터', '기술', '알고리즘', '웹',
                'coding', 'programming', 'development', 'software', 'engineer', 'computer', 'tech', 'algorithm', 'web',
                'python', 'java', 'javascript', 'html', 'css', 'react', 'node', 'api', 'database', 'data'
            ]
            is_coding_related = any(keyword in title.lower() or keyword in content.lower() for keyword in coding_keywords)
            
            # 블로그 ID나 제목 해시값을 기준으로 이미지 선택 (일관성 유지)
            import hashlib
            hash_value = int(hashlib.md5((title + content[:20]).encode()).hexdigest(), 16)
            
            if is_coding_related:
                # 코딩 관련 내용이면 노트북 이미지 중에서 선택
                blog['thumbNailUrl'] = laptop_images[hash_value % len(laptop_images)]
            else:
                # 그 외의 경우 일반 이미지에서 선택
                blog['thumbNailUrl'] = default_images[hash_value % len(default_images)]
        
        # 키워드 매칭 점수 계산
        for keyword in user_keywords:
            if keyword in title:
                score += 3  # 제목에 있으면 높은 점수
            if keyword in content:
                score += 1  # 내용에 있으면 낮은 점수
        
        if score > 0:
            blog['recommendation_score'] = score
            scored_blogs.append(blog)
    
    # 점수순 정렬
    scored_blogs.sort(key=lambda x: x['recommendation_score'], reverse=True)
    print(f"[Debug] recommend_blogs_for_user 반환: {len(scored_blogs)}개 블로그 추천") # 디버그
    return scored_blogs[:limit]

def get_user_keywords_from_memos(user_id: str) -> List[str]:
    """사용자의 메모에서 keyword 칼럼을 추출합니다."""
    print(f"[Debug] get_user_keywords_from_memos 호출됨: user_id={user_id}") # 디버그
    try:
        conn = get_mysql_connection()
        if not conn:
            print("[Debug] get_user_keywords_from_memos: DB 연결 실패") # 디버그
            return []
        cursor = conn.cursor()  # pymysql에서는 이미 DictCursor로 설정되어 있음
        # keyword 칼럼만 select
        cursor.execute("SELECT keyword FROM memos WHERE persona_id=%s ORDER BY date DESC LIMIT 20", (user_id,))
        memos = cursor.fetchall()
        conn.close()
        all_keywords = []
        for memo in memos:
            # keyword 칼럼이 콤마(,)로 구분된 문자열이면 split
            keywords = [kw.strip() for kw in (memo.get('keyword') or '').split(',') if kw.strip()]
            all_keywords.extend(keywords)
        # 키워드 빈도수 계산하여 상위 10개 반환
        from collections import Counter
        keyword_counts = Counter(all_keywords)
        final_keywords = [kw for kw, count in keyword_counts.most_common(10)]
        print(f"[Debug] get_user_keywords_from_memos 반환: 키워드 {final_keywords}") # 디버그
        return final_keywords
    except Exception as e:
        print(f"[Debug] 키워드 추출 오류: {e}") # 디버그
        return []

@app.get("/api/recommendations/{memo_id}")
def get_recommendations(memo_id: int, content_type: str = Query("all", regex="^(all|blog|youtube)$")):
    """메모 ID를 기반으로 추천 컨텐츠를 반환합니다."""
    print(f"[Debug] get_recommendations 호출됨: memo_id={memo_id}, content_type={content_type}") # 디버그
    try:
        # memo_id로 persona_id 조회 (실제 값과 무관하게 고정값 사용)
        persona_id = '사용자_001'
        # 기존 로직과 동일하게 persona_id 사용
        user_keywords = get_user_keywords_from_memos(persona_id)
        if not user_keywords:
            print("[Debug] get_recommendations: 사용자 키워드 부족") # 디버그
            return {"recommendations": [], "message": "분석할 메모가 부족합니다."}
        recommendations = {
            "persona_id": persona_id,
            "keywords": user_keywords,
            "content": {}
        }
        # 블로그 추천
        if content_type in ["all", "blog"]:
            blog_data = load_blog_data()
            recommended_blogs = recommend_blogs_for_user(user_keywords, blog_data, limit=5)
            recommendations["content"]["blogs"] = recommended_blogs
        # 유튜브 추천
        if content_type in ["all", "youtube"]:
            summary = " ".join(user_keywords)
            keyword = user_keywords[0] if user_keywords else ""
            videos, keyword_query, natural_query = hybrid_youtube_search(summary, keyword)
            recommendations["content"]["youtube"] = videos
        print(f"[Debug] get_recommendations 반환: {recommendations}") # 디버그
        return recommendations
    except Exception as e:
        print(f"[Debug] 추천 API 오류 발생: {e}") # 디버그
        raise HTTPException(status_code=500, detail=str(e))

# 새로운 추천 엔드포인트 - POST 요청 처리
@app.post("/recommend")
async def recommend_content(request: Request):
    """
    사용자 ID를 POST 요청으로 받아 추천 콘텐츠를 반환합니다.
    프론트엔드에서 http://127.0.0.1:8000/recommend로 요청하는 경우를 처리합니다.
    """
    print("[Debug] POST /recommend 호출됨") # 디버그
    try:
        # POST 요청 본문 파싱
        data = await request.json()
        user_id = data.get("user_id")
        content_type = data.get("content_type", "all")
        
        if not user_id:
            raise HTTPException(status_code=400, detail="user_id가 필요합니다.")
        
        print(f"[Debug] POST /recommend 요청 파라미터: user_id={user_id}, content_type={content_type}")
        
        # 기존 추천 로직 재사용
        return get_recommendations(user_id, content_type)
    except Exception as e:
        print(f"[Debug] POST /recommend 오류 발생: {e}") # 디버그
        raise HTTPException(status_code=500, detail=str(e))

# 추후 LLM 연동 엔드포인트도 이 서버에 추가하면 됩니다.

# 외부 이미지를 프록시해서 전달하는 엔드포인트
@app.get("/api/image-proxy")
def image_proxy(url: str = Query(..., description="이미지 원본 URL")):
    """외부 이미지를 서버가 중계해서 반환 (CORS 우회용)"""
    try:
        r = requests.get(url, timeout=5)
        r.raise_for_status()
        return Response(content=r.content, media_type=r.headers.get("Content-Type", "image/jpeg"))
    except Exception as e:
        return Response(status_code=404)

@app.get("/api/search-suggestions")
def get_search_suggestions(q: str = Query(..., min_length=1), limit: int = Query(5, ge=1, le=10)):
    """
    검색어를 기반으로 memos 테이블에서 유사한 내용을 검색하여 자동완성 제안을 반환합니다.
    content, summary, keyword 필드에서 검색합니다.
    """
    try:
        conn = get_mysql_connection()
        if not conn:
            return {"suggestions": [], "error": "DB 연결 실패"}
        
        cursor = conn.cursor()
        search_term = f"%{q}%"
        
        # content, summary, keyword 필드에서 검색
        cursor.execute("""
            SELECT DISTINCT 
                id, content, summary, keyword, interests, memo_type, date,
                CASE 
                    WHEN content LIKE %s THEN 3
                    WHEN summary LIKE %s THEN 2
                    WHEN keyword LIKE %s THEN 1
                    ELSE 0
                END as relevance_score
            FROM memos 
            WHERE content LIKE %s OR summary LIKE %s OR keyword LIKE %s
            ORDER BY relevance_score DESC, date DESC
            LIMIT %s
        """, (search_term, search_term, search_term, search_term, search_term, search_term, limit))
        
        suggestions = cursor.fetchall()
        conn.close()
        
        # 검색 결과를 프론트엔드 형식에 맞게 변환
        formatted_suggestions = []
        for suggestion in suggestions:
            formatted_suggestions.append({
                "id": suggestion["id"],
                "title": suggestion["summary"] if suggestion["summary"] else suggestion["content"][:50] + "...",
                "content": suggestion["content"][:100] + "..." if len(suggestion["content"]) > 100 else suggestion["content"],
                "keyword": suggestion["keyword"],
                "interests": suggestion["interests"],
                "memo_type": suggestion["memo_type"],
                "date": suggestion["date"].strftime("%Y-%m-%d") if suggestion["date"] else "",
                "relevance_score": suggestion["relevance_score"]
            })
        
        return {"suggestions": formatted_suggestions, "query": q}
    
    except Exception as e:
        return {"suggestions": [], "error": str(e)}

@app.get("/api/filter-options")
def get_filter_options():
    """
    필터링에 사용할 수 있는 옵션들을 DB에서 동적으로 생성하여 반환합니다.
    """
    try:
        conn = get_mysql_connection()
        if not conn:
            return {"filter_options": {}, "error": "DB 연결 실패"}
        
        cursor = conn.cursor()
        
        # 메모 타입 조회
        cursor.execute("SELECT DISTINCT memo_type FROM memos WHERE memo_type IS NOT NULL AND memo_type != ''")
        memo_types = [row["memo_type"] for row in cursor.fetchall()]
        
        # 스타일 조회 (본질적 가치로 사용)
        cursor.execute("SELECT DISTINCT style FROM memos WHERE style IS NOT NULL AND style != ''")
        styles = [row["style"] for row in cursor.fetchall()]
        
        # 관심사 조회
        cursor.execute("SELECT DISTINCT interests FROM memos WHERE interests IS NOT NULL AND interests != ''")
        interests_raw = cursor.fetchall()
        interests = []
        for row in interests_raw:
            if row["interests"]:
                interests.extend([i.strip() for i in row["interests"].split(',') if i.strip()])
        interests = list(set(interests))  # 중복 제거
        
        # 키워드 조회
        cursor.execute("SELECT DISTINCT keyword FROM memos WHERE keyword IS NOT NULL AND keyword != ''")
        keywords_raw = cursor.fetchall()
        keywords = []
        for row in keywords_raw:
            if row["keyword"]:
                keywords.extend([k.strip() for k in row["keyword"].split(',') if k.strip()])
        keywords = list(set(keywords))  # 중복 제거
        
        # 고민사항 조회
        cursor.execute("SELECT DISTINCT pain_points FROM memos WHERE pain_points IS NOT NULL AND pain_points != ''")
        pain_points_raw = cursor.fetchall()
        pain_points = []
        for row in pain_points_raw:
            if row["pain_points"]:
                pain_points.extend([p.strip() for p in row["pain_points"].split(',') if p.strip()])
        pain_points = list(set(pain_points))  # 중복 제거
        
        # 직업 조회
        cursor.execute("SELECT DISTINCT persona_profession FROM memos WHERE persona_profession IS NOT NULL AND persona_profession != ''")
        professions = [row["persona_profession"] for row in cursor.fetchall()]
        
        conn.close()
        
        return {
            "filter_options": {
                "memo_types": memo_types[:10],  # 상위 10개로 제한
                "styles": styles[:10],
                "interests": interests[:15], 
                "keywords": keywords[:20],
                "pain_points": pain_points[:10],
                "professions": professions[:5]
            }
        }
    
    except Exception as e:
        return {"filter_options": {}, "error": str(e)}

@app.get("/api/memos/filtered")
def get_filtered_memos(
    page: int = Query(1, ge=1), 
    size: int = Query(8, ge=1, le=100),
    sort: Optional[str] = Query("recent"),
    memo_types: Optional[str] = Query(None),
    styles: Optional[str] = Query(None),
    keywords: Optional[str] = Query(None),
    interests: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
):
    """
    필터 조건에 따라 메모를 조회합니다.
    """
    print(f"[Debug] get_filtered_memos 호출됨: page={page}, size={size}, sort={sort}, memo_types={memo_types}, styles={styles}, keywords={keywords}, interests={interests}, search={search}")
    try:
        conn = get_mysql_connection()
        if not conn:
            return {"memos": [], "has_more": False, "error": "DB 연결 실패"}
        
        cursor = conn.cursor()
        
        # WHERE 조건 구성
        where_conditions = []
        params = []
        
        # 메모 타입 필터
        if memo_types and memo_types.strip():
            memo_type_list = [t.strip() for t in memo_types.split(',') if t.strip()]
            if memo_type_list:
                where_conditions.append(f"memo_type IN ({','.join(['%s'] * len(memo_type_list))})")
                params.extend(memo_type_list)
        
        # 스타일 필터
        if styles and styles.strip():
            style_list = [s.strip() for s in styles.split(',') if s.strip()]
            if style_list:
                where_conditions.append(f"style IN ({','.join(['%s'] * len(style_list))})")
                params.extend(style_list)
        
        # 키워드 필터
        if keywords and keywords.strip():
            keyword_list = [k.strip() for k in keywords.split(',') if k.strip()]
            for keyword in keyword_list:
                where_conditions.append("keyword LIKE %s")
                params.append(f"%{keyword}%")
        
        # 관심사 필터
        if interests and interests.strip():
            interest_list = [i.strip() for i in interests.split(',') if i.strip()]
            for interest in interest_list:
                where_conditions.append("interests LIKE %s")
                params.append(f"%{interest}%")
        
        # 검색어 필터
        if search and search.strip():
            where_conditions.append("(content LIKE %s OR summary LIKE %s OR keyword LIKE %s)")
            params.extend([f"%{search}%", f"%{search}%", f"%{search}%"])
        
        # WHERE 절 구성
        where_clause = ""
        if where_conditions:
            where_clause = "WHERE " + " AND ".join(where_conditions)
        
        # ORDER BY 절 구성 (허용된 값만 사용)
        allowed_sorts = ["recent", "memo_type", "keyword"]
        if not sort or sort not in allowed_sorts:
            sort = "recent"
            
        order_by = "ORDER BY date DESC"
        if sort == "memo_type":
            order_by = "ORDER BY memo_type, date DESC"
        elif sort == "keyword":
            order_by = "ORDER BY keyword, date DESC"
        
        # 페이지네이션
        offset = (page - 1) * size
        
        # 쿼리 실행
        query = f"""
            SELECT id, memo_type, persona_id, persona_age, persona_profession, 
                   date, content, interests, pain_points, style, keyword, summary 
            FROM memos 
            {where_clause}
            {order_by}
            LIMIT %s OFFSET %s
        """
        
        params.extend([size + 1, offset])  # has_more 판단을 위해 +1
        cursor.execute(query, params)
        rows = cursor.fetchall()
        
        memos = rows[:size]  # 실제 요청된 개수만 반환
        has_more = len(rows) > size
        
        conn.close()
        
        return {"memos": memos, "has_more": has_more}
    
    except Exception as e:
        return {"memos": [], "has_more": False, "error": str(e)}

@app.post("/api/quick-memo")
async def quick_memo(request: Request):
    """빠른 메모 저장: content, mood를 받아 OpenAI로 키워드/요약/관심사 추출 후 DB 저장"""
    data = await request.json()
    content = data.get("content", "")
    mood = data.get("mood", "")
    persona_id = "사용자_001"

    if not content:
        raise HTTPException(status_code=400, detail="메모 내용이 필요합니다.")

    # OpenAI 4.1-mini로 키워드/요약/관심사 추출 (최신 openai 라이브러리 방식)
    client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    prompt = f"""
    아래는 사용자의 메모입니다.
    ---
    {content}
    ---
    1. 이 메모의 핵심 키워드 3~5개(쉼표로 구분, 한글)
    2. 한 줄 요약(한글)
    3. 관심사(주제, 분야 등 한글로 1~2개)
    형식: 
    키워드: ...
    요약: ...
    관심사: ...
    """
    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=200,
        temperature=0.3,
    )
    result = response.choices[0].message.content
    # 파싱
    keyword, summary, interests = "", "", ""
    for line in result.splitlines():
        if line.startswith("키워드:"):
            keyword = line.replace("키워드:", "").strip()
        elif line.startswith("요약:"):
            summary = line.replace("요약:", "").strip()
        elif line.startswith("관심사:"):
            interests = line.replace("관심사:", "").strip()

    # DB 저장
    conn = pymysql.connect(**MYSQL_CONFIG)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO memos (persona_id, content, summary, keyword, interests, memo_type, date)
        VALUES (%s, %s, %s, %s, %s, %s, NOW())
    """, (persona_id, content, summary, keyword, interests, mood))
    conn.commit()
    conn.close()

    return {"success": True, "summary": summary, "keyword": keyword, "interests": interests}

"""
실행 방법:
1. backend/.env 파일에 아래와 같이 환경변수 입력
   NOTION_TOKEN=여기에_노션_토큰
   NOTION_DATABASE_ID=여기에_데이터베이스_ID
2. 패키지 설치
   pip install fastapi uvicorn requests python-dotenv
3. 서버 실행
   uvicorn llm_api_server:app --reload
4. 프론트엔드에서 POST http://localhost:8000/api/notion 으로 요청
""" 