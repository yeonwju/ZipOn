from typing import TypedDict, Optional,List, Dict, Any


class ContractState(TypedDict,total=False):
    pdf_bytes: Optional[bytes]         
    pdf_text: Optional[str]

    suspected_clauses: Optional[List[Dict[str, str]]]

    selected_laws: Optional[List[str]]     # 각 조항별로 선택된 법령 종류 (예: "약관규제법", "민법", ...)
    law_references: Optional[List[Dict[str, Any]]]

    unfair_clauses: Optional[str]
    num_try: int                       
    error: Optional[str]               