import os
import json
import re
import requests
from dotenv import load_dotenv

load_dotenv()

GMS_KEY = os.getenv("GMS_KEY")
GMS_API_URL = os.getenv("GMS_API_URL")
MODEL_NAME = os.getenv("MODEL_NAME")

def extract_owner_info_llm(pdf_text: str) -> dict:
    print("[INFO] 🧠 GMS LLM 리스크 평가 통합 호출 중...")

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {GMS_KEY}",
    }

    prompt = f"""
다음은 등기부등본의 OCR 원문입니다.
이 텍스트를 기반으로 아래 항목을 JSON 형식으로 정확히 추출하세요.

---
1️⃣ 소유자 이름
2️⃣ 주민등록번호 앞 6자리 (예: 710410)
3️⃣ 건물 주소 ([집합건물] 옆의 주소)
4️⃣ **집을 담보로 한 근저당권 설정 내역**  
   - 각 근저당권마다 다음 정보를 포함하세요:  
     {{
       "no": "번호(예: 1, 2, 3...)",
       "amount": "채권최고액(금액)",
       "creditor": "채권자명"
     }}
   - `"을 구"` 섹션 안에서 **줄 단위로 분석**하세요.
   - 줄에 번호(예: "1", "2")가 있고, 그 **바로 다음 줄에 "근저당권설정"**이라는 단어가 있으면  
     그 번호를 가진 새로운 근저당권 항목으로 간주합니다.
   - 이후 `"1번근저당권설정등기말소"`, `"1번근저당권설정등"`, `"1번근저당권해지"` 등의 표현이 나타나면  
     해당 번호(예: 1번)의 근저당권은 이미 **말소 또는 해지된 것**으로 간주하고 목록에서 제외하세요.
   - 즉, 같은 번호의 `"근저당권설정"`과 `"근저당권설정등기말소"`가 함께 존재하면  
     **그 근저당권은 유효하지 않습니다.**
   - `"말소"` 또는 `"해지"`만 등장하고 `"근저당권설정"`이 없는 경우는 무시하세요.
   - 최종 JSON에는 해지되지 않은(**active**) 근저당권만 포함하세요.  
5️⃣ **압류, 가압류, 임차권 등 권리 제한 사항**

그리고 다음 규칙으로 위험도 점수(risk_score)를 계산하세요:

- 근저당권, 압류, 가압류, 임차권 등이 전혀 없으면 **5점 (매우 안전)**
- 근저당권이 1건만 있고 권리 제한이 없으면 **4점 (안전)**
- 근저당권 2건 이상이거나 임차권·가압류가 존재하면 **3점 (보통)**
- 압류가 있거나 다수의 권리 제한이 있으면 **2점 (주의)**
- 복잡한 권리 관계나 다수 근저당권이 존재하면 **1점 (위험)**

출력은 반드시 아래 JSON 형식으로 하세요:
```json
{{
  "owner": "이름",
  "birth": "생년월일6자리",
  "address": "주소",
  "mortgages": [
    {{
      "no": 1,
      "amount": "금94,800,000원",
      "creditor": "주식회사신한은행"
    }}
  ],
  "restriction": "압류, 가압류 없음",
  "risk_score": 4,
  "risk_reason": "근저당권 1건, 권리제한 없음 "
}}


문서 원문:
{pdf_text[:12000]}
"""

    body = {"model": MODEL_NAME, "input": prompt}
    res = requests.post(GMS_API_URL, headers=headers, json=body)

    print(f"[DEBUG] HTTP Status: {res.status_code}")
    if res.status_code != 200:
        return {"error": res.text}

    result_data = res.json()
    if "output" in result_data:
        content = result_data["output"][0]["content"][0].get("text", "")
    elif "choices" in result_data:
        content = result_data["choices"][0]["message"]["content"]
    else:
        content = ""

    
    clean_text = re.sub(r"^```[a-zA-Z]*|```$", "", content.strip(), flags=re.MULTILINE)

    
    json_match = re.search(r"\{[\s\S]*\}", clean_text)
    if json_match:
        clean_text = json_match.group(0)

   
    try:
        parsed = json.loads(clean_text)
    except json.JSONDecodeError:
        print("[ERROR] ⚠️ JSONDecodeError 발생 — 원문에 코드블록 포함된 가능성 있음.")
        parsed = {"error": "JSONDecodeError", "raw": content}

    print("\n[INFO] ✅ LLM 리스크 평가 완료")
    print(json.dumps(parsed, ensure_ascii=False, indent=2))
    return parsed