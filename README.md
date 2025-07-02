# MemoStationProject

메모, 블로그, 노트 등 다양한 텍스트 데이터를 수집·분석하고, LLM 및 임베딩 기반 RAG(검색 증강 생성) 추천 시스템을 제공하는 통합 메모/지식 관리 웹 서비스입니다.

---

## 📁 프로젝트 구조

```
memoStation/
  ├── backend/         # FastAPI 기반 백엔드 및 RAG 추천 시스템
  │   ├── data/        # 각종 데이터셋(JSON, CSV)
  │   ├── llm_api_server.py   # API 서버 (Notion 연동, 메모 관리 등)
  │   └── rag_blog_rec.py     # RAG 기반 블로그/메모 추천 엔진
  └── frontend/        # React 기반 프론트엔드
      ├── src/
      │   ├── components/     # UI 컴포넌트
      │   └── pages/          # 주요 페이지 라우팅
      └── public/             # 정적 파일
```

---

## ⚙️ 주요 기능

### 1. 백엔드 (Python, FastAPI)
- **Notion 연동**: Notion API를 통해 데이터베이스 쿼리 및 노트 저장/불러오기 지원
- **메모 관리**: CSV 기반 메모 데이터 페이징, 정렬, JSON 변환 API 제공
- **RAG 추천**: OpenAI 임베딩, FAISS, TF-IDF, NLTK 등 활용한 블로그/메모 추천 시스템 구현
- **카테고리 분류**: LLM 기반 카테고리 자동 분류 및 사용자 성향 분석

### 2. 프론트엔드 (React)
- **다크모드 지원**: 사용자 테마 설정 및 로컬스토리지 연동
- **주요 페이지**: 홈, 노트 목록/상세, 추천 탐색, 리포트, 설정, 외부 연동 관리 등
- **컴포넌트화**: Navbar, FloatingActionButtons 등 재사용 가능한 UI 컴포넌트 구조

---

## 🏃‍♂️ 빠른 시작

### 1. 백엔드 실행

1. 환경변수 설정  
   `backend/.env` 파일에 아래 항목 추가:
   ```
   NOTION_TOKEN=여기에_노션_토큰
   NOTION_DATABASE_ID=여기에_데이터베이스_ID
   OPENAI_API_KEY=여기에_OpenAI_API_키
   ```

2. 패키지 설치
   ```
   pip install fastapi uvicorn requests python-dotenv pandas faiss-cpu nltk scikit-learn openai tqdm
   ```

3. 서버 실행
   ```
   uvicorn llm_api_server:app --reload
   ```

### 2. 프론트엔드 실행

1. 패키지 설치
   ```
   cd frontend
   npm install
   ```

2. 개발 서버 실행
   ```
   npm start
   ```

---

## 📝 데이터 구조

- `backend/data/` 폴더 내 다양한 카테고리별 JSON/CSV 데이터셋 활용
- 메모, 블로그, 노트 등 텍스트 기반 데이터의 자동 분류 및 추천 지원

---

## 💡 기타 참고

- LLM, 임베딩, RAG, FAISS, OpenAI API 등 최신 AI 기술 활용
- 코드 내 한글 주석 및 명확한 변수명 사용
- 에러 발생 가능성 있는 부분은 예외처리 적용

---
