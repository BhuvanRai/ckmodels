"""
INSTRUCTIONS FOR GOOGLE COLAB / KAGGLE:
1. Upload your ZIP file to your Colab environment.
2. Change the ZIP_PATH below to match your uploaded file's name.
3. Run this cell to extract the data and train the model.
"""

import os
import zipfile
from ultralytics import YOLO

# ==============================================================================
# SET YOUR ZIP FILE NAME HERE
# ==============================================================================
ZIP_PATH = "skin_dataset.zip" # Change this if your zip file is named differently
EXTRACT_DIR = "./skin_disease_data"
# ==============================================================================

def prepare_and_train():
    # ---------------------------------------------------------
    # STEP 1: UNZIP THE DATASET
    # ---------------------------------------------------------
    if not os.path.exists(ZIP_PATH):
        print(f"❌ Error: Could not find '{ZIP_PATH}'. Did you upload it?")
        return

    print(f"📦 Extracting {ZIP_PATH}...")
    with zipfile.ZipFile(ZIP_PATH, 'r') as zip_ref:
        zip_ref.extractall(EXTRACT_DIR)
    
    print(f"✅ Extraction complete! Data saved to {EXTRACT_DIR}")

    # ---------------------------------------------------------
    # STEP 2: VERIFY CLASSIFICATION STRUCTURE
    # ---------------------------------------------------------
    # YOLO expects: EXTRACT_DIR / train / [class_names] / images
    train_dir = os.path.join(EXTRACT_DIR, "train")
    
    if not os.path.exists(train_dir):
        # Sometimes ZIP files contain a parent folder inside. 
        # Let's check if the 'train' folder is one level deeper.
        subfolders = [f.path for f in os.scandir(EXTRACT_DIR) if f.is_dir()]
        if subfolders and os.path.exists(os.path.join(subfolders[0], "train")):
            train_dir = os.path.join(subfolders[0], "train")
            dataset_root = subfolders[0]
        else:
            print("❌ Error: Could not find a 'train' folder. Your ZIP might be structured incorrectly for classification.")
            return
    else:
        dataset_root = EXTRACT_DIR

    # Print the detected classes (folder names)
    classes = [d for d in os.listdir(train_dir) if os.path.isdir(os.path.join(train_dir, d))]
    print(f"\n📂 Dataset Structure Verified.")
    print(f"Found {len(classes)} classes: {classes}")

    # ---------------------------------------------------------
    # STEP 3: TRAIN THE CLASSIFIER
    # ---------------------------------------------------------
    print("\n🚀 Initializing YOLOv11 Nano Classification model...")
    # The '-cls' suffix is critical for classification
    model = YOLO('yolo11n-cls.pt') 
    
    print(f"Starting training on data at: {dataset_root}")
    
    results = model.train(
        data=dataset_root,   # Point to the root directory, NOT a yaml file
        epochs=50, 
        imgsz=224,           # Standard size for classification
        batch=32,
        patience=10,      
        project='skin_classification_project', 
        name='yolo_skin_run'         
    )

    print("\n🎉 Training complete!")
    best_weights = os.path.join('skin_classification_project', 'yolo_skin_run', 'weights', 'best.pt')
    
    if os.path.exists(best_weights):
        print(f"\n💾 Your trained model weights are saved at: {best_weights}")
        print("You can download 'best.pt' and use it in your app!")

if __name__ == "__main__":
    prepare_and_train()