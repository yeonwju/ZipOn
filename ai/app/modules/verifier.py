import re
import difflib
from app.modules.llm_extractor import extract_owner_info_llm
from app.modules.pdf_parser import extract_text_from_bytes

def normalize_text(text: str) -> str:
    """특수문자, 공백 제거 (비교용)"""
    return re.sub(r"[^가-힣0-9]", "", text.strip()) if text else ""

def similarity(a: str, b: str) -> float:
    """문자열 유사도 계산"""
    return difflib.SequenceMatcher(None, normalize_text(a), normalize_text(b)).ratio()

def verify_registration_info(pdf_path: str, user_input: dict) -> dict:
    """
    등기부등본 PDF에서 추출한 정보와 Java 서버에서 전달받은 사용자 입력 정보를 비교.
    :param pdf_bytes: PDF 파일의 원본 바이트
    :param user_input: {"owner": str, "birth": str, "address": str}
    :return: {"verified": bool, "similarity": float, ...}
    """

    # PDF 텍스트 추출
    print("[INFO] PDF 텍스트 추출 시작...")
    from app.modules.pdf_parser import extract_text_from_file
    pdf_text = extract_text_from_file(pdf_path)

    # LLM으로 정보 추출
    extracted = extract_owner_info_llm(pdf_text)

    # 각각 비교
    owner_match = normalize_text(extracted.get("owner")) == normalize_text(user_input.get("owner"))
    birth_match = normalize_text(extracted.get("birth")) == normalize_text(user_input.get("birth"))

    addr_sim = similarity(extracted.get("address", ""), user_input.get("address", ""))
    address_match = addr_sim >= 0.75  # 75% 이상이면 일치로 판단

    verified = owner_match and birth_match and address_match

    # 결과 종합
    result = {
        "verified": verified,
        "owner_match": owner_match,
        "birth_match": birth_match,
        "address_match": address_match,
        "address_similarity": round(addr_sim, 3),
        "user_input": user_input,
        "extracted": extracted
    }

    print("\n==============================")
    print("본인 인증 결과")
    print("==============================")
    print(result)

    return result
