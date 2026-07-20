import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Tractor, Sprout, Wallet, Inbox } from "lucide-react";
import { useFarm } from "../../../hooks/useFarm";
import { useCrop } from "../../../hooks/useCrop";
import { useExpense } from "../../../hooks/useExpense";

const RecentActivity = () => {
  const { t } = useTranslation();
  const { farms } = useFarm();
  const { crops } = useCrop();
  const { expenses } = useExpense();

  const activities = useMemo(() => {
    const farmActivities = farms.map((f) => ({
      id: f.id,
      type: "farm",
      text: `${t("farm.addFarm")}: ${f.name}`,
      createdAt: f.createdAt,
      icon: Tractor,
      color: "text-green-600 bg-green-50",
    }));

    const cropActivities = crops.map((c) => ({
      id: c.id,
      type: "crop",
      text: `${t("crop.addCrop")}: ${t(`crops.${c.type}`)}`,
      createdAt: c.createdAt,
      icon: Sprout,
      color: "text-blue-600 bg-blue-50",
    }));

    const expenseActivities = expenses.map((e) => ({
      id: e.id,
      type: "expense",
      text: `${t(`expenseCategories.${e.category}`)} · ₹${e.amount.toLocaleString("en-IN")}`,
      createdAt: e.createdAt,
      icon: Wallet,
      color: "text-amber-600 bg-amber-50",
    }));

    return [...farmActivities, ...cropActivities, ...expenseActivities]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 6);
  }, [farms, crops, expenses, t]);

  const timeAgo = (dateStr) => {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <h3 className="font-semibold text-gray-800 mb-4">{t("dashboard.recentActivity")}</h3>

      {activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-gray-300">
          <Inbox size={32} />
          <p className="text-sm text-gray-400 mt-2">No activity yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${activity.color}`}>
                <activity.icon size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700">{activity.text}</p>
                <p className="text-xs text-gray-400 mt-0.5">{timeAgo(activity.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;