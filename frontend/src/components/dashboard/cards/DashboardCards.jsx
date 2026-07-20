import React from "react";
import { useTranslation } from "react-i18next";
import { Sprout, Wallet, Tractor, AlertTriangle } from "lucide-react";
import StatCard from "./StatCard";
import { useFarm } from "../../../hooks/useFarm";
import { useCrop } from "../../../hooks/useCrop";
import { useExpense } from "../../../hooks/useExpense";

const DashboardCards = () => {
  const { t } = useTranslation();
  const { farms } = useFarm();
  const { crops } = useCrop();
  const { totalExpense } = useExpense();

  const diseasedCount = crops.filter((c) => c.status === "diseased").length;

  const cardData = [
    { title: t("dashboard.totalFarms"), value: farms.length, icon: Tractor, color: "green" },
    { title: t("dashboard.activeCrops"), value: crops.length, icon: Sprout, color: "blue" },
    { title: t("dashboard.totalExpense"), value: `₹${totalExpense.toLocaleString("en-IN")}`, icon: Wallet, color: "amber" },
    { title: t("dashboard.diseaseAlerts"), value: diseasedCount, icon: AlertTriangle, color: "red" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cardData.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  );
};

export default DashboardCards;