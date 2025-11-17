from app.modules.pdf_parser import extract_text_from_bytes
from app.schemas.contract_state import ContractState

def extract_contract_node(state: ContractState) -> ContractState:
    """
    LangGraph 노드용 PDF 텍스트 추출 함수
    state["pdf_bytes"]를 받아 텍스트를 추출하고 state["pdf_text"]에 저장합니다.
    실패 시 num_try를 증가시킵니다.
    """
    state["num_try"] = state.get("num_try", 0) + 1 
    try:
        print("[NODE] 계약서 텍스트 추출 노드 실행 중...")
        pdf_text = extract_text_from_bytes(state["pdf_bytes"])
        return {**state, "pdf_text": pdf_text, "error":None}
    except Exception as e:
        print(f"[ERROR] PDF 추출 실패: {e}")
        return {**state, "pdf_text": None, "error": str(e)}