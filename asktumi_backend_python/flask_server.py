import os
from flask import Flask, request
# Import secure_filename for safer file names
from werkzeug.utils import secure_filename
# Import required libraries
from langchain.document_loaders import (
    PyMuPDFLoader,
    TextLoader,
    Docx2txtLoader,
    UnstructuredExcelLoader,
    CSVLoader
)
from langchain.prompts import PromptTemplate
from langchain.text_splitter import RecursiveCharacterTextSplitter
import weaviate
from langchain.retrievers.weaviate_hybrid_search import WeaviateHybridSearchRetriever
import json
from langchain.chains import RetrievalQA
from langchain.chat_models.openai import ChatOpenAI
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Set the path where uploaded files will be stored
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def query_weaviate(query, workspace_id, k_value):
    try:
        WEAVIATE_URL = os.getenv("WEAVIATE_HOST")
        auth_client_secret = weaviate.AuthApiKey(
            api_key=os.getenv("WEAVIATE_API_KEY"))

        client = weaviate.Client(
            url=WEAVIATE_URL,
            additional_headers={
                "X-Openai-Api-Key": os.getenv("OPENAI_API_KEY"),
            },
            auth_client_secret=auth_client_secret
        )

        retriever = WeaviateHybridSearchRetriever(
            client=client,
            index_name=f"ASKTUMI_{str(workspace_id).upper().replace('-', '')}",
            text_key="text",
            k=k_value,
            attributes=[],
            create_schema_if_missing=True,
        )

        prompt_template = """Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.

        {context}

        Question: {question}
        Friendly Answer:"""

        PROMPT = PromptTemplate(
            template=prompt_template, input_variables=["context", "question"]
        )

        chain_type_kwargs = {"prompt": PROMPT}

        qa = RetrievalQA.from_chain_type(llm=ChatOpenAI(
        ), chain_type="stuff", retriever=retriever, chain_type_kwargs=chain_type_kwargs, return_source_documents=True)

        result = qa({"query": query})

        # Serialize the result to JSON and return it
        return json.dumps(result), 200

    except Exception as e:
        return f"Error in query_weaviate: {str(e)}", 500

# Function to upload docs to Weaviate


def upload_docs_to_weaviate(docs, workspace_id):
    try:
        WEAVIATE_URL = os.getenv("WEAVIATE_HOST")
        auth_client_secret = weaviate.AuthApiKey(
            api_key=os.getenv("WEAVIATE_API_KEY"))

        client = weaviate.Client(
            url=WEAVIATE_URL,
            additional_headers={
                "X-Openai-Api-Key": os.getenv("OPENAI_API_KEY"),
            },
            auth_client_secret=auth_client_secret
        )

        # Split the documents into smaller chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=50
        )

        splitted_docs = text_splitter.split_documents(docs)

        print(f"Total chunks: {len(splitted_docs)}")

        print(f"Pushing docs to Weaviate...")

        retriever = WeaviateHybridSearchRetriever(
            client=client,
            index_name=f"ASKTUMI_{str(workspace_id).upper().replace('-', '')}",
            text_key="text",
            attributes=[],
            create_schema_if_missing=True,
        )

        chunk_size = 1000
        total_docs = len(docs)

        for start in range(0, total_docs, chunk_size):
            end = min(start + chunk_size, total_docs)
            chunk = docs[start:end]

            # Print some information about the current chunk
            print(
                f"Pushing chunk {start // chunk_size + 1} of {total_docs // chunk_size + 1}")
            print(f"Chunk size: {len(chunk)} documents")

            try:
                retriever.add_documents(chunk)
            except Exception as e:
                return e, 500
            
            # Print a message after each chunk is pushed
            print(f"Chunk {start // chunk_size + 1} pushed successfully.")

        print("All docs pushed to Weaviate.")
        return "All docs pushed to Weaviate!", 200
    
    except Exception as e:
        print(f"Error uploading docs to Weaviate: {str(e)}")
        return f"Error uploading docs to Weaviate: {str(e)}", 500
    
# Function to process PDF files


def process_pdf(file_path, workspace_id):
    try:
        loader = PyMuPDFLoader(file_path=file_path)
        docs = loader.load()
        return upload_docs_to_weaviate(docs=docs, workspace_id=workspace_id)
    except Exception as e:
        print(f"Error processing PDF file: {str(e)}")
        return f"Error processing PDF file: {str(e)}", 500

