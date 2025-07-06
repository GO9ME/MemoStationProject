import csv
import mysql.connector
import os
from dotenv import load_dotenv

print("insert_memos.py 스크립트 시작.") # 디버그용

# .env 파일 로드 (환경 변수에서 DB 설정을 가져올 경우 필요)
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'))

# MySQL 데이터베이스 연결 설정
# TODO: 'your_mysql_user', 'your_mysql_password', 'memostation'을 실제 MySQL 설정으로 변경해주세요.
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '1234',
    'database': 'memostation'
}

CSV_FILE_PATH = 'data/memo/generated_memos(new).csv'
TABLE_NAME = 'memos'

def drop_table_if_exists(cursor):
    """
    메모 테이블이 존재하면 삭제합니다.
    """
    print(f"테이블 '{TABLE_NAME}' 삭제 시도 중...")
    drop_table_query = f"DROP TABLE IF EXISTS {TABLE_NAME};"
    try:
        cursor.execute(drop_table_query)
        print(f"테이블 '{TABLE_NAME}' 삭제 완료.")
    except Exception as e:
        print(f"테이블 삭제 중 오류 발생: {e}")

def create_table_if_not_exists(cursor):
    """
    메모 테이블이 없으면 생성합니다.
    CSV 파일의 컬럼을 기반으로 스키마를 정의합니다.
    """
    print(f"테이블 '{TABLE_NAME}' 생성 또는 존재 확인 중...")
    create_table_query = f"""
    CREATE TABLE IF NOT EXISTS {TABLE_NAME} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        memo_type VARCHAR(255),
        persona_id VARCHAR(255),
        persona_age INT,
        persona_profession VARCHAR(255),
        date DATE,
        content TEXT,
        interests TEXT,
        pain_points TEXT,
        style VARCHAR(255),
        keyword TEXT,
        summary TEXT
    );
    """
    try:
        cursor.execute(create_table_query)
        print(f"테이블 '{TABLE_NAME}' 생성 또는 이미 존재 확인 완료.")
    except Exception as e:
        print(f"테이블 생성 중 오류 발생: {e}")

