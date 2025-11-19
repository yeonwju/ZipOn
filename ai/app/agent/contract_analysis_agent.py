from langgraph.graph import StateGraph
from app.schemas.contract_state import ContractState
from app.nodes.extract_contract_node import extract_contract_node
from app.nodes.extract_unfair_clause_node import extract_unfair_clause_node
from app.nodes.law_tool_node import law_tool_node
from app.nodes.reasoning_node import reasoning_node


def create_contract_analysis_graph():
    """
    계약서 불공정 조항 분석을 위한 LangGraph Agent를 생성합니다.
    """
    graph = StateGraph(ContractState)

    
    # 노드 추가
    graph.add_node("extract_contract", extract_contract_node)
    graph.add_node("extract_unfair_clause", extract_unfair_clause_node)
    graph.add_node("law_tool", law_tool_node)
    graph.add_node("reasoning", reasoning_node)


    #  노드 연결 
    graph.add_edge("extract_contract", "extract_unfair_clause")
    graph.add_edge("extract_unfair_clause", "law_tool")
    graph.add_edge("law_tool", "reasoning")

   
    # 시작과 종료 정의
    graph.set_entry_point("extract_contract")
    graph.set_finish_point("reasoning")


    return graph.compile()