# Function to process DOCX files


def process_docx(file_path, workspace_id):
    try:
        loader = Docx2txtLoader(file_path=file_path)
        docs = loader.load()
        return upload_docs_to_weaviate(docs=docs, workspace_id=workspace_id)
    except Exception as e:
        print(f"Error processing DOCX file: {str(e)}")
        return f"Error processing DOCX file: {str(e)}", 500

# Function to process TXT files


def process_txt(file_path, workspace_id):
    try:
        loader = TextLoader(file_path=file_path, autodetect_encoding=True)
        docs = loader.load()
        return upload_docs_to_weaviate(docs=docs, workspace_id=workspace_id)
    except Exception as e:
        print(f"Error processing TXT file: {str(e)}")
        return f"Error processing TXT file: {str(e)}", 500

# Function to process CSV files


def process_csv(file_path, workspace_id):
    try:
        loader = CSVLoader(file_path=file_path, autodetect_encoding=True)
        docs = loader.load()
        return upload_docs_to_weaviate(docs=docs, workspace_id=workspace_id)
    except Exception as e:
        print(f"Error processing CSV file: {str(e)}")
        return f"Error processing CSV file: {str(e)}", 500

# Function to process XLSX files


def process_xlsx(file_path, workspace_id):
    try:
        loader = UnstructuredExcelLoader(file_path=file_path)
        docs = loader.load()
        return upload_docs_to_weaviate(docs=docs, workspace_id=workspace_id)
    except Exception as e:
        print(f"Error processing XLSX file: {str(e)}")
        return f"Error processing XLSX file: {str(e)}", 500


# Create the upload folder if it doesn't exist
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])


@app.route('/upload/<workspace_id>', methods=['POST'])
def upload_file(workspace_id):
    try:
        print(request.files,"hello",workspace_id)
        # Check if the post request has the file part
        if 'file' not in request.files:
            return 'No file part', 400

        file = request.files['file']

        # If the user does not select a file, the browser should submit an empty file part
        if file.filename == '':
            return 'No selected file', 400

        # Check if the file is allowed
        if file:
            # Secure the filename to prevent path traversal attacks
            filename = secure_filename(file.filename)
            # Temporary file path
            temp_file_path = os.path.join(
                app.config["UPLOAD_FOLDER"], filename)

            # Save the uploaded file temporarily
            file.save(temp_file_path)

            # Check the file extension and call the respective processing function
            if filename.lower().endswith('.pdf'):
                return process_pdf(file_path=temp_file_path,
                            workspace_id="abe1ceb5-d25a-4ac3-83a9-74284f620616")
            elif filename.lower().endswith('.docx'):
                return process_docx(file_path=temp_file_path,
                             workspace_id="abe1ceb5-d25a-4ac3-83a9-74284f620616")
            elif filename.lower().endswith('.txt'):
                return process_txt(file_path=temp_file_path,
                            workspace_id="abe1ceb5-d25a-4ac3-83a9-74284f620616")
            elif filename.lower().endswith('.csv'):
                return process_csv(file_path=temp_file_path,
                            workspace_id="abe1ceb5-d25a-4ac3-83a9-74284f620616")
            elif filename.lower().endswith('.xlsx'):
                return process_xlsx(file_path=temp_file_path,
                             workspace_id="abe1ceb5-d25a-4ac3-83a9-74284f620616")
            else:
                print("File format not supported.")

            # Delete the temporary file
            os.remove(temp_file_path)

    except Exception as e:
        print(f"Error uploading file: {str(e)}")
        return str(e), 500


@app.route('/query', methods=['POST'])
def query():
    try:
        # Get the request data and decode it as a UTF-8 string
        data = request.data.decode('utf-8')
        print(data)
        # Parse the JSON data to extract query, k_value, and workspace_id
        json_data = json.loads(data)
        query = json_data.get('query')
        k_value = json_data.get('k_value')
        workspace_id = json_data.get('workspace_id')

        if not (query and k_value and workspace_id):
            return 'Missing parameters in the request', 400

        return query_weaviate(query=query, workspace_id=workspace_id, k_value=k_value)

    except Exception as e:
        print(f"Error processing query: {str(e)}")
        return str(e), 500


if __name__ == '__main__':
    app.run(debug=True)
