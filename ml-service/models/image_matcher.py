import torch
import torchvision.models as models
import torchvision.transforms as transforms
import numpy as np
import requests
from PIL import Image
from io import BytesIO

class ImageMatcher:
    def __init__(self):
        # Using MobileNetV2 from torchvision
        self.model = models.mobilenet_v2(weights=models.MobileNet_V2_Weights.DEFAULT)
        # We only need the features, so we replace the classifier with Identity
        self.model.classifier = torch.nn.Identity()
        self.model.eval()
        
        # Standard ImageNet normalization
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])

    def get_features(self, image_url):
        try:
            response = requests.get(image_url, timeout=10)
            img = Image.open(BytesIO(response.content)).convert('RGB')
            
            # Apply transforms and add batch dimension
            img_tensor = self.transform(img).unsqueeze(0)
            
            # Extract features without computing gradients
            with torch.no_grad():
                features = self.model(img_tensor)
                
            return features.squeeze().numpy()
        except Exception as e:
            print(f"Error extracting features: {e}")
            return None

image_matcher = ImageMatcher()
