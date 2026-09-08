from PIL import Image
import numpy as np
import io

IMG_SIZE = 224


def preprocess_image(image_bytes):
    """Convert raw uploaded image bytes into a model-ready array."""
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize((IMG_SIZE, IMG_SIZE))
    array = np.array(image) / 255.0
    array = np.expand_dims(array, axis=0)
    return array