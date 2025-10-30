import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()

GMS_KEY = os.getenv("GMS_KEY")
GMS_API_URL = os.getenv("GMS_API_URL", "https://gms.ssafy.io/gmsapi/api.openai.com/v1/responses")
MODEL_NAME = os.getenv("MODEL_NAME", "gpt-4.1")

def extract_owner_info_llm(pdf_text: str) -> dict:
    print("[INFO] GMS LLM 분석 시작...")

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {GMS_KEY}",
    }

    body = {
        "model": MODEL_NAME,
        "input": f"""
다음은 등기부등본의 OCR 추출 원문입니다.

이 텍스트에서 아래 3가지 항목만 JSON으로 정확히 추출하세요:
1. 소유자 이름
2. 주민등록번호 앞 6자리 (예: 710410)
3. 건물 주소

출력은 반드시 아래 JSON 형식만 사용하세요:
{{
  "owner": "이름",
  "birth": "생년월일6자리",
  "address": "주소"
}}

문서 원문:
{pdf_text[:12000]}
"""
    }

    response = requests.post(GMS_API_URL, headers=headers, json=body)

    print(f"[DEBUG] HTTP Status: {response.status_code}")
    print("[DEBUG] Raw Response Body:")
    print(response.text[:800] + "..." if len(response.text) > 800 else response.text)

    if response.status_code != 200:
        print(f"[ERROR] GMS API 호출 실패: {response.status_code}")
        return {"error": response.text}

    result_data = response.json()

    # ✅ 응답 구조 안전 탐색
    content = None
    if "output" in result_data:
        content = result_data["output"][0]["content"][0].get("text", "")
    elif "choices" in result_data:
        content = result_data["choices"][0]["message"]["content"]
    else:
        print("[WARN] 예상치 못한 응답 구조.")
        print(result_data)
        return {"owner": None, "birth": None, "address": None}

    print("\n[LLM 응답 원문]")
    print(content)

    # ✅ JSON 파싱 시도
    try:
        parsed = json.loads(content)
    except json.JSONDecodeError:
        print("[WARN] 모델이 JSON 형식을 안 지킴. 문자열 내에서 강제 추출 시도 중...")
        parsed = _fallback_parse(content)

    print("\n[INFO] LLM 추출 결과 ✅")
    print(json.dumps(parsed, ensure_ascii=False, indent=2))
    return parsed


def _fallback_parse(text: str) -> dict:
    """단순 문자열에서 owner/birth/address 패턴 추출"""
    import re
    owner = re.search(r"소유자[:\s]*([가-힣]+)", text)
    birth = re.search(r"(\d{6})", text)
    addr = re.search(r"([가-힣\s\d\-]+(시|군|구)\s*[가-힣\d\s\-]+(동|로|길)[^\n]*)", text)
    return {
        "owner": owner.group(1) if owner else None,
        "birth": birth.group(1) if birth else None,
        "address": addr.group(1) if addr else None,
    }
