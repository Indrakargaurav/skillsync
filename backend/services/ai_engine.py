import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
from typing import List, Tuple, Dict, Any
import time
import logging

logger = logging.getLogger(__name__)

class AIAllocationEngine:
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        self.model_name = model_name
        self.model = None
        self.company_embeddings = None
        self.company_ids = None
        self.index = None
        
    def load_model(self):
        """Load the sentence transformer model"""
        if self.model is None:
            logger.info(f"Loading model: {self.model_name}")
            self.model = SentenceTransformer(self.model_name)
            logger.info("Model loaded successfully")
    
    def build_text_representation(self, data: Dict[str, Any], data_type: str) -> str:
        """Build text representation for embedding"""
        if data_type == "student":
            text_parts = []
            if data.get("skills_text"):
                text_parts.append(f"Skills: {data['skills_text']}")
            if data.get("degree"):
                text_parts.append(f"Degree: {data['degree']}")
            if data.get("stream"):
                text_parts.append(f"Stream: {data['stream']}")
            if data.get("city") and data.get("state"):
                text_parts.append(f"Location: {data['city']}, {data['state']}")
            if data.get("preferred_locations"):
                text_parts.append(f"Preferred Locations: {data['preferred_locations']}")
            if data.get("other_notes"):
                text_parts.append(f"Notes: {data['other_notes']}")
            return " | ".join(text_parts)
        
        elif data_type == "company":
            text_parts = []
            if data.get("req_skills_text"):
                text_parts.append(f"Required Skills: {data['req_skills_text']}")
            if data.get("job_description"):
                text_parts.append(f"Job Description: {data['job_description']}")
            if data.get("position_title"):
                text_parts.append(f"Position: {data['position_title']}")
            if data.get("location_city") and data.get("location_state"):
                text_parts.append(f"Location: {data['location_city']}, {data['location_state']}")
            if data.get("priority_flags"):
                text_parts.append(f"Priority: {data['priority_flags']}")
            if data.get("other_notes"):
                text_parts.append(f"Notes: {data['other_notes']}")
            return " | ".join(text_parts)
        
        return ""
    
    def encode_texts(self, texts: List[str]) -> np.ndarray:
        """Encode texts to embeddings"""
        if not texts:
            return np.array([])
        
        self.load_model()
        embeddings = self.model.encode(texts, convert_to_numpy=True)
        
        # L2 normalize embeddings for cosine similarity
        norms = np.linalg.norm(embeddings, axis=1, keepdims=True)
        embeddings = embeddings / (norms + 1e-8)
        
        return embeddings
    
    def build_company_index(self, companies: List[Dict[str, Any]]):
        """Build FAISS index for companies"""
        logger.info(f"Building index for {len(companies)} companies")
        
        company_texts = []
        self.company_ids = []
        
        for company in companies:
            text = self.build_text_representation(company, "company")
            if text.strip():
                company_texts.append(text)
                self.company_ids.append(company["company_id"])
        
        if not company_texts:
            logger.warning("No valid company texts found")
            return
        
        # Encode company texts
        self.company_embeddings = self.encode_texts(company_texts)
        
        # Build FAISS index
        dimension = self.company_embeddings.shape[1]
        self.index = faiss.IndexFlatIP(dimension)  # Inner product for cosine similarity
        self.index.add(self.company_embeddings.astype('float32'))
        
        logger.info(f"Index built with {self.index.ntotal} vectors")
    
    def find_matches(self, students: List[Dict[str, Any]], top_k: int = 5) -> List[Dict[str, Any]]:
        """Find matches for students"""
        if self.index is None or len(students) == 0:
            return []
        
        logger.info(f"Finding matches for {len(students)} students")
        start_time = time.time()
        
        # Build student texts and encode
        student_texts = []
        valid_students = []
        
        for student in students:
            text = self.build_text_representation(student, "student")
            if text.strip():
                student_texts.append(text)
                valid_students.append(student)
        
        if not student_texts:
            logger.warning("No valid student texts found")
            return []
        
        student_embeddings = self.encode_texts(student_texts)
        
        # Search for matches
        scores, indices = self.index.search(student_embeddings.astype('float32'), top_k)
        
        # Build results
        results = []
        for i, student in enumerate(valid_students):
            for j in range(top_k):
                if indices[i][j] >= 0:  # Valid index
                    company_idx = indices[i][j]
                    company_id = self.company_ids[company_idx]
                    score = float(scores[i][j])
                    
                    results.append({
                        "student_id": student["student_id"],
                        "student_name": f"{student['first_name']} {student['last_name']}",
                        "company_id": company_id,
                        "company_name": "",  # Will be filled from company data
                        "score": score
                    })
        
        processing_time = time.time() - start_time
        logger.info(f"Found {len(results)} matches in {processing_time:.2f} seconds")
        
        return results
    
    def reset_index(self):
        """Reset the company index"""
        self.company_embeddings = None
        self.company_ids = None
        self.index = None
