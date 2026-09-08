from tensorflow.keras.models import load_model
import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "crop_disease_model.h5")
CLASS_NAMES_PATH = os.path.join(BASE_DIR, "models", "class_names.json")

print("Loading model from:", MODEL_PATH)
model = load_model(MODEL_PATH)

with open(CLASS_NAMES_PATH, "r") as f:
    class_names = json.load(f)

print(f"Model loaded with {len(class_names)} classes")


def predict_disease(processed_image, crop_filter=None):
    predictions = model.predict(processed_image)[0]

    if crop_filter:
        # Only consider class indices belonging to the selected crop
        valid_indices = [
            int(idx) for idx, name in class_names.items()
            if name.startswith(crop_filter + "_")
        ]
        if valid_indices:
            filtered_scores = {idx: predictions[idx] for idx in valid_indices}
            predicted_idx = max(filtered_scores, key=filtered_scores.get)
        else:
            predicted_idx = int(predictions.argmax())
    else:
        predicted_idx = int(predictions.argmax())

    confidence = float(predictions[predicted_idx])
    predicted_class = class_names[str(predicted_idx)]

    return {
        "predicted_class": predicted_class,
        "confidence": round(confidence * 100, 2)
    }