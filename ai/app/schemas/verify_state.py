from typing import TypedDict, Optional, Dict

class VerifyState(TypedDict, total=False):
    pdf_bytes: Optional[bytes]         # Java에서 받은 PDF 파일
    pdf_text: Optional[str]            # PyMuPDF로 추출한 텍스트
    extracted: Optional[Dict[str, str]] # LLM에서 추출된 정보
    user_input: Optional[Dict[str, str]] # Java 서버에서 전달된 실제 값
    verified: Optional[bool]           # 최종 판별 결과 (True/False)
    num_try: int                       # 재시도 횟수
    error: Optional[str]               # 오류 메시지 (디버깅용)
    risk_score: Optional[int]
    risk_reason: Optional[str]