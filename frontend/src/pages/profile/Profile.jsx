import React from "react";
import { useTranslation } from "react-i18next";
import { Mail, User, Calendar } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const Profile = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();

  const memberSince = currentUser?.metadata?.creationTime
    ? new Date(currentUser.metadata.creationTime).toLocaleDateString()
    : "-";

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{t("profile.title")}</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-lg">
        <div className="flex items-center gap-4 mb-6">
          {currentUser?.photoURL ? (
            <img src={currentUser.photoURL} alt={currentUser.displayName} className="w-16 h-16 rounded-full" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xl">
              {currentUser?.displayName?.[0] || "U"}
            </div>
          )}
          <div>
            <h2 className="text-lg font-bold text-gray-800">{currentUser?.displayName}</h2>
            <p className="text-sm text-gray-500">{currentUser?.email}</p>
          </div>
        </div>

        <h3 className="text-sm font-semibold text-gray-600 mb-3">{t("profile.accountInfo")}</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <User size={16} className="text-gray-400" />
            <span className="text-gray-500">{t("profile.name")}:</span>
            <span className="text-gray-800 font-medium">{currentUser?.displayName}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Mail size={16} className="text-gray-400" />
            <span className="text-gray-500">{t("profile.email")}:</span>
            <span className="text-gray-800 font-medium">{currentUser?.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Calendar size={16} className="text-gray-400" />
            <span className="text-gray-500">{t("profile.memberSince")}:</span>
            <span className="text-gray-800 font-medium">{memberSince}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;