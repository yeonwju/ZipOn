# app/nodes/reasoning_node.py
from app.schemas.contract_state import ContractState
from langchain_openai import ChatOpenAI
import os
from dotenv import load_dotenv


load_dotenv()

GMS_KEY = os.getenv("GMS_KEY")
MODEL_NAME = os.getenv("MODEL_NAME")

llm = ChatOpenAI(
    model=MODEL_NAME,
    openai_api_base="https://gms.ssafy.io/gmsapi/api.openai.com/v1",
    openai_api_key=GMS_KEY,
    temperature=0.3,  
    streaming=False,
    max_retries=2,
)

def reasoning_node(state: ContractState) -> ContractState:
    """
    suspected_clauses + law_references + selected_laws를 종합해
    전체 계약서 불공정 분석 보고서를 생성합니다.
    (조항별 설명 + 전체 결론이 포함된 자연어 완성 문장)
    """
    try:
        print("[NODE] reasoning_node 실행 중...")

        suspected_clauses = state.get("suspected_clauses", [])
        law_references = state.get("law_references", [])
        selected_laws = state.get("selected_laws", [])

        if not suspected_clauses or not law_references:
            raise ValueError("suspected_clauses 또는 law_references가 비어 있습니다.")

        # --------------------------
        # 조항별 근거 정리
        # --------------------------
        clause_details = []
        for idx, clause_data in enumerate(suspected_clauses, start=1):
            clause_text = clause_data.get("clause", "")
            matched_law = next(
                (ref for ref in law_references if ref["clause"] == clause_text),
                None,
            )

            law_info = ""
            if matched_law:
                articles = matched_law.get("law_articles", [])
                if articles:
                    first = articles[0]
                    law_name = first.get("law_name", "")
                    article_number = first.get("article_number", "")
                    law_info = f"{law_name} {article_number}".strip()
                else:
                    law_info = matched_law.get("selected_law", "관련 법령 정보 없음")
            else:
                law_info = "관련 법령 정보 없음"

            clause_details.append(f"{idx}. '{clause_text}' — ({law_info})")

        joined_details = "\n".join(clause_details)

        prompt = f"""
        당신은 법률 전문가입니다.
        아래는 계약서에서 발견된 의심 조항 목록과 관련 법령 근거입니다.
        이 정보를 바탕으로, 
        - 각 조항이 왜 위험하거나 불공정한지 차근차근 설명하고,
        - 마지막에는 종합적인 결론(계약 체결 전 검토 필요 여부)을 덧붙이세요.

        출력은 하나의 완성된 보고서 문장으로 작성하세요.
        단락마다 번호를 유지하고, 최종 결론은 문단 마지막에 작성하세요.

        ---
        의심 조항 및 근거 목록:
        {joined_details}

        예시 출력:
        당신의 계약서에서 위험한 부분은 다음과 같습니다.
        1. '임대인은 언제든 계약을 해지할 수 있다' — 약관의 규제에 관한 법률 제6조를 근거로, 임차인에게 일방적으로 불리한 조항입니다.
        2. '보증금 반환일은 임대인이 정한다' — 주택임대차보호법 제4조를 참고할 때, 임차인의 권리를 침해할 우려가 있습니다.
        따라서 이러한 조항들은 계약 당사자 간 형평성을 해칠 수 있으므로, 계약 체결 전에 법률 전문가의 검토를 권장합니다.
        """

        response = llm.invoke(prompt)
        full_report = response.content.strip().replace("```", "")

        
        return {
            **state,
            "unfair_clauses": full_report,  
            "error": None,
        }

    except Exception as e:
        print(f"[ERROR] reasoning_node 실패: {e}")
        return {**state, "unfair_clauses": None, "error": str(e)}

