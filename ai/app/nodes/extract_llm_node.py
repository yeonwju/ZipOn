from app.modules.llm_extractor import extract_owner_info_llm
from app.schemas.verify_state import VerifyState


def extract_llm_node(state: VerifyState) -> VerifyState:
    """
    LangGraph 노드용 LLM 추출 함수
    state["pdf_text"]를 기반으로 GMS LLM에게 소유자·생년월일·주소를 요청합니다.
    결과를 state["extracted"]에 저장합니다.
    """
    try:
        print("[NODE] 🤖 extract_llm_node 실행 중...")

        if not state.get("pdf_text") or len(state["pdf_text"].strip()) < 50:
            print("[WARN] PDF 텍스트가 비어있거나 너무 짧습니다. LLM 호출 생략.")
            return {**state, "extracted": None, "error": "invalid pdf_text"}

        # 기존 함수 재사용
        extracted = extract_owner_info_llm(state["pdf_text"])

        if not any(extracted.values()):
            print("[WARN] LLM이 유효한 정보를 추출하지 못했습니다.")
            return {**state, "extracted": None, "error": "no valid extraction"}

        print("[INFO] LLM 추출 완료 ✅")
        return {
            **state,
            "extracted": {
                "owner": extracted.get("owner"),
                "birth": extracted.get("birth"),
                "address": extracted.get("address"),
            },
            "risk_score": extracted.get("risk_score"),
            "risk_reason": extracted.get("risk_reason"),
            "error": None
        }


    except Exception as e:
        print(f"[ERROR] LLM 추출 실패: {e}")
        return {**state, "extracted": None, "error": str(e)}
