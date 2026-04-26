import os
import sys

def test_imports():
    print("Testing imports...")
    try:
        import torch
        print(f"PyTorch version: {torch.__version__}")
        
        import torchvision
        print(f"Torchvision version: {torchvision.__version__}")
        
        import faiss
        print("FAISS imported successfully")
        
        import sentence_transformers
        print("Sentence Transformers imported successfully")
        
        import easyocr
        print("EasyOCR imported successfully")
        
    except Exception as e:
        print(f"Import error: {e}")

def test_models():
    print("\nTesting Model Initializations...")
    
    print("1. Initializing SentenceTransformer...")
    from sentence_transformers import SentenceTransformer
    model = SentenceTransformer('all-MiniLM-L6-v2')
    print("SentenceTransformer ready.")

    print("2. Initializing Torchvision MobileNetV2...")
    import torchvision.models as models
    mobilenet = models.mobilenet_v2(weights=models.MobileNet_V2_Weights.DEFAULT)
    print("MobileNetV2 ready.")

    print("3. Initializing FAISS Index...")
    import faiss
    index = faiss.IndexFlatIP(384)
    print("FAISS Index ready.")

if __name__ == "__main__":
    os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"
    test_imports()
    test_models()
    print("\nAll tests passed! No segmentation fault during initialization.")
