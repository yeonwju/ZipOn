
from app.schemas.verify_state import VerifyState
import re
import difflib


def normalize_address(addr: str) -> str:
    """
    주소 비교 전 기본 전처리:
    - 공백, 쉼표, 특수문자 제거
    - 도/시/군/구/동/로/길 패턴만 남김
    """
    if not addr:
        return ""
    addr = re.sub(r"[^가-힣0-9\s]", "", addr)
    addr = re.sub(r"\s+", "", addr)
    return addr.strip()


def similarity(a: str, b: str) -> float:
    """문자열 유사도 계산 (0~1 사이 값)"""
    return difflib.SequenceMatcher(None, a, b).ratio() if a and b else 0.0


def compare_node(state: VerifyState) -> VerifyState:
    """
    LangGraph 노드용 — 추출된 정보와 사용자가 입력한 정보를 비교하여 본인 인증 수행
    """
    print("[NODE] 🧩 compare_node 실행 중...")

    extracted = state.get("extracted")
    user_input = state.get("user_input")

    if not extracted or not user_input:
        print("[WARN] 비교 데이터가 부족합니다.")
        return {**state, "verified": False, "error": "missing extracted or user_input"}

    # --- 1️⃣ 이름(소유자) 비교 ---
    owner_match = (
        extracted.get("owner") and user_input.get("owner")
        and extracted["owner"].strip() in user_input["owner"].strip()
    )

    # --- 2️⃣ 생년월일(앞 6자리) 비교 ---
    birth_match = (
        extracted.get("birth") and user_input.get("birth")
        and extracted["birth"].strip() == user_input["birth"].strip()
    )

    # --- 3️⃣ 주소 비교 (유사도 75% 이상이면 일치로 판단) ---
    ext_addr = normalize_address(extracted.get("address"))
    usr_addr = normalize_address(user_input.get("address"))
    addr_similarity = similarity(ext_addr, usr_addr)
    addr_match = addr_similarity >= 0.75  # ✅ 유사도 75% 이상이면 True

    # --- 4️⃣ 최종 판별 ---
    verified = all([owner_match, birth_match, addr_match])

    print("\n[INFO] ✅ 비교 결과")
    print(f" - 소유자 일치: {owner_match}")
    print(f" - 생년월일 일치: {birth_match}")
    print(f" - 주소 유사도: {addr_similarity:.3f}")
    print(f" - 주소 일치(75%↑): {addr_match}")
    print(f" - 최종 인증 결과: {verified}")

    return {
        **state,
        "verified": verified,
        "error": None,
        "address_similarity": round(addr_similarity, 3)
    }