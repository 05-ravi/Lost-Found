import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
import os

class TextMatcher:
    def __init__(self):
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.index = None
        self.ids = []
        self.dimension = 384  # Dimension for all-MiniLM-L6-v2

    def get_embedding(self, text):
        return self.model.encode([text])[0]

    def match(self, query_text, candidate_reports):
        if not candidate_reports:
            return []

        query_embedding = self.get_embedding(query_text).astype('float32').reshape(1, -1)
        
        # Create temporary FAISS index for candidates
        index = faiss.IndexFlatIP(self.dimension)
        
        embeddings = []
        report_ids = []
        
        for report in candidate_reports:
            # Combined text for embedding
            text = f"{report['title']} {report['description']}"
            embedding = self.get_embedding(text)
            embeddings.append(embedding)
            report_ids.append(report)

        embeddings_np = np.array(embeddings).astype('float32')
        faiss.normalize_L2(embeddings_np)
        faiss.normalize_L2(query_embedding)
        
        index.add(embeddings_np)
        
        # Search top 5
        D, I = index.search(query_embedding, min(5, len(candidate_reports)))
        
        results = []
        for score, idx in zip(D[0], I[0]):
            if idx != -1 and score >= 0.7:
                results.append({
                    "id": report_ids[idx]['id'],
                    "reportedBy": report_ids[idx]['reportedBy'],
                    "score": float(score)
                })
        
        return results

text_matcher = TextMatcher()
