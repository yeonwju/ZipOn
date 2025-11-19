from fastapi import FastAPI, UploadFile, Form, File
from app.schemas.verify_state import VerifyState
from app.agent.verify_agent import create_pdf_verifier_graph
from app.agent.contract_analysis_agent import create_contract_analysis_graph
from app.schemas.contract_state import ContractState
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Property Verification AI Server")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
   file: UploadFile = File(...) 
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
# from pathlib import Path

# if __name__ == "__main__":
#     pdf_path = Path(r"C:\Users\SSAFY\Desktop\계약서2.pdf")
#     with open(pdf_path, "rb") as f:
#          pdf_bytes = f.read()

#     init_state: ContractState ={
#         "pdf_bytes":pdf_bytes,
#     }     
#     graph = create_contract_analysis_graph()
#     final_state = graph.invoke(init_state)
#     print(f" 평가: {final_state.get('unfair_clauses')}")


