import openai
import sqlite3
import pandas as pd
import time
import os
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'))

# 환경변수에서 OpenAI API 키 불러오기
openai.api_key = os.getenv("OPENAI_API_KEY")
if not openai.api_key:
    raise ValueError("OPENAI_API_KEY가 .env 파일에 설정되어 있지 않습니다.")

# CSV 파일 경로
csv_path = "backend/data/memo/generated_memos (2).csv"

# DB 파일 경로
db_path = "memos.db"

# SQLite DB 연결
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# CSV 파일 읽기
try:
    df = pd.read_csv(csv_path)
except Exception as e:
    print("CSV 파일 읽기 오류:", e)
    exit(1)

def get_summary_and_keywords(content):
    """
    메모 내용을 LLM에 보내 요약과 키워드를 추출하는 함수
    """
    prompt = f"""
아래의 메모 내용을 간결하게 요약해주고, 주요 키워드를 5개 이내로 추출해줘. 
- 요약: 2~3문장
- 키워드: 쉼표로 구분

메모 내용:
{content}
"""
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4.1-mini",  # gpt-4.0 mini/4.1 mini (최신, 비용 효율)
            messages=[{"role": "user", "content": prompt}],
            max_tokens=300,
            temperature=0.5,
        )
        answer = response['choices'][0]['message']['content']
        summary, keywords = "", ""
        for line in answer.split('\n'):
            if line.startswith("요약:"):
                summary = line.replace("요약:", "").strip()
            elif line.startswith("키워드:"):
                keywords = line.replace("키워드:", "").strip()
        return summary, keywords
    except Exception as e:
        print("OpenAI API 호출 오류:", e)
        return "", ""

# 각 row를 순회하며 DB에 insert
for idx, row in df.iterrows():
    # content가 비어있으면 건너뜀
    if pd.isna(row['content']):
        continue
    summary, keywords = get_summary_and_keywords(row['content'])
    try:
        cursor.execute("""
            INSERT INTO memos (
                persona_id, persona_age, persona_profession, date, content, interests, pain_points, style, summary, keywords
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            row['persona_id'], row['persona_age'], row['persona_profession'], row['date'],
            row['content'], row['interests'], row['pain_points'], row['style'],
            summary, keywords
        ))
        conn.commit()
        print(f"{idx+1}번째 메모 저장 완료")
    except Exception as e:
        print(f"DB 저장 오류 (row {idx+1}):", e)
    time.sleep(1)  # OpenAI API rate limit 방지

conn.close()
print("모든 메모 저장 완료!") 