
from langgraph.graph import StateGraph, END
from app.schemas.verify_state import VerifyState
from app.nodes.extract_pdf_node import extract_pdf_node
from app.nodes.extract_llm_node import extract_llm_node
from app.nodes.compare_node import compare_node


def create_pdf_verifier_graph():
    """
    LangGraph 기반 등기부등본 인증 에이전트 생성 함수
    """
    graph = StateGraph(VerifyState)

    # 노드 등록
    graph.add_node("extract_pdf", extract_pdf_node)
    graph.add_node("extract_llm", extract_llm_node)
    graph.add_node("compare", compare_node)

    
    def pdf_next_condition(state: VerifyState):
        """PDF 추출 후 이동할 노드 결정"""
        if not state.get("pdf_text"):  # 추출 실패
            if state.get("num_try", 0) >= 2:
                print("[COND] PDF 추출 2회 실패 → END 노드로 이동")
                return "end"
            else:
                print("[COND] PDF 추출 실패 → 재시도")
                return "extract_pdf"
        return "extract_llm"  # 정상 추출 → LLM으로 진행
    
    def llm_next_condition(state: VerifyState):
        """LLM 추출 후 이동할 노드 결정"""
        extracted = state.get("extracted", {})
        if not extracted or not extracted.get("owner"):
            print("[COND] LLM 추출 실패 → END")
            return "end"
        return "compare"
    
    # 엣지 연결 
    graph.add_conditional_edges("extract_pdf", pdf_next_condition, {
        "extract_pdf": "extract_pdf",
        "extract_llm": "extract_llm",
        "end": END
    })
    graph.add_conditional_edges("extract_llm", llm_next_condition, {
        "compare": "compare",
        "end": END
    })
    graph.add_edge("compare", END)

    # 진입점 설정
    graph.set_entry_point("extract_pdf")

    return graph.compile()