"""
INSTRUCTIONS FOR KAGGLE / GOOGLE COLAB:
1. Save this code as 'test_skin.py' in your environment.
2. Update MODEL_PATH and IMAGE_PATH below with your actual file locations.
3. Run the script using: !python test_skin.py
"""

import os
from ultralytics import YOLO

# ==============================================================================
# SET YOUR PATHS HERE
# ==============================================================================
# Path to your trained classification weights
MODEL_PATH = "skin_classification_project/yolo_skin_run/weights/best.pt"

# Path to the skin image you want to test
IMAGE_PATH = "path/to/your/test_image.jpg"
# ==============================================================================

def test_skin_classifier():
    # ---------------------------------------------------------
    # STEP 1: VALIDATE INPUTS
    # ---------------------------------------------------------
    if not os.path.exists(IMAGE_PATH):
        print(f"❌ Error: Could not find image at '{IMAGE_PATH}'. Please check IMAGE_PATH.")
        return

    if not os.path.exists(MODEL_PATH):
        print(f"❌ Error: Could not find model weights at '{MODEL_PATH}'. Please check MODEL_PATH.")
        return

    # ---------------------------------------------------------
    # STEP 2: LOAD MODEL & PREDICT
    # ---------------------------------------------------------
    print(f"\nLoading YOLO Classification model from {MODEL_PATH}...")
    model = YOLO(MODEL_PATH)

    print(f"Running inference on {IMAGE_PATH}...\n")
    
    # Run the prediction
    results = model.predict(source=IMAGE_PATH)

    # Classification results are stored in results[0]
    result = results[0] 
    
    # ---------------------------------------------------------
    # STEP 3: EXTRACT & DISPLAY RESULTS
    # ---------------------------------------------------------
    # Extract top prediction
    top1_index = result.probs.top1
    top1_confidence = result.probs.top1conf.item() * 100
    top1_name = model.names[top1_index]
    
    # Extract top 5 predictions
    top5_indices = result.probs.top5 
    top5_confidences = result.probs.top5conf

    print("="*60)
    print("🩺 SKIN CONDITION PREDICTION RESULTS")
    print("="*60)
    
    # Primary Diagnosis
    print(f"\nPRIMARY DIAGNOSIS (Top-1 Prediction):")
    print(f"➡️  {top1_name} (Confidence: {top1_confidence:.2f}%)\n")
    
    print("-" * 35)
    print("Top Possibilities Breakdown:")
    
    # Iterate through top predictions
    for i in range(len(top5_indices)):
        class_id = top5_indices[i]
        confidence = top5_confidences[i].item() * 100
        class_name = model.names[class_id]
        
        print(f"  {i+1}. {class_name:<25} {confidence:.2f}%")
    
    print("\n" + "="*60 + "\n")

if __name__ == "__main__":
    test_skin_classifier()