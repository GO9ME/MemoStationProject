from fastapi import FastAPI, Request, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
import os
from dotenv import load_dotenv
import json
import csv
import pandas as pd
import sqlite3

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

DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'memos.db')

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
def get_memos(page: int = Query(1, ge=1), size: int = Query(4, ge=1, le=100)):
    """
    SQLite DB에서 memos 테이블의 메모를 페이지네이션하여 반환합니다.
    page: 1부터 시작, size: 1~100 (기본 4)
    최신순 정렬, 전체 개수(total)도 함께 반환
    """
    if not os.path.exists(DB_PATH):
        return {"total": 0, "memos": []}
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row  # dict 형태로 반환
        cursor = conn.cursor()
        # 전체 개수 구하기
        cursor.execute("SELECT COUNT(*) FROM memos")
        total = cursor.fetchone()[0]
        # 페이지네이션 쿼리
        offset = (page - 1) * size
        cursor.execute("SELECT * FROM memos ORDER BY date DESC LIMIT ? OFFSET ?", (size, offset))
        rows = cursor.fetchall()
        memos = [dict(row) for row in rows]
        conn.close()
        return {"total": total, "memos": memos}
    except Exception as e:
        return {"total": 0, "memos": [], "error": str(e)}

@app.get("/api/memos/{note_id}")
def get_memo_detail(note_id: int):
    """
    SQLite DB에서 memos 테이블의 특정 메모 상세 정보를 반환합니다.
    """
    if not os.path.exists(DB_PATH):
        raise HTTPException(status_code=404, detail="DB 파일이 존재하지 않습니다.")
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row  # dict 형태로 반환
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM memos WHERE id=?", (note_id,))
        row = cursor.fetchone()
        conn.close()
        if row:
            return dict(row)
        else:
            raise HTTPException(status_code=404, detail="메모를 찾을 수 없습니다.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 추후 LLM 연동 엔드포인트도 이 서버에 추가하면 됩니다.

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