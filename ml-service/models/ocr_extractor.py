import easyocr
import requests
from PIL import Image
from io import BytesIO
import numpy as np

class OCRExtractor:
    def __init__(self):
        self.reader = easyocr.Reader(['en'])

    def extract(self, image_url):
        try:
            response = requests.get(image_url)
            img = Image.open(BytesIO(response.content)).convert('RGB')
            img_np = np.array(img)
            
            results = self.reader.readtext(img_np)
            
            # Combine all detected text
            full_text = " ".join([res[1] for res in results])
            
            # Simple field extraction logic (e.g., looking for ID numbers or names)
            # This can be expanded based on specific document types
            
            return {
                "text": full_text,
                "confidence": float(np.mean([res[2] for res in results])) if results else 0,
                "results": [{"text": res[1], "box": [float(x) for x in res[0][0]]} for res in results]
            }
        except Exception as e:
            print(f"OCR Error: {e}")
            return {"text": "", "error": str(e)}

ocr_extractor = OCRExtractor()
