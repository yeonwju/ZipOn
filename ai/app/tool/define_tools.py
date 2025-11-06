from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain_community.retrievers import ContextualCompressionRetriever
from langchain_community.document_compressors import CrossEncoderReranker
from langchain_core.tools import tool
from langchain_community.cross_encoders import HuggingFaceCrossEncoder
from dotenv import load_dotenv
import os

load_dotenv()

# GMS 서버용 OpenAI 호환 Embedding 모델
embeddings_model = OpenAIEmbeddings(
    model="text-embedding-3-large",
    openai_api_base="https://gms.ssafy.io/gmsapi/api.openai.com/v1",
    openai_api_key=os.getenv("GMS_KEY"), 
)

# Chroma DB 생성
civil_db = Chroma(   
    embedding=embeddings_model,
    collection_name="civil_law",
    persist_directory="./chroma_db"
)

terms_regulation_db = Chroma(
    embedding=embeddings_model,
    collection_name="terms_regulation_law",
    persist_directory="./chroma_db"
)

housing_db = Chroma(
    embedding=embeddings_model,
    collection_name="housing_law",
    persist_directory="./chroma_db"
)


# Re-rank 모델
rerank_model = HuggingFaceCrossEncoder(model_name="BAAI/bge-reranker-v2-m3")
cross_reranker = CrossEncoderReranker(model=rerank_model, top_n=2)

#검색도구
civil_db_retriever = ContextualCompressionRetriever(
    base_compressor=cross_reranker, 
    base_retriever=civil_db.as_retriever(search_kwargs={"k":5}),
)

terms_regulation_db_retriever = ContextualCompressionRetriever(
    base_compressor=cross_reranker, 
    base_retriever=terms_regulation_db.as_retriever(search_kwargs={"k":5}),
)

housing_db_retriever = ContextualCompressionRetriever(
    base_compressor=cross_reranker, 
    base_retriever=housing_db.as_retriever(search_kwargs={"k":5}),
)

@tool
def civil_law_search(query: str) -> str:
    """민법 법률 조항을 검색합니다."""
    docs = civil_db_retriever.invoke(query)

    if not docs:
        return "관련 정보를 찾을 수 없습니다."
    return "\n\n".join(d.page_content for d in docs)

@tool
def terms_regulation_law_search(query: str) -> str:
    """약관의 규제에 따른 법률 조항을 검색합니다."""
    docs = terms_regulation_db_retriever.invoke(query)

    if not docs:
        return "관련 정보를 찾을 수 없습니다."
    return "\n\n".join(d.page_content for d in docs)

@tool
def housing_law_search(query: str) -> str:
    """주택임대차보호법 법률 조항을 검색합니다."""
    docs = housing_db_retriever.invoke(query)

    if not docs:
        return "관련 정보를 찾을 수 없습니다."
    return "\n\n".join(d.page_content for d in docs)