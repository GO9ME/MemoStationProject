from engine import recommend_for_users
import pandas as pd
import json

# 1. 데이터 로드
csv_path = "generated_memos_prep_v2.csv"
df = pd.read_csv(csv_path)

# 2. 상위 3개 유저만 추출
user_sample = df['user_id'].unique()[:3]
df_subset = df[df['user_id'].isin(user_sample)]

# 3. 추천 실행
results = recommend_for_users(df_subset)
# results = recommend_for_users(df)   # 데이터 전체 기준을 실행 시

# 4. 결과 저장
with open("recommendations.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print(f"✅ 추천 완료! 총 {len(results)}건 저장됨")

