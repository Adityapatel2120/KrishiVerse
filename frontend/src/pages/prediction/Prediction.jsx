import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { UploadCloud, ScanSearch } from "lucide-react";

const Prediction = () => {
  const { t } = useTranslation();
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{t("prediction.title")}</h1>
        <p className="text-gray-500 text-sm">{t("prediction.subtitle")}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-xl">
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl h-56 cursor-pointer hover:border-green-400 transition-colors overflow-hidden">
          {preview ? (
            <img src={preview} alt="preview" className="h-full w-full object-cover" />
          ) : (
            <div className="flex flex-col items-center text-gray-400">
              <UploadCloud size={36} />
              <p className="text-sm mt-2">{t("prediction.uploadPrompt")}</p>
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>

        <button
          disabled={!preview}
          className="w-full mt-4 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-medium py-2.5 rounded-xl transition-colors"
        >
          <ScanSearch size={18} />
          {t("prediction.analyze")}
        </button>

        <p className="text-xs text-gray-400 text-center mt-3">{t("prediction.comingSoon")}</p>
      </div>
    </div>
  );
};

export default Prediction;