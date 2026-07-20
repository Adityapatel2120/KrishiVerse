import React from "react";
import { useTranslation } from "react-i18next";
import { Bell, Search, ChevronDown } from "lucide-react";
import LanguageDropdown from "../common/LanguageDropdown";
import { useAuth } from "../../hooks/useAuth";

const Navbar = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6">
      <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 w-72">
        <Search size={16} className="text-gray-400" />
        <input
          type="text"
          placeholder={t("navbar.search")}
          className="bg-transparent text-sm outline-none w-full placeholder:text-gray-400"
        />
      </div>

      <div className="flex items-center gap-4">
        <LanguageDropdown />

        <button className="relative p-2 rounded-lg hover:bg-gray-50">
          <Bell size={20} className="text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-2 cursor-pointer">
          {currentUser?.photoURL ? (
            <img
              src={currentUser.photoURL}
              alt={currentUser.displayName}
              className="w-9 h-9 rounded-full"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold text-sm">
              {currentUser?.displayName?.[0] || "U"}
            </div>
          )}
          <ChevronDown size={16} className="text-gray-400" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;