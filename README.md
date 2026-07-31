# Multi-Modal Medical AI Diagnostics Suite 🩺🧠🦴🫀🫁

A comprehensive machine learning repository containing 5 specialized medical AI models for clinical decision support. Each model folder contains ready-to-use trained weight files (`.pt`, `.pth`, `.json`), training scripts (`train.py`), and inference test scripts (`test.py`).

---

## 📁 Repository Overview & Model Weights Index

| Model Category | Directory | Model Weight File | File Format | Underlying Architecture | Input Type | Primary Output |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Bone Fracture** | `Bone/` | `best_fracture_classifier.pt` | `.pt` (PyTorch) | YOLOv11 Nano Classifier (`yolo11n-cls`) | 224x224 X-Ray Image | Fracture vs. Non-Fractured (Confidence %) |
| **Brain Tumor** | `Brain/` | `yolo11n.pt`<br>`best_brain_tumor_model.pt` | `.pt` (PyTorch) | YOLOv11 Nano Detector (`yolo11n`) | 640x640 MRI Scan | Bounding Boxes & Tumor Class (Glioma, Meningioma, Pituitary, No Tumor) |
| **Chest X-Ray** | `chest/` | `best_chest_model.pth` | `.pth` (PyTorch) | DenseNet-121 (`torchxrayvision`) | 224x224 Single-Channel X-Ray | 18 Pathology Probability Scores |
| **ECG Heartbeat** | `ECG/` | `best_ecg_model.pth` | `.pth` (PyTorch) | 1D Convolutional Neural Network (1D-CNN) | 187-Length 1D Signal Vector | 5 Heartbeat Categories (Normal, S, V, F, Q) |
| **Heart Disease** | `Heart/` | `heart_xgb_model.json` | `.json` (XGBoost) | XGBoost Gradient Boosted Trees | 13 Clinical Features Vector | Binary Risk Prediction & Probability (%) |

---

## 🔬 Model Specifications & Input/Output Documentation

### 1. 🦴 Bone Fracture Classifier (`Bone/`)

* **Directory Path**: `Bone/`
* **Weight File**: `Bone/best_fracture_classifier.pt`
* **Weight Format**: PyTorch Checkpoint (`.pt`)
* **Architecture**: YOLOv11 Nano Classification (`yolo11n-cls`)

#### 📥 Expected Inputs
* **Format**: Image file (JPEG, PNG, DICOM converted to standard image format).
* **Dimensions**: 3-channel RGB image, automatically resized to `224 x 224` pixels.
* **Preprocessing**: Pixel intensity values normalized to `[0, 1]`.

#### 📤 Expected Outputs
* **Type**: Binary classification diagnosis with confidence scores.
* **Categories**:
  1. `Fractured`: Bone fracture detected in the X-ray scan.
  2. `Non_fractured`: Normal bone scan with no fracture detected.
* **Example Output**:
  ```text
  📊 INFERENCE RESULTS:
  Fractured: 94.82%
  Non_fractured: 5.18%
  ------------------------------
  🩺 DIAGNOSIS: Fractured (Confidence: 94.82%)
  ```

#### 💻 Usage Example
```python
from ultralytics import YOLO

model = YOLO(r"Bone/best_fracture_classifier.pt")
results = model.predict(source=r"path/to/xray.jpg", imgsz=224, save=False)

probs = results[0].probs
top_class_id = probs.top1
top_class_name = model.names[top_class_id]
confidence = float(probs.top1conf) * 100

print(f"Diagnosis: {top_class_name} ({confidence:.2f}%)")
```

---

### 2. 🧠 Brain Tumor Detector (`Brain/`)

* **Directory Path**: `Brain/`
* **Weight Files**: `Brain/yolo11n.pt` / `Brain/best_brain_tumor_model.pt`
* **Weight Format**: PyTorch Checkpoint (`.pt`)
* **Architecture**: YOLOv11 Nano Object Detection (`yolo11n`)

#### 📥 Expected Inputs
* **Format**: Brain MRI Scan Image (JPEG, PNG).
* **Dimensions**: 3-channel RGB image, standard resolution `640 x 640` pixels.
* **Preprocessing**: Standard YOLO color normalization and aspect-ratio padding.

#### 📤 Expected Outputs
* **Type**: Object Detection Bounding Boxes + Classification Labels + Confidence Scores.
* **Classes Detected (4 Categories)**:
  1. `Glioma`: Tumor originating in glial cells of the brain/spinal cord.
  2. `Meningioma`: Tumor arising from membranes surrounding the brain/spine.
  3. `Pituitary`: Growth in the pituitary gland.
  4. `No Tumor`: Normal MRI slice with no detected abnormalities.
* **Example Output**:
  ```text
  ⚠️ Result: Detected 1 potential tumor(s).
     - Meningioma (Confidence: 0.89)
  Annotated image saved with bounding box visualization.
  ```

#### 💻 Usage Example
```python
from ultralytics import YOLO

model = YOLO(r"Brain/yolo11n.pt")
results = model.predict(source=r"path/to/mri.jpg", conf=0.25, save=True)

for result in results:
    for box in result.boxes:
        class_id = int(box.cls[0])
        class_name = model.names[class_id]
        confidence = float(box.conf[0])
        bbox_coords = box.xyxy[0].tolist() # [x1, y1, x2, y2]
        print(f"Detected {class_name} at {bbox_coords} with {confidence*100:.1f}% confidence")
```

---

### 3. 🫁 Chest X-Ray Multi-Pathology Analyzer (`chest/`)

* **Directory Path**: `chest/`
* **Weight File**: `chest/best_chest_model.pth`
* **Weight Format**: PyTorch State Dict (`.pth`)
* **Architecture**: DenseNet-121 (`torchxrayvision` pre-trained on NIH, CheXpert, MIMIC-CXR, PadChest)

#### 📥 Expected Inputs
* **Format**: Chest X-Ray Image (JPEG, PNG, DICOM).
* **Dimensions**: Single-channel grayscale tensor of shape `(1, 1, 224, 224)`.
* **Preprocessing Pipeline**:
  1. Load image and normalize 8-bit scale (`0-255`) to Hounsfield scale range `[-1024, 1024]` using `xrv.datasets.normalize(img, 255)`.
  2. Mean-reduce RGB channels to 1 channel (`img.mean(2)[None, ...]`).
  3. Apply TorchXRayVision center cropping and resize to `224 x 224` pixels (`XRayCenterCrop` & `XRayResizer(224)`).

#### 📤 Expected Outputs
* **Type**: Multi-label Pathology Scores (Floating point values for 18 conditions).
* **18 Pathologies Assessed**:
  * `Atelectasis`, `Consolidation`, `Infiltration`, `Pneumothorax`, `Edema`, `Emphysema`, `Fibrosis`, `Effusion`, `Pneumonia`, `Pleural_Thickening`, `Cardiomegaly`, `Nodule`, `Mass`, `Hernia`, `Lung Lesion`, `Fracture`, `Lung Opacity`, `Enlarged Cardiomediastinum`.
* **Example Output**:
  ```python
  {
      'Atelectasis': 0.3279,
      'Consolidation': 0.4293,
      'Infiltration': 0.5316,
      'Pneumothorax': 0.2884,
      'Pneumonia': 0.1856,
      'Cardiomegaly': 0.3645,
      'Lung Opacity': 0.5907,
      ...
  }
  ```

#### 💻 Usage Example
```python
import torch
import torchvision
import skimage.io
import torchxrayvision as xrv

# 1. Load image
img = skimage.io.imread(r"chest/16747_3_1.jpg")
img = xrv.datasets.normalize(img, 255)
img = img.mean(2)[None, ...]

# 2. Transform image
transform = torchvision.transforms.Compose([
    xrv.datasets.XRayCenterCrop(),
    xrv.datasets.XRayResizer(224)
])
img = transform(img)
img = torch.from_numpy(img)

# 3. Model inference
model = xrv.models.DenseNet(weights="densenet121-res224-all")
outputs = model(img[None, ...])

results = dict(zip(model.pathologies, outputs[0].detach().numpy()))
for pathology, score in results.items():
    print(f"{pathology}: {score:.4f}")
```

---

### 4. 🫀 ECG Heartbeat Classifier (`ECG/`)

* **Directory Path**: `ECG/`
* **Weight File**: `ECG/best_ecg_model.pth`
* **Weight Format**: PyTorch State Dict (`.pth`)
* **Architecture**: 1D Convolutional Neural Network (1D-CNN)

#### 📥 Expected Inputs
* **Format**: 1D Numerical Time-Series Array representing single-lead ECG signal readings.
* **Shape**: PyTorch Tensor of shape `(batch_size, 1, 187)`.
* **Preprocessing**: 187 continuous voltage readings, float32 data type, normalized between 0.0 and 1.0.

#### 📤 Expected Outputs
* **Type**: 5-Class Categorization Logits / Probabilities.
* **5 Target Classes (MIT-BIH Database Standard)**:
  * `Class 0`: Normal Beat (N)
  * `Class 1`: Supraventricular Ectopic Beat (S)
  * `Class 2`: Ventricular Ectopic Beat (V)
  * `Class 3`: Fusion Beat (F)
  * `Class 4`: Unknown / Unclassifiable Beat (Q)
* **Example Output**:
  ```text
  Predicted Heartbeat Category: Class 0 (Normal Beat)
  Class Probabilities: [0.978, 0.012, 0.005, 0.003, 0.002]
  ```

#### 💻 Usage Example
```python
import torch
import torch.nn as nn
import numpy as np

class ECG_1D_CNN(nn.Module):
    def __init__(self):
        super(ECG_1D_CNN, self).__init__()
        self.conv1 = nn.Conv1d(1, 32, kernel_size=5)
        self.pool1 = nn.MaxPool1d(2)
        self.conv2 = nn.Conv1d(32, 64, kernel_size=5)
        self.pool2 = nn.MaxPool1d(2)
        self.relu = nn.ReLU()
        self.flatten = nn.Flatten()
        self.fc1 = nn.Linear(64 * 43, 128)
        self.fc2 = nn.Linear(128, 5)

    def forward(self, x):
        x = self.pool1(self.relu(self.conv1(x)))
        x = self.pool2(self.relu(self.conv2(x)))
        x = self.flatten(x)
        x = self.relu(self.fc1(x))
        return self.fc2(x)

# Load model and weights
model = ECG_1D_CNN()
model.load_state_dict(torch.load(r"ECG/best_ecg_model.pth"))
model.eval()

# Sample 1D signal input shape (1, 1, 187)
sample_signal = torch.rand(1, 1, 187)
with torch.no_grad():
    logits = model(sample_signal)
    probabilities = torch.softmax(logits, dim=1)
    predicted_class = torch.argmax(probabilities, dim=1).item()

print(f"Predicted Class: {predicted_class}")
```

---

### 5. ❤️ Heart Disease Risk Predictor (`Heart/`)

* **Directory Path**: `Heart/`
* **Weight File**: `Heart/heart_xgb_model.json`
* **Weight Format**: XGBoost Model JSON (`.json`)
* **Architecture**: XGBoost Binary Classifier (`xgb.XGBClassifier`)

#### 📥 Expected Inputs
* **Format**: 2D Tabular Array / Dataframe of shape `(batch_size, 13)`.
* **13 Clinical Input Features**:

| Index | Feature Name | Description | Value Range / Units |
| :--- | :--- | :--- | :--- |
| 0 | `age` | Patient Age | 20 - 90 (Years) |
| 1 | `sex` | Gender | `1` = Male, `0` = Female |
| 2 | `cp` | Chest Pain Type | `0` = Typical Angina, `1` = Atypical Angina, `2` = Non-Anginal, `3` = Asymptomatic |
| 3 | `trestbps` | Resting Blood Pressure | 90 - 200 (mm Hg on admission) |
| 4 | `chol` | Serum Cholesterol | 120 - 600 (mg/dl) |
| 5 | `fbs` | Fasting Blood Sugar > 120 mg/dl | `1` = True, `0` = False |
| 6 | `restecg` | Resting ECG Results | `0` = Normal, `1` = ST-T Wave Abnormality, `2` = Left Ventricular Hypertrophy |
| 7 | `thalach` | Maximum Heart Rate Achieved | 70 - 220 (bpm) |
| 8 | `exang` | Exercise Induced Angina | `1` = Yes, `0` = No |
| 9 | `oldpeak` | ST Depression | 0.0 - 6.2 (Induced by exercise relative to rest) |
| 10 | `slope` | Slope of Peak Exercise ST Segment | `0` = Upsloping, `1` = Flat, `2` = Downsloping |
| 11 | `ca` | Major Vessels Colored by Fluoroscopy | 0, 1, 2, 3, or 4 |
| 12 | `thal` | Thalassemia Status | `1` = Normal, `2` = Fixed Defect, `3` = Reversible Defect |

#### 📤 Expected Outputs
* **Type**: Binary Outcome & Disease Risk Probability Score.
* **Output Values**:
  * `0`: Low Risk / No Heart Disease Present.
  * `1`: High Risk / Heart Disease Present.
  * `Risk Probability`: Percentage probability value (`0.0%` to `100.0%`).
* **Example Output**:
  ```text
  --- Patient Profile ---
  Predicted Class: 1 (Disease)
  Risk Probability: 84.62%
  ```

#### 💻 Usage Example
```python
import xgboost as xgb
import numpy as np

# Load XGBoost model from JSON
model = xgb.XGBClassifier()
model.load_model(r"Heart/heart_xgb_model.json")

# Patient features: [age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal]
patient_features = np.array([[65, 1, 3, 160.0, 280.0, 1, 2, 110.0, 1, 2.5, 1, 2, 3]])

prediction = model.predict(patient_features)[0]
risk_probability = model.predict_proba(patient_features)[0][1] * 100

print(f"Prediction: {'Disease Present' if prediction == 1 else 'No Disease'}")
print(f"Risk Level: {risk_probability:.2f}%")
```

---

## ⚙️ Installation & Setup

1. **Clone or Download the Repository**:
   ```bash
   git clone <repository_url>
   cd Medical
   ```

2. **Install Required Python Dependencies**:
   ```bash
   pip install torch torchvision torchaudio
   pip install ultralytics
   pip install torchxrayvision
   pip install xgboost scikit-learn pandas numpy opencv-python scikit-image
   ```

---

## 🛠️ Testing the Models

Each model subdirectory includes a dedicated test script (`test.py` / `chest_x_ray.py`) to verify inference:

* **Bone Fracture**: `python Bone/test.py`
* **Brain Tumor**: `python Brain/test.py`
* **Chest X-Ray**: `python chest/chest_x_ray.py`
* **ECG Categorization**: `python ECG/test.py`
* **Heart Disease**: `python Heart/test.py`

---

## 🤝 Clinical Disclaimer
> **IMPORTANT**: This repository is designed for educational, research, and developer reference purposes. The model predictions should be reviewed by qualified medical professionals and are not intended as standalone clinical diagnostic advice.
