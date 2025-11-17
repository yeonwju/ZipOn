import re
import difflib
from app.schemas.verify_state import VerifyState

def normalize_text(text: str) -> str:
    """공백, 특수문자 제거"""
    return re.sub(r"[^가-힣0-9]", "", text.strip()) if text else ""

def similarity(a: str, b: str) -> float:
    """문자열 유사도 계산"""
    return difflib.SequenceMatcher(None, normalize_text(a), normalize_text(b)).ratio()

def normalize_address(addr: str) -> str:
    """주소 비교를 위한 전처리"""
    if not addr:
        return ""

    addr = addr.strip()
    addr = re.sub(r"\s+", "", addr)  # 모든 공백 제거
    addr = re.sub(r"번지|지번|도로명|길|로|가|동|읍|면|리", "", addr)  # 불필요 단어 제거
    addr = re.sub(r"층|호|호실|호수", "호", addr)  # 호실 표현 통일
    addr = re.sub(r"오피스텔|아파트|빌라|건물|타워|하이츠", "", addr)  # 건물명 제거
    addr = re.sub(r"[^가-힣0-9\-호]", "", addr)  # 한글, 숫자, '-', '호'만 남김
    return addr

def compare_node(state: VerifyState) -> VerifyState:
    print("[NODE] 🧩 compare_node 실행 중...")

    extracted = state.get("extracted")
    user_input = state.get("user_input")

    if not extracted or not user_input:
        return {**state, "verified": False, "error": "missing extracted or user_input"}

    # --- 1️⃣ 이름 비교 ---
    owner_sim = similarity(extracted.get("owner"), user_input.get("owner"))
    owner_match = owner_sim >= 0.8  # 80% 이상이면 일치로 인정

    # --- 2️⃣ 생년월일 비교 (앞 6자리만) ---
    birth_ex = normalize_text(extracted.get("birth"))[:6]
    birth_usr = normalize_text(user_input.get("birth"))[:6]
    birth_match = birth_ex == birth_usr

    # --- 3️⃣ 주소 비교 ---
    addr_ex = normalize_address(extracted.get("address"))
    addr_usr = normalize_address(user_input.get("address"))
    addr_sim = similarity(addr_ex, addr_usr)
    address_match = addr_sim >= 0.70  # 70% 이상이면 OK

    verified = all([owner_match, birth_match, address_match])

    print("\n[INFO] ✅ 비교 결과")
    print(f" - 소유자 유사도: {owner_sim:.3f} → 일치: {owner_match}")
    print(f" - 생년월일 비교: {birth_ex} vs {birth_usr} → 일치: {birth_match}")
    print(f" - 주소 유사도: {addr_sim:.3f} → 일치: {address_match}")
    print(f" - 최종 인증 결과: {verified}")

    return {
        **state,
        "verified": verified,
        "owner_similarity": round(owner_sim, 3),
        "address_similarity": round(addr_sim, 3),
        "error": None
    }