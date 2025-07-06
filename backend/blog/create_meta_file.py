import os
import json
import datetime
import re


def parse_relative_date(text):
    """상대적 시간(예: 3시간 전)을 datetime으로 변환"""
    now = datetime.datetime.now()
    patterns = {
        r"(\d+)\s*분\s*전": lambda m: now - datetime.timedelta(minutes=int(m.group(1))),
        r"(\d+)\s*시간\s*전": lambda m: now - datetime.timedelta(hours=int(m.group(1))),
        r"(\d+)\s*일\s*전": lambda m: now - datetime.timedelta(days=int(m.group(1))),
    }
    for pattern, func in patterns.items():
        match = re.match(pattern, text)
        if match:
            return func(match)
    return None  # 파싱 실패 시 None 반환


def compute_meta_score(meta):
    return round(
        0.3 * meta.get("credibility", 0)
        + 0.2 * meta.get("recency", 0)
        + 0.2 * meta.get("utility", 0)
        + 0.2 * meta.get("diversity", 0)
        + 0.1 * meta.get("analyticity", 0),
        4,
    )


def extract_meta_features(doc):
    content = doc.get("content", "")
    now = datetime.datetime.now()

    credibility = 1.0 if "전문가" in content or "출처" in content else 0.6

    recency = 0.0
    if "date" in doc:
        date_str = doc["date"]
        dt = None
        try:
            # 시도1: YYYY-MM-DD
            dt = datetime.datetime.strptime(date_str, "%Y-%m-%d")
        except:
            # 시도2: 상대 시간
            dt = parse_relative_date(date_str)
        if dt:
            days_diff = (now - dt).days
            recency = max(0.0, min(1.0, 1 - days_diff / 365))

    utility = (
        1.0 if any(kw in content for kw in ["팁", "정리", "방법", "요약"]) else 0.5
    )
    diversity = 1.0 if len(set(content.split())) > 100 else 0.4
    analyticity = (
        1.0 if any(kw in content for kw in ["분석", "결과", "이유", "패턴"]) else 0.3
    )

    return {
        "credibility": round(credibility, 3),
        "recency": round(recency, 3),
        "utility": round(utility, 3),
        "diversity": round(diversity, 3),
        "analyticity": round(analyticity, 3),
    }


def process_json_file(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        try:
            data = json.load(f)
            for doc in data:
                meta = extract_meta_features(doc)
                doc.update(meta)
                doc["meta_score"] = compute_meta_score(meta)
            return data
        except Exception as e:
            print(f"[ERROR] {file_path} 처리 실패: {e}")
            return None


def save_with_meta_score(original_path, data):
    base, ext = os.path.splitext(original_path)
    new_path = base + "_meta.json"
    with open(new_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"[INFO] 저장 완료: {new_path}")


def run(folder_path: str):
    for filename in os.listdir(folder_path):
        if filename.endswith(".json") and not filename.endswith("_meta.json"):
            file_path = os.path.join(folder_path, filename)
            data_with_score = process_json_file(file_path)
            if data_with_score:
                save_with_meta_score(file_path, data_with_score)


if __name__ == "__main__":
    run("./new_naver_crawl/crawl_new_data2")
