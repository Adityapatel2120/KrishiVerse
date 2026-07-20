import React from "react";
import { useTranslation } from "react-i18next";
import DashboardCards from "../../components/dashboard/cards/DashboardCards";
import ExpenseTrendChart from "../../components/dashboard/charts/ExpenseTrendChart";
import WeatherWidget from "../../components/dashboard/widgets/WeatherWidget";
import RecentActivity from "../../components/dashboard/sections/RecentActivity";

const Dashboard = () => {
  const { t } = useTranslation();

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{t("dashboard.title")}</h1>
        <p className="text-gray-500 text-sm">{t("dashboard.subtitle")}</p>
      </div>

      <DashboardCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ExpenseTrendChart />
        </div>
        <WeatherWidget />
      </div>

      <RecentActivity />
    </div>
  );
};

export default Dashboard;