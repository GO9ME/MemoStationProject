import os

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# 카테고리 설명 매핑 (category 코드 → 실제 의미 설명)
CATEGORY_EXPLANATIONS = {
    "trend_type": "트렌드 추종형. 최신 정보, 신제품, 실시간 이슈, 빠른 변화에 민감. 정보의 신선도와 속도 중시",
    "cautious_type": "신중 검증형. 검증된 정보, 전문가 의견, 리뷰, 오랜 경험 중시. 신뢰성, 근거, 반복성 강조",
    "balanced_type": "균형형. 최신성과 검증성을 상황에 따라 조화롭게 소비. 새로움과 신뢰성 모두 일정 비율 고려",
    "retrospective_type": "회고/복습형. 과거 기록, 복습, 반복 학습, 아카이브 정보 선호. 누적성, 반복성, 장기 가치 중시",
    "practical_type": "실용/즉시형. 당장 쓸 수 있는 실용 정보, How-to, 요약, 팁 선호. 적용 가능성, 즉시성 강조"
}

# 카테고리별 dimension 가중치 설정
CATEGORY_DIMENSION_WEIGHTS = {
    "trend_type":      {"recency": 0.40, "diversity": 0.20},
    "cautious_type":   {"credibility": 0.40, "analyticity": 0.20},
    "balanced_type":   {"recency": 0.25, "credibility": 0.25, "analyticity": 0.25},
    "retrospective_type": {"archive": 0.50, "credibility": 0.20},
    "practical_type":  {"utility": 0.40, "recency": 0.30}
}

# DIMENSION 설명 딕셔너리
DIMENSION_INFO = {
    "recency": "정보 신선도. 정보의 발행일, 업데이트 날짜, 실시간성",
    "credibility": "검증성. 정보 신뢰성. 전문가 리뷰, 공식 출처, 반복 언급, 평점 등",
    "utility": "실용성. 정보 적용성. How-to, 팁, 체크리스트, 즉시 적용 가능성",
    "archive": "반복/아카이브. 정보누적성. 과거 기록, 복습, 반복 학습, 아카이브 정보",
    "diversity": "주제 폭, 정보 다양성. 다양한 주제, 새로운 시도, 신생 토픽 등장 빈도",
    "analyticity": "정보 비교/분석성. 최신성과 검증성의 비교, 종합, 분석적 접근"
}

# 유사어 통합 매핑(간단 임시)
KEYWORD_SYNONYMS = {
    "자기계발": "자기개발",
    "자기 개발": "자기개발",
    "자기 효능감": "자기효능감",
    "가족 소통": "가족소통",
    "가족 대화": "가족소통",
    "유투브": "유튜브",
    "시간 관리": "시간관리"
}