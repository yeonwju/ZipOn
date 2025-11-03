from fastapi import FastAPI
from app.modules.pdf_parser import extract_text_from_file
import os


# main.py
from fastapi import FastAPI, UploadFile, Form
from app.schemas.verify_state import VerifyState

app = FastAPI(title="Property Verification AI Server")

@app.post("/verify")
async def verify_endpoint(
    pdfCode: str = Form(...),
    regiNm: str = Form(...),
    regiBirth: str = Form(...),
    address: str = Form(...),
    file: UploadFile = Form(...)
):
    """
    Java → Python: PDF 파일 + 사용자 정보 받아서 LangGraph 인증 수행
    """
    print(f"[INFO] Received verification request (pdfCode={pdfCode})")

    pdf_bytes = await file.read()

    # --- 초기 상태 구성 ---
    user_input = {
        "owner": regiNm,
        "birth": regiBirth,
        "address": address,
    }

    state: VerifyState = {
        "pdf_bytes": pdf_bytes,
        "user_input": user_input,
        "num_try": 0,
    }

    # --- LangGraph 실행 ---
    graph = create_pdf_verifier_graph()
    final_state = graph.invoke(state)
    risk_score = final_state.get("risk_score", None)
    risk_reason = final_state.get("risk_reason", None)

    verified = final_state.get("verified", False)

    # ✅ Java의 DTO 구조에 맞춰 응답 반환
    result = {
        "pdfCode": pdfCode,
        "isCertificated": verified,
        "riskScore": risk_score,
        "riskReason": risk_reason,
    }

    print(f"[RESULT] Verification complete → {result}")
    return result





from app.schemas.verify_state import VerifyState
from app.agent.verify_agent import create_pdf_verifier_graph
from pathlib import Path

if __name__ == "__main__":
    # === 테스트용 PDF 및 사용자 입력 ===
    pdf_path = Path(r"C:\Users\SSAFY\Desktop\등기부등본.pdf")
    user_input = {
        "owner": "이미정",
        "birth": "710410",
        "address": "경기도 광명시 철산동 119-2 가산디오스텔 오피스텔 제5층 제506호",
    }

    # === PDF 파일 읽기 ===
    with open(pdf_path, "rb") as f:
        pdf_bytes = f.read()

    # === LangGraph 초기 상태 정의 ===
    init_state: VerifyState = {
        "pdf_bytes": pdf_bytes,
        "user_input": user_input,
        "num_try": 0,
        "pdf_text": None,
        "extracted": None,
        "verified": None,
        "error": None,
        "risk_score": None,
        "risk_reason": None,
    }

    print("\n🚀 LangGraph Agent 실행 시작...\n")

    # === 그래프 실행 ===
    graph = create_pdf_verifier_graph()
    final_state = graph.invoke(init_state)

    # === 결과 출력 ===
    print("\n==============================")
    print("🏁 최종 결과 (Final State)")
    print("==============================")
    print(f"✅ 인증 결과: {final_state.get('verified')}")
    print(f"👤 소유자: {final_state.get('extracted', {}).get('owner')}")
    print(f"🎂 생년월일: {final_state.get('extracted', {}).get('birth')}")
    print(f"🏠 주소: {final_state.get('extracted', {}).get('address')}")
    print(f"⚖️  위험도 점수: {final_state.get('risk_score')}")
    print(f"🧠 AI 평가 사유: {final_state.get('risk_reason')}")
    print(f"⚠️ 오류 메시지: {final_state.get('error')}")