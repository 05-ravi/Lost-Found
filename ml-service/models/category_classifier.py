from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
import joblib
import os

class CategoryClassifier:
    def __init__(self):
        self.categories = [
            "Electronics", "Documents", "Accessories", 
            "Books", "Clothing", "Keys", "Wallets", "Other"
        ]
        # In a real production app, we would load a pre-trained model
        # For this implementation, we'll use a simple heuristic if no model exists
        self.model_path = "category_model.joblib"
        
    def predict(self, description):
        description = description.lower()
        
        # Simple heuristic matching for demonstration
        keywords = {
            "electronics": ["phone", "laptop", "charger", "earbuds", "headphones", "ipad"],
            "documents": ["id", "card", "passport", "license", "paper", "form"],
            "accessories": ["watch", "ring", "necklace", "bracelet", "glasses"],
            "books": ["textbook", "novel", "notebook", "binder"],
            "clothing": ["jacket", "hoodie", "shirt", "cap", "hat", "shoes"],
            "keys": ["key", "keychain", "fob"],
            "wallets": ["wallet", "purse", "cash", "credit card"]
        }
        
        for category, kws in keywords.items():
            if any(kw in description for kw in kws):
                return category.capitalize()
                
        return "Other"

category_classifier = CategoryClassifier()
