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

if __name__ == "__main__":
    PDF_PATH = r"C:\Users\SSAFY\Desktop\등기부등본.pdf"

    pdf_text = extract_text_from_file(PDF_PATH)
    result = extract_owner_info_llm(pdf_text)

    print("\n==============================")
    print("📄 최종 추출 결과")
    print("==============================")
    print(result)
