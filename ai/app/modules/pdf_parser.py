import fitz
from io import BytesIO

#pdf 파일 자체를 입력으로 받을때
def extract_text_from_bytes(pdf_bytes: bytes) -> str:
    """
    PDF 파일의 바이너리 데이터를 직접 받아 텍스트를 추출합니다.
    디스크에 저장하지 않고 메모리에서 처리합니다.
    :param pdf_bytes: PDF 파일의 원본 바이트 데이터
    :return: 전체 텍스트 문자열
    """
    print("[INFO] PDF 스트림 열기 중...")
    doc = fitz.open(stream=BytesIO(pdf_bytes), filetype="pdf")
    all_text = ""

    for i, page in enumerate(doc, start=1):
        print(f"[INFO] {i}번째 페이지 처리 중...")
        text = page.get_text("text")
        all_text += f"\n\n--- Page {i} ---\n{text}"

    doc.close()
    print("[INFO] PDF 텍스트 추출 완료")
    return all_text

#백엔드 연결 전 테스트 용
def extract_text_from_file(pdf_path: str) -> str:
    """
    주어진 PDF 경로에서 모든 페이지의 텍스트를 추출합니다.
    :param pdf_path: PDF 파일의 절대경로
    :return: 전체 텍스트 문자열
    """
    print(f"[INFO] PDF 열기: {pdf_path}")
    doc = fitz.open(pdf_path)
    all_text = ""

    for i, page in enumerate(doc, start=1):
        print(f"[INFO] {i}번째 페이지 처리 중...")
        text = page.get_text("text")  # PDF 텍스트 추출
        all_text += f"\n\n--- Page {i} ---\n{text}"

    doc.close()
    print("[INFO] PDF 텍스트 추출 완료")
    return all_text