from fastapi import FastAPI, UploadFile, Form
from app.schemas.verify_state import VerifyState
from app.agent.verify_agent import create_pdf_verifier_graph
from app.schemas.contract_state import ContractState
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

    
    graph = create_pdf_verifier_graph()
    final_state = graph.invoke(state)

    risk_score = final_state.get("risk_score", None)
    risk_reason = final_state.get("risk_reason", None)
    verified = final_state.get("verified", False)

    result = {
        "pdfCode": pdfCode,
        "isCertificated": verified,
        "riskScore": risk_score,
        "riskReason": risk_reason,
    }

    print(f"[RESULT] Verification complete → {result}")
    return result

@app.post("/review")
async def review_endpoint(
   file: UploadFile = Form(...) 
):
   pdf_bytes = await file.read()

   state: ContractState = {
        "pdf_bytes": pdf_bytes,
        "num_try": 0,  
   }
   graph = create_contract_analysis_graph()
   final_state =graph.invoke(state)
   reviews = final_state.get("unfair_clauses", None)
   
   result = {
       "reviews": reviews,
   }
   return result

# ## 로컬 테스트용 
# from app.schemas.verify_state import VerifyState
# from app.agent.verify_agent import create_pdf_verifier_graph
# from pathlib import Path

# if __name__ == "__main__":
#     # === 테스트용 PDF 및 사용자 입력 ===
#     pdf_path = Path(r"C:\Users\SSAFY\Desktop\등기부등본2.pdf")
#     user_input = {
#         "owner": "조병욱",
#         "birth": "570807",
#         "address": "경기도 수원시 장안구 조원동 776-8",
#     }

#     # === PDF 파일 읽기 ===
#     with open(pdf_path, "rb") as f:
#         pdf_bytes = f.read()

#     # === LangGraph 초기 상태 정의 ===
#     init_state: VerifyState = {
#         "pdf_bytes": pdf_bytes,
#         "user_input": user_input,
#         "num_try": 0,
#         "pdf_text": None,
#         "extracted": None,
#         "verified": None,
#         "error": None,
#         "risk_score": None,
#         "risk_reason": None,
#     }

#     print("\n🚀 LangGraph Agent 실행 시작...\n")

#     # === 그래프 실행 ===
#     graph = create_pdf_verifier_graph()
#     final_state = graph.invoke(init_state)

#     # === 결과 출력 ===
#     print("\n==============================")
#     print("🏁 최종 결과 (Final State)")
#     print("==============================")
#     print(f"✅ 인증 결과: {final_state.get('verified')}")
#     print(f"👤 소유자: {final_state.get('extracted', {}).get('owner')}")
#     print(f"🎂 생년월일: {final_state.get('extracted', {}).get('birth')}")
#     print(f"🏠 주소: {final_state.get('extracted', {}).get('address')}")
#     print(f"⚖️  위험도 점수: {final_state.get('risk_score')}")
#     print(f"🧠 AI 평가 사유: {final_state.get('risk_reason')}")
#     print(f"⚠️ 오류 메시지: {final_state.get('error')}")


from app.agent.contract_analysis_agent import create_contract_analysis_graph
from pathlib import Path

# def run_contract_analysis(pdf_path: str):
#     """계약서 분석 메인 실행"""
    

#     with open(pdf_path, "rb") as f:
#         pdf_bytes = f.read()

#     print("계약서 PDF 로드 완료")

#     # 1️⃣ 그래프 생성
#     graph = create_contract_analysis_graph()


#     # 3️⃣ 실행
#     result =graph.invoke({"pdf_bytes": pdf_bytes},config={"streaming": False})

#     print("\n=== 최종 결과 ===")
#     print(result.get('unfair_clauses'))
#     return result


if __name__ == "__main__":
    pdf_path = Path(r"C:\Users\SSAFY\Desktop\계약서2.pdf")
    with open(pdf_path, "rb") as f:
         pdf_bytes = f.read()

    init_state: ContractState ={
        "pdf_bytes":pdf_bytes,
    }     
    graph = create_contract_analysis_graph()
    final_state = graph.invoke(init_state)
    print(f" 평가: {final_state.get('unfair_clauses')}")


