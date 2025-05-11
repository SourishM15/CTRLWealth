import pandas as pd #library for dataframes
import tiktoken #library to estimate tokens used for each character

import faiss
# a library that allows developers to quickly search for embeddings of
# multimedia documents that are similar to each other. Can use any kind of Vector DB
# only used for demo purposes

from anthropic import Anthropic
from openai import OpenAI

import numpy as np

from google.colab import drive
drive.mount('https://drive.google.com/drive/folders/1WPwU-l2mkFMUVEqDYSt_VISAslMJBN1d?dmr=1&ec=wgc-drive-globalnav-goto')

#never share your keys publicly. always load them using .env files. Directly assignment here is for demo purposes ONLY
ANTHROPIC_API_KEY = "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"

client_ant = Anthropic(
    api_key=ANTHROPIC_API_KEY,
)

OPENAI_API_KEY = "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 "
client_openai = OpenAI(api_key=OPENAI_API_KEY)

embedding_encoding = "cl100k_base"
max_tokens = 5000  # the maximum for text-embedding-3-small is 8191

# load & inspect dataset
path = "/content/drive/My Drive/Colab Notebooks/AISC/Reviews.csv" #adjust to your own directory
reviews_df = pd.read_csv(path, index_col=0)

encoding = tiktoken.get_encoding(embedding_encoding) #get token usage estimate
top_n = 50 #Get 50 most recent reviews

reviews_df = reviews_df[["Time", "ProductId", "UserId", "Score", "Summary", "Text"]]
reviews_df = reviews_df.dropna()
reviews_df = reviews_df[:top_n]
reviews_df["combined"] = (
    "Title: " + reviews_df.Summary.str.strip() + "; Content: " + reviews_df.Text.str.strip()
)

# omit reviews that are too long to embed - OPTIONAL
reviews_df["n_tokens"] = reviews_df.combined.apply(lambda x: len(encoding.encode(x)))
reviews_df = reviews_df[reviews_df.n_tokens <= max_tokens]

print(reviews_df.shape)
reviews_df.head()

# Ensure you have your API key set in your environment per the README: https://github.com/openai/openai-python#usage

# CLAUDE does not offer its own embedding model: https://docs.anthropic.com/en/docs/build-with-claude/embeddings
# Generate embeddings using OpenAI
def get_embedding(text, model="text-embedding-3-small"):
    embeddings = client_openai.embeddings.create(
        input = [text],
        model=model
    )
    return embeddings.data[0].embedding

reviews_df['ada_embedding'] = reviews_df.combined.apply(lambda x: get_embedding(x, model='text-embedding-3-small'))
reviews_df.head()

# Load the DataFrame (if not already loaded in memory)
reviews_df["embedding"] = reviews_df["ada_embedding"].apply(np.array)

# Step 1: Create FAISS index
embedding_dim = len(reviews_df["embedding"].iloc[0])
index = faiss.IndexFlatL2(embedding_dim)  # or use IndexFlatIP for cosine similarity with normalized vectors

# Step 2: Add embeddings to the index
embeddings = np.vstack(reviews_df["embedding"].values).astype("float32")
faiss.normalize_L2(embeddings)  # normalize vectors to unit length if using cosine similarity
index.add(embeddings)

# Step 3: Define a search function
def search_reviews(query_text, k=5):
    #embedds the querry input to find k similar sources
    query_vec = np.array(get_embedding(query_text), dtype="float32").reshape(1, -1)
    faiss.normalize_L2(query_vec) # normalize vectors to unit length if using cosine similarity

    distances, indices = index.search(query_vec, k)
    results = reviews_df.iloc[indices[0]][["combined", "embedding"]]
    return results


# 🔍 Example query
query = "This food tastes great and the texture is perfect"
results = search_reviews(query)
print(results["combined"].to_string(index=False))

# Hitting the LLM response with relevant documents
def generate_response_with_rag(query, k=5, model="claude-3-7-sonnet-20250219"): #default model loaded in
    # Step 1: Retrieve relevant reviews
    relevant_docs = search_reviews(query, k=k) #rag search query
    context = "\n---\n".join(relevant_docs["combined"].tolist())

    print('\n')
    print('Relevant Documents Retreived From RAG search')
    print(context)

    # Step 2: Format the system prompt
    system_prompt = f"""
			"You are a helpful assistant that answers questions about wealth disparity in Seattle. 
            
            Use the provided context, which includes income, demographic, and housing data, to answer questions. If the answer is not in the data, say you don't know."


			Context:
			{context}
			"""

    # Step 3: Call Claude Chat Completion API
    response = client_ant.messages.create(
        model=model,
        system = system_prompt,
        messages=[
            {"role": "user", "content": query},
            ],
        temperature=0.3,
        max_tokens=300 #set according to your needs
    )

    # Extract and return only the TextBlock
    return response.content

# 🔍 Example usage
user_query = "Are customers happy with the food's texture?" #user query
model = "claude-3-7-sonnet-20250219" #modify model version here
answer = generate_response_with_rag(user_query, model=model)

print('\n')
print("Q:", user_query)
print("A:", answer)