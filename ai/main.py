# from fastapi import FastAPI

# app = FastAPI()

# @app.get("/")
# def read_root():
#     return {"message": "Hello, FastAPI with uv!"}
# main.py
from fastapi import FastAPI
from app.modules.pdf_parser import extract_text_from_file
import os


app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI with uv!"}

@app.get("/extract")
def extract_pdf():
    PDF_PATH = r"C:\Users\SSAFY\Desktop\등기부등본.pdf"

    if not os.path.exists(PDF_PATH):
        return {"error": f"❌ 파일을 찾을 수 없습니다: {PDF_PATH}"}

    print("[INFO] PDF 텍스트 추출 시작...")  # ✅ 서버 로그 출력
    text = extract_text_from_file(PDF_PATH)

    print("[INFO] 추출 완료 ✅")              # ✅ 로그 마무리
    print(text)                       # ✅ 터미널에 일부 출력 (너무 길면 조절 가능)

    # 브라우저에서는 JSON 응답으로 일부 미리보기 제공
    return {
        "message": "PDF 텍스트 추출 완료 ✅",
        "preview": text  # 너무 길면 제한 (원하면 제거 가능)
    }


# @app.post("/extract")
# async def extract_pdf(file: UploadFile):
#     pdf_bytes = await file.read()  # ✅ 파일 내용을 메모리로 읽기
#     text = extract_text_from_bytes(pdf_bytes)
#     return {"message": "추출 완료 ✅", "preview": text[:2000]}

# @app.post("/verify")
# async def verify_endpoint(
#     file: UploadFile,
#     owner: str = Form(...),
#     birth: str = Form(...),
#     address: str = Form(...)
# ):
#     """
#     Java 서버에서 보낸 사용자 입력(owner, birth, address)과
#     PDF로부터 추출한 등기부 정보를 비교하여 본인 인증을 수행합니다.
#     """
#     pdf_bytes = await file.read()
#     user_input = {"owner": owner, "birth": birth, "address": address}

#     result = verify_registration_info(pdf_bytes, user_input)
#     return result


# ===================================================
# 🧪 로컬 단독 실행용 테스트 코드
# ===================================================
# if __name__ == "__main__":
#     import os

#     # 외부 PDF 절대경로 지정
#     PDF_PATH = r"C:\Users\SSAFY\Desktop\등기부등본.pdf"

#     if not os.path.exists(PDF_PATH):
#         raise FileNotFoundError(f"❌ 파일을 찾을 수 없습니다: {PDF_PATH}")

#     print("[INFO] PDF 텍스트 추출 시작...")
#     text = extract_text_from_file(PDF_PATH)

#     print("\n==============================")
#     print("📘 PDF 텍스트 추출 결과 미리보기")
#     print("==============================")
#     print(text)  # 너무 길면 앞부분만 출력


from app.modules.pdf_parser import extract_text_from_file
from app.modules.llm_extractor import extract_owner_info_llm

from app.modules.verifier import verify_registration_info

if __name__ == "__main__":
    # 1️⃣ 테스트할 PDF 경로
    PDF_PATH = r"C:\Users\SSAFY\Desktop\등기부등본.pdf"

    # 2️⃣ 사용자 입력 (실제 Java 서버에서 넘어올 정보)
    user_input = {
        "owner": "이미정",  # 이름
        "birth": "710410",  # 주민등록번호 앞 6자리
        "address": "경기도 광명시 철산동 119-2 가산디오스텔 오피스텔 506호"  # 사용자가 입력한 주소
    }

    # 3️⃣ 로컬에서 인증 테스트 실행
    result = verify_registration_info(PDF_PATH, user_input)

    print("\n==============================")
    print("✅ 최종 결과")
    print("==============================")
    print(f"인증 성공 여부: {result['verified']}")
    print(f"주소 유사도: {result['address_similarity']}")

