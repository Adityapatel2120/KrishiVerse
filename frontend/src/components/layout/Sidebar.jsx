import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  Sprout,
  Wallet,
  Tractor,
  LineChart,
  User,
  Leaf,
} from "lucide-react";
import LogoutButton from "../common/LogoutButton";

const Sidebar = () => {
  const { t } = useTranslation();

  const navItems = [
    { label: t("sidebar.dashboard"), icon: LayoutDashboard, path: "/dashboard" },
    { label: t("sidebar.crop"), icon: Sprout, path: "/crop" },
    { label: t("sidebar.expense"), icon: Wallet, path: "/expense" },
    { label: t("sidebar.farm"), icon: Tractor, path: "/farm" },
    { label: t("sidebar.prediction"), icon: LineChart, path: "/prediction" },
    { label: t("sidebar.profile"), icon: User, path: "/profile" },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-100">
        <Leaf className="text-green-600" size={26} />
        <span className="text-lg font-bold text-gray-800">KrishiVerse</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-green-50 text-green-700"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-gray-100">
        <LogoutButton />
      </div>
    </aside>
  );
};

export default Sidebar;