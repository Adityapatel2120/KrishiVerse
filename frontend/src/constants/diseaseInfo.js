const diseaseInfo = {
  wheat_healthy: { advice: "Plant is healthy. Continue regular monitoring and balanced fertilization." },
  wheat_brown_rust: { advice: "Apply fungicides containing propiconazole or tebuconazole. Remove and destroy infected leaves. Avoid excess nitrogen fertilization." },
  wheat_yellow_rust: { advice: "Use resistant wheat varieties where possible. Apply triazole-based fungicides early. Monitor closely during cool, humid weather." },

  rice_healthy: { advice: "Plant is healthy. Maintain proper water management and balanced fertilization." },
  rice_leaf_blast: { advice: "Apply tricyclazole or isoprothiolane fungicide. Avoid excess nitrogen. Improve field drainage." },
  rice_brown_spot: { advice: "Ensure balanced potassium and nitrogen levels. Apply fungicide if severe. Use certified disease-free seeds." },
  rice_neck_blast: { advice: "Apply fungicide at heading stage. Avoid water stress. Remove infected plant debris after harvest." },

  maize_healthy: { advice: "Plant is healthy. Continue regular crop monitoring." },
  maize_common_rust: { advice: "Apply fungicides containing azoxystrobin. Use resistant hybrid varieties. Ensure good field air circulation." },
  maize_gray_leaf_spot: { advice: "Rotate crops to reduce fungal buildup. Apply strobilurin-based fungicide. Avoid dense planting." },
  maize_northern_leaf_blight: { advice: "Use resistant hybrids. Apply fungicide at early symptoms. Practice crop rotation and residue management." },

  sugarcane_healthy: { advice: "Plant is healthy. Maintain regular irrigation and nutrient schedule." },
  sugarcane_bacterial_blight: { advice: "Use disease-free planting material. Avoid waterlogging. Remove and burn infected plants." },
  sugarcane_red_rot: { advice: "Use resistant varieties. Avoid waterlogged fields. Remove and destroy infected stalks immediately." },

  cotton_healthy: { advice: "Plant is healthy. Continue regular pest and disease monitoring." },
  cotton_bacterial_blight: { advice: "Use certified disease-free seeds. Apply copper-based bactericides. Avoid overhead irrigation." },
  cotton_powdery_mildew: { advice: "Apply sulfur-based or systemic fungicides. Improve air circulation between plants." },
  cotton_target_spot: { advice: "Apply fungicide at early signs. Avoid excess soil moisture. Remove infected lower leaves." },
  cotton_army_worm: { advice: "Use appropriate insecticide or biological control (Bt-based sprays). Monitor fields regularly for early detection." },
  cotton_aphids: { advice: "Use insecticidal soap or neem oil spray. Introduce natural predators like ladybugs where possible." },

  groundnut_healthy: { advice: "Plant is healthy. Continue balanced fertilization and monitoring." },
  groundnut_rust: { advice: "Apply chlorothalonil or mancozeb-based fungicide. Remove infected leaves. Ensure proper plant spacing." },
  groundnut_early_leaf_spot: { advice: "Apply fungicide at first sign of spots. Rotate crops. Remove infected debris after harvest." },
  groundnut_late_leaf_spot: { advice: "Apply fungicide preventively during humid conditions. Use resistant varieties where available." },
  groundnut_nutrition_deficiency: { advice: "Conduct a soil test. Apply balanced fertilizer with micronutrients, particularly calcium and boron." },
};

export const getDiseaseInfo = (className) => {
  return diseaseInfo[className] || { advice: "Consult a local agricultural expert for specific guidance on this condition." };
};

export default diseaseInfo;