def insert_data_from_csv(cursor, csv_file_path):
    """
    CSV 파일에서 데이터를 읽어 MySQL 테이블에 삽입합니다.
    """
    print(f"CSV 파일 '{csv_file_path}' 읽기 시작.")
    memories = []
    current_memo = {}
    line_count = 0
    is_parsing_content = False
    current_field = None # 현재 파싱 중인 필드

    # 모든 예상 필드를 기본값으로 정의하여 일관성을 유지합니다.
    ALL_FIELDS = {
        'memo_type': '',
        'persona_id': '',
        'persona_age': None,
        'persona_profession': '',
        'date': '', # SQL 삽입 전 변환 예정
        'content': '',
        'interests': '',
        'pain_points': '',
        'style': '',
        'keyword': '',
        'summary': ''
    }
    KNOWN_KEYS = set(ALL_FIELDS.keys())

    def reset_current_memo():
        return {key: value for key, value in ALL_FIELDS.items()}

    current_memo = reset_current_memo() # 첫 번째 메모 초기화

    try:
        with open(csv_file_path, 'r', encoding='utf-8') as file:
            for line in file:
                line_count += 1
                stripped_line = line.strip()

                # 새로운 메모 블록 시작 (예: '1. 일기형')
                is_new_memo_start = any(stripped_line.startswith(f'{i}.') for i in range(1, 7))

                if is_new_memo_start:
                    # 이전 메모가 유효하다면 저장 (persona_id 필터링 적용)
                    if (current_memo.get('memo_type') or current_memo.get('content')) and current_memo.get('persona_id') == '사용자_001':
                        memories.append(current_memo)
                    
                    # 새로운 메모 초기화
                    current_memo = reset_current_memo()
                    current_memo['memo_type'] = stripped_line.split('.', 1)[1].strip().split('(', 1)[0].strip()
                    is_parsing_content = False # 새로운 메모 시작 시 콘텐츠 파싱 플래그 초기화
                    current_field = 'memo_type' # 현재 필드를 memo_type으로 설정
                    continue
                
                # 빈 줄은 파싱 로직에 영향 주지 않고 건너뜁니다.
                if not stripped_line:
                    continue

                # 키-값 쌍으로 파싱 시도
                colon_index = stripped_line.find(':')
                if colon_index != -1:
                    potential_key = stripped_line[:colon_index].strip().replace(' ', '_').lower()
                    if potential_key in KNOWN_KEYS:
                        value = stripped_line[colon_index + 1:].strip()
                        current_memo[potential_key] = value
                        current_field = potential_key # 현재 파싱 중인 필드를 업데이트

                        if potential_key == 'content':
                            is_parsing_content = True
                        else:
                            is_parsing_content = False # 'content' 필드가 아니면 콘텐츠 파싱 중단
                        continue
                
                # 위 조건에 해당하지 않고, content 파싱 중이면 content에 추가
                if is_parsing_content:
                    current_memo['content'] += '\n' + stripped_line
                elif current_field and current_field != 'memo_type': # 다른 필드의 연장인 경우 (예: multi-line fields, 현재는 content만 해당)
                    # NOTE: 현재 CSV 형식상 interests, pain_points 등은 단일 라인이지만,
                    # 향후 확장성을 위해 필드 연속성 처리 로직 유지.
                    # 그러나 지금 문제의 필드들은 단일 라인이므로 이 부분은 트리거되지 않음.
                    current_memo[current_field] += '\n' + stripped_line
                else:
                    # 빈 줄도 아니고, 새 메모 시작도 아니고, 키-값 쌍도 아니고, content 연장도 아닌 경우
                    print(f"경고: 파싱되지 않은 줄 (무시됨): '{stripped_line}' (라인 {line_count}) - 이전 필드 없음 또는 알 수 없는 형식")

            # 파일 끝에 남아있는 마지막 메모 블록 추가 (persona_id 필터링 적용)
            if (current_memo.get('memo_type') or current_memo.get('content')) and current_memo.get('persona_id') == '사용자_001':
                memories.append(current_memo)

        print(f"총 {len(memories)}개의 메모를 파싱했습니다. 데이터 삽입 시작...")

        for i, memo in enumerate(memories):
            try:
                # 각 필드에 대해 기본값 (빈 문자열 또는 None)을 사용하도록 get() 메서드 활용
                memo_type = memo.get('memo_type', '')
                persona_id = memo.get('persona_id', '')
                persona_age_str = memo.get('persona_age', '')
                persona_age = int(persona_age_str) if persona_age_str and persona_age_str.isdigit() else None
                persona_profession = memo.get('persona_profession', '')
                
                # date 필드: 비어있으면 None으로 처리하여 MySQL NULL로 삽입
                date_value = memo.get('date', '')
                if date_value == '':
                    date_value = None

                content_value = memo.get('content', '').strip()
                interests = memo.get('interests', '')
                pain_points = memo.get('pain_points', '')
                style = memo.get('style', '')
                keyword = memo.get('keyword', '')
                summary = memo.get('summary', '')

                sql = f"""
                INSERT INTO {TABLE_NAME} (
                    memo_type, persona_id, persona_age, persona_profession, date, 
                    content, interests, pain_points, style, keyword, summary
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """
                cursor.execute(sql, (
                    memo_type, persona_id, persona_age, persona_profession, date_value,
                    content_value, interests, pain_points, style, keyword, summary
                ))
                if (i + 1) % 100 == 0:
                    print(f"{i + 1}번째 메모 삽입 완료.")
            except Exception as e:
                print(f"데이터 삽입 오류 발생 (메모 {i+1}): {e}")
                print(f"문제의 데이터: {memo}")
                # 오류 발생 시 해당 메모 스킵하고 다음 메모로 진행
        print("모든 메모 삽입 시도 완료.")

    except FileNotFoundError:
        print(f"오류: 파일을 찾을 수 없습니다. 경로를 확인해주세요: {csv_file_path}")
    except Exception as e:
        print(f"CSV 파일 읽기 또는 파싱 중 오류 발생: {e}")
        print(f"오류 발생 라인: {line_count}")

def main():
    conn = None
    cursor = None
    try:
        print("MySQL 연결 시도 중...")
        conn = mysql.connector.connect(**DB_CONFIG)
        if conn.is_connected():
            print("MySQL 연결 성공.")
            cursor = conn.cursor()
            
            # 기존 테이블 삭제 후 재생성 (데이터 누락 방지 및 스키마 일관성 유지)
            drop_table_if_exists(cursor)
            create_table_if_not_exists(cursor)
            
            insert_data_from_csv(cursor, CSV_FILE_PATH)
            
            conn.commit() # 변경사항 커밋
            print("데이터베이스 커밋 완료.")
        else:
            print("MySQL 연결 실패: DB_CONFIG를 확인해주세요.")
    except mysql.connector.Error as err:
        print(f"MySQL 연결 정보를 확인해주세요: {err}")
    except Exception as e:
        print(f"스크립트 실행 중 예기치 않은 오류 발생: {e}")
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()
            print("MySQL 연결 종료.")

if __name__ == "__main__":
    main() 