import React from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "gu", label: "ગુજરાતી" },
];

const LanguageDropdown = () => {
  const { i18n } = useTranslation();

  const handleChange = (e) => {
    const code = e.target.value;
    i18n.changeLanguage(code);
    localStorage.setItem("preferredLanguage", code);
  };

  return (
    <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-200">
      <Globe size={16} className="text-gray-400" />
      <select
        value={i18n.language}
        onChange={handleChange}
        className="bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageDropdown;