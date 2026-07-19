import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Leaf } from "lucide-react";

const languages = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી" },
];

const LanguageSelect = () => {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();

  const handleSelect = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem("preferredLanguage", code);
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Leaf className="text-green-600" size={30} />
          <span className="text-xl font-bold text-gray-800">KrishiVerse</span>
        </div>
        <p className="text-gray-500 text-sm mb-6">{t("auth.selectLanguage")}</p>

        <div className="space-y-3">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-colors text-left"
            >
              <span className="font-medium text-gray-800">{lang.native}</span>
              <span className="text-sm text-gray-400">{lang.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelect;