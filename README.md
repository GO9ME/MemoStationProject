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
  │   └── youtube/      # YouTube 데이터 수집 및 분석
  └── frontend/        # Next.js (App Router) 기반 프론트엔드
      ├── src/
      │   ├── app/            # Next.js App Router 페이지 및 레이아웃
      │   ├── widgets/        # 위젯 (features, entities 조합)
      │   ├── features/       # 기능 (도메인 로직, CRUD)
      │   ├── entities/       # 엔티티 (핵심 비즈니스 객체)
      │   └── shared/         # 공통 유틸리티, UI 컴포넌트
      └── public/             # 정적 파일
```

---

## ⚙️ 주요 기능

### 1. 백엔드 (Python, FastAPI)
- **Notion 연동**: Notion API를 통해 데이터베이스 쿼리 및 노트 저장/불러오기 지원
- **메모 관리**: CSV/MySQL 기반 메모 데이터 페이징, 정렬, JSON 변환 API 제공
- **RAG 추천**: OpenAI 임베딩, FAISS, TF-IDF, NLTK 등 활용한 블로그/메모 추천 시스템 구현
- **카테고리 분류**: LLM 기반 카테고리 자동 분류 및 사용자 성향 분석
- **YouTube 데이터 분석**: YouTube API를 활용한 동영상 데이터 수집 및 분석

### 2. 프론트엔드 (React, Next.js)
- **다크모드 지원**: 사용자 테마 설정 및 로컬스토리지 연동
- **주요 페이지**: 홈, 노트 목록/상세, 추천 탐색, 리포트, 설정, 외부 연동 관리 등
- **컴포넌트화**: Shadcn/ui 및 커스텀 컴포넌트를 활용한 재사용 가능한 UI 컴포넌트 구조

---

## 💻 기술 스택

- **Frontend**: Next.js (App Router), React, Tailwind CSS, Shadcn/ui
- **Backend**: Python, FastAPI, Uvicorn
- **Database**: MySQL (PyMySQL)
- **Authentication**: Supabase Auth (계획 중 또는 부분 적용)
- **AI/ML**: OpenAI API (GPT 모델, Embedding), FAISS, NLTK, Scikit-learn, TQDM
- **Package Manager**: pnpm
- **Architecture**: Feature Sliced Design (FSD)

---

## 🏃‍♂️ 빠른 시작

### 0. pnpm 설치 (설치되어 있지 않은 경우)
```bash
npm install -g pnpm
```

### 1. 백엔드 실행

1.  **환경 변수 설정**  
    `backend/.env` 파일에 아래 항목 추가:
    ```
    NOTION_TOKEN=여기에_노션_토큰
    NOTION_DATABASE_ID=여기에_데이터베이스_ID
    OPENAI_API_KEY=여기에_OpenAI_API_키
    MYSQL_HOST=localhost
    MYSQL_USER=root
    MYSQL_PASSWORD=1234
    MYSQL_DATABASE=memostation
    ```
    (위 MySQL 정보는 예시입니다. 실제 환경에 맞게 변경해주세요.)

2.  **MySQL 데이터베이스 설정**
    *   MySQL 서버를 실행하고 `memostation` 데이터베이스를 생성합니다.
    *   `backend/insert_memos.py` 스크립트를 실행하여 `memos` 테이블을 생성하고 초기 메모 데이터를 삽입합니다.
        ```bash
        cd backend
        python insert_memos.py
        cd ..
        ```

3.  **패키지 설치**
    ```bash
    cd backend/youtube
    pnpm install
    cd ../..
    ```
    (참고: `backend/youtube/requirements.txt`에 모든 백엔드 종속성이 정의되어 있습니다.)

4.  **서버 실행**
    ```bash
    cd backend
    uvicorn llm_api_server:app --reload
    cd ..
    ```

### 2. 프론트엔드 실행

1.  **패키지 설치**
    ```bash
    cd frontend
    pnpm install
    ```

2.  **개발 서버 실행**
    ```bash
    pnpm dev
    ```
    또는
    ```bash
    npm start
    ```

---

## 📝 데이터 구조

- `backend/data/` 폴더 내 다양한 카테고리별 JSON/CSV 데이터셋 활용
- 메모, 블로그, 노트 등 텍스트 기반 데이터의 자동 분류 및 추천 지원
- MySQL `memos` 테이블에 메모 데이터 저장

---

## 💡 기타 참고

- LLM, 임베딩, RAG, FAISS, OpenAI API 등 최신 AI 기술 활용
- 코드 내 한글 주석 및 명확한 변수명 사용
- 에러 발생 가능성 있는 부분은 예외처리 적용
- Feature Sliced Design (FSD) 아키텍처 적용으로 확장성 및 유지보수성 향상

---
