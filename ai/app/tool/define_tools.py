from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain_core.tools import tool
from dotenv import load_dotenv
import os

# 환경 변수 로드
load_dotenv()

# GMS 서버용 OpenAI 호환 임베딩 모델
embeddings_model = OpenAIEmbeddings(
    model="text-embedding-3-large",
    openai_api_base="https://gms.ssafy.io/gmsapi/api.openai.com/v1",
    openai_api_key=os.getenv("GMS_KEY"),
)

# Chroma DB 로드 (embedding_function으로 변경됨)
civil_db = Chroma(
    embedding_function=embeddings_model,
    collection_name="civil_law",
    persist_directory="./chroma_db"
)

terms_regulation_db = Chroma(
    embedding_function=embeddings_model,
    collection_name="terms_regulation_law",
    persist_directory="./chroma_db"
)

housing_db = Chroma(
    embedding_function=embeddings_model,
    collection_name="housing_law",
    persist_directory="./chroma_db"
)

# 민법 검색 도구
@tool
def civil_law_search(query: str) -> str:
    """민법 법률 조항을 검색합니다."""
    try:
        docs = civil_db.similarity_search(query, k=5)
        if not docs:
            return "관련 정보를 찾을 수 없습니다."
        return "\n\n".join([d.page_content for d in docs])
    except Exception as e:
        return f"검색 중 오류 발생: {str(e)}"

# 약관의 규제에 관한 법률 검색 도구
@tool
def terms_regulation_law_search(query: str) -> str:
    """약관의 규제에 관한 법률 조항을 검색합니다."""
    try:
        docs = terms_regulation_db.similarity_search(query, k=5)
        if not docs:
            return "관련 정보를 찾을 수 없습니다."
        return "\n\n".join([d.page_content for d in docs])
    except Exception as e:
        return f"검색 중 오류 발생: {str(e)}"

# 주택임대차보호법 검색 도구
@tool
def housing_law_search(query: str) -> str:
    """주택임대차보호법 법률 조항을 검색합니다."""
    try:
        docs = housing_db.similarity_search(query, k=5)
        if not docs:
            return "관련 정보를 찾을 수 없습니다."
        return "\n\n".join([d.page_content for d in docs])
    except Exception as e:
        return f"검색 중 오류 발생: {str(e)}"
