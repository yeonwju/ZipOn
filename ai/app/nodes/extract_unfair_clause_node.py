from app.schemas.contract_state import ContractState
from langchain_openai import ChatOpenAI
import os
import json
from dotenv import load_dotenv

load_dotenv()
GMS_KEY = os.getenv("GMS_KEY")
MODEL_NAME = os.getenv("MODEL_NAME")

# GMS 서버용 LLM 세팅
llm = ChatOpenAI(
    model= MODEL_NAME,
    openai_api_base="https://gms.ssafy.io/gmsapi/api.openai.com/v1",
    openai_api_key= GMS_KEY,
    temperature=0,
    streaming=False,      # 스트리밍 비활성화
    max_retries=2,
)

def extract_unfair_clause_node(state: ContractState) -> ContractState:
    """
    계약서 전문(pdf_text)을 분석하여
    불공정하거나 위험해 보이는 조항(suspected_clauses)을 추출합니다.
    결과는 JSON 리스트 형태로 ContractState에 저장됩니다.
    """
    
    try:
        print("[NODE] extract_unfair_clause_node 실행 중...")

        pdf_text = state.get("pdf_text")
        if not pdf_text:
            raise ValueError("pdf_text가 비어 있습니다. 먼저 extract_contract_node를 실행하세요.")

       
        prompt = f"""
당신은 부동산 임대차 계약서의 내용을 검토하는 법률 전문가입니다.
다음 계약서에서 불공정하거나 위험해 보이는 조항을 찾아 JSON 형식으로 출력하세요.

출력 형식:
[
  {{
    "clause": "조항 내용",
    "reason": "이 조항이 불공정하거나 위험하다고 판단한 이유"
  }}
]

계약서 원문:
{pdf_text[:12000]} 
"""

        response = llm.invoke(prompt)
        text = response.content.strip()

        #  코드블록 / 잡텍스트 정리
        text = text.replace("```json", "").replace("```", "").strip()

        try:
            suspected_clauses = json.loads(text)
        except json.JSONDecodeError:
            # JSON으로 파싱 안될 경우 fallback
            suspected_clauses = [{"clause": text, "reason": "LLM 출력 파싱 실패"}]

        print(f"[INFO] 총 {len(suspected_clauses)}개 조항 추출됨")

        return {
            **state,
            "suspected_clauses": suspected_clauses,
            "error": None,
        }

    except Exception as e:
        print(f"[ERROR] 조항 추출 실패: {e}")
        return {**state, "suspected_clauses": None, "error": str(e)}
