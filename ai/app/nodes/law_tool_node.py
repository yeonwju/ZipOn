from app.schemas.contract_state import ContractState
from langchain_openai import ChatOpenAI
from app.tool.define_tools import (
    civil_law_search,
    terms_regulation_law_search,
    housing_law_search,
)
import os
from dotenv import load_dotenv

load_dotenv()

GMS_KEY = os.getenv("GMS_KEY")
MODEL_NAME = os.getenv("MODEL_NAME")

# GMS 서버용 LLM
llm = ChatOpenAI(
    model=MODEL_NAME,
    openai_api_base="https://gms.ssafy.io/gmsapi/api.openai.com/v1",
    openai_api_key=GMS_KEY,
    temperature=0,
    streaming=False,
    max_retries=2,
)


def law_tool_node(state: ContractState) -> ContractState:
    """
    각 불공정 의심 조항(suspected_clauses)에 대해
    LLM이 관련 법령을 선택하고 대응하는 검색 도구를 실행,
    관련 조항을 찾거나 직접 판단 결과를 생성합니다.
    """
    try:
        print("[NODE] law_tool_node 실행 중...")

        suspected_clauses = state.get("suspected_clauses")
        if not suspected_clauses:
            raise ValueError("suspected_clauses가 비어 있습니다. extract_unfair_clause_node 이후 실행해야 합니다.")

        law_references = []
        selected_laws = []

        for clause in suspected_clauses:
            clause_text = clause.get("clause", "").strip()
            if not clause_text:
                continue

            # 1️⃣ 법령 선택 (라우팅)
            router_prompt = f"""
            다음 문장은 부동산 임대차 계약서의 한 조항입니다.
            이 조항을 검토할 때, 어떤 법률이 가장 관련이 높을까요?

            - 민법 → 일반 계약 조항, 손해배상, 계약해제 관련
            - 약관의 규제에 관한 법률 → 일방적으로 불리한 계약 조건
            - 주택임대차보호법 → 임대인/임차인 권리 보호, 보증금, 갱신 관련

            출력은 아래 중 하나만 작성하세요:
            "민법" 또는 "약관의 규제에 관한 법률" 또는 "주택임대차보호법"

            조항:
            {clause_text}
            """
            router_response = llm.invoke(router_prompt)
            selected_law = router_response.content.strip().replace('"', "")
            selected_laws.append(selected_law)

            # 해당 도구 선택
            if "약관" in selected_law:
                tool = terms_regulation_law_search
            elif "민법" in selected_law:
                tool = civil_law_search
            elif "주택" in selected_law:
                tool = housing_law_search
            else:
                tool = civil_law_search  # 기본값

            #  도구 실행 
            try:
                tool_result = tool.invoke(clause_text)
            except Exception as e:
                tool_result = f"도구 실행 실패: {e}"

            # 도구 결과 기반 처리
            if tool_result and "관련 정보를 찾을 수 없습니다" not in str(tool_result):
                law_references.append({
                    "clause": clause_text,
                    "selected_law": selected_law,
                    "law_articles": [{
                        "law_name": selected_law,
                        "article_number": "조항 번호 미상",
                        "excerpt": str(tool_result).strip()[:500],
                    }]
                })
            else:
                # Fallback — LLM이 자체적으로 설명
                fallback_prompt = f"""
                다음 부동산 임대차 계약서 조항에서 명확한 법령 위반 근거는 찾지 못했습니다.
                대신 이 조항이 임차인(또는 계약 상대방)에게 왜 불공정하거나 위험할 수 있는지
                법률 전문가의 관점에서 간단히 설명하세요.

                조항:
                {clause_text}
                """
                fallback_response = llm.invoke(fallback_prompt)
                law_references.append({
                    "clause": clause_text,
                    "selected_law": "직접 판단",
                    "law_articles": [{
                        "law_name": "LLM 판단",
                        "article_number": "-",
                        "excerpt": fallback_response.content.strip(),
                    }]
                })

        print(f"[INFO] 총 {len(law_references)}건의 법령 검색 완료 ")

        # 반환
        return {
            **state,
            "selected_laws": selected_laws,
            "law_references": law_references,
            "error": None,
        }

    except Exception as e:
        print(f"[ERROR] 법령 검색 실패: {e}")
        return {**state, "law_references": None, "error": str(e)}
