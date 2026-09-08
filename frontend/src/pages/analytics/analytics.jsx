import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { TrendingUp, PieChart as PieIcon, BarChart3 } from "lucide-react";
import { useFarm } from "../../hooks/useFarm";
import { useCrop } from "../../hooks/useCrop";
import { useExpense } from "../../hooks/useExpense";

const COLORS = ["#16a34a", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

const Analytics = () => {
  const { t } = useTranslation();
  const { farms } = useFarm();
  const { crops } = useCrop();
  const { expenses } = useExpense();

  const expenseByCategory = useMemo(() => {
    const grouped = {};
    expenses.forEach((e) => {
      grouped[e.category] = (grouped[e.category] || 0) + e.amount;
    });
    return Object.entries(grouped).map(([category, amount]) => ({
      name: t(`expenseCategories.${category}`, category),
      value: amount,
    }));
  }, [expenses, t]);

  const cropByStatus = useMemo(() => {
    const grouped = { growing: 0, harvested: 0, diseased: 0 };
    crops.forEach((c) => {
      grouped[c.status] = (grouped[c.status] || 0) + 1;
    });
    return [
      { name: t("crop.statusGrowing", "Growing"), value: grouped.growing },
      { name: t("crop.statusHarvested", "Harvested"), value: grouped.harvested },
      { name: t("crop.statusDiseased", "Diseased"), value: grouped.diseased },
    ];
  }, [crops, t]);

  const expenseByFarm = useMemo(() => {
    // Cross-reference crops -> farms is indirect since expenses aren't linked to farms directly;
    // show area under cultivation per farm instead, a meaningful farm-level metric
    return farms.map((f) => {
      const farmCrops = crops.filter((c) => c.farmId === f._id);
      const totalArea = farmCrops.reduce((sum, c) => sum + c.areaInAcres, 0);
      return { name: f.name, area: totalArea, cropCount: farmCrops.length };
    });
  }, [farms, crops]);

  const cropTypeDistribution = useMemo(() => {
    const grouped = {};
    crops.forEach((c) => {
      grouped[c.type] = (grouped[c.type] || 0) + 1;
    });
    return Object.entries(grouped).map(([type, count]) => ({
      name: t(`crops.${type}`, type),
      value: count,
    }));
  }, [crops, t]);
  
  const expenseByFarmChart = useMemo(() => {
    const grouped = {};
    expenses.forEach((e) => {
      if (!e.farmId) return;
      const farm = farms.find((f) => f._id === e.farmId);
      const label = farm ? farm.name : "Unknown";
      grouped[label] = (grouped[label] || 0) + e.amount;
    });
    return Object.entries(grouped).map(([name, amount]) => ({ name, amount }));
  }, [expenses, farms]);

  const expenseByCropChart = useMemo(() => {
    const grouped = {};
    expenses.forEach((e) => {
      if (!e.cropId) return;
      const crop = crops.find((c) => c._id === e.cropId);
      const label = crop ? t(`crops.${crop.type}`, crop.type) : "Unknown";
      grouped[label] = (grouped[label] || 0) + e.amount;
    });
    return Object.entries(grouped).map(([name, amount]) => ({ name, amount }));
  }, [expenses, crops, t]);

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const avgExpensePerFarm = farms.length > 0 ? (totalExpense / farms.length).toFixed(0) : 0;
  const totalArea = farms.reduce((sum, f) => sum + f.areaInAcres, 0);

  const hasData = farms.length > 0 || crops.length > 0 || expenses.length > 0;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{t("analytics.title", "Analytics & Reports")}</h1>
        <p className="text-gray-500 text-sm">{t("analytics.subtitle", "Insights across your farms, crops, and expenses")}</p>
      </div>

      {!hasData ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-16 flex flex-col items-center justify-center text-gray-400">
          <BarChart3 size={36} />
          <p className="mt-3 text-sm">{t("analytics.noData", "Add farms, crops, and expenses to see insights here")}</p>
        </div>
      ) : (
        <>
          {/* Summary stat row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <p className="text-sm text-gray-500">{t("analytics.totalArea", "Total Cultivated Area")}</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{totalArea.toFixed(1)} {t("farm.acres", "acres")}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <p className="text-sm text-gray-500">{t("analytics.avgExpense", "Avg. Expense per Farm")}</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">₹{Number(avgExpensePerFarm).toLocaleString("en-IN")}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <p className="text-sm text-gray-500">{t("analytics.totalCrops", "Total Crop Records")}</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{crops.length}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Expense by category */}
            {expenseByCategory.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <PieIcon size={18} className="text-gray-600" />
                  <h3 className="font-semibold text-gray-800">{t("analytics.expenseByCategory", "Expense by Category")}</h3>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={expenseByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                      {expenseByCategory.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₹${value.toLocaleString("en-IN")}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {expenseByFarmChart.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 size={18} className="text-gray-600" />
                  <h3 className="font-semibold text-gray-800">{t("analytics.expenseByFarm", "Expense by Farm")}</h3>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={expenseByFarmChart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value) => `₹${value.toLocaleString("en-IN")}`} />
                    <Bar dataKey="amount" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {expenseByCropChart.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 size={18} className="text-gray-600" />
                  <h3 className="font-semibold text-gray-800">{t("analytics.expenseByCrop", "Expense by Crop")}</h3>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={expenseByCropChart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value) => `₹${value.toLocaleString("en-IN")}`} />
                    <Bar dataKey="amount" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Crop status distribution */}
            {crops.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={18} className="text-gray-600" />
                  <h3 className="font-semibold text-gray-800">{t("analytics.cropStatus", "Crop Status Overview")}</h3>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={cropByStatus}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#16a34a" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Crop type distribution */}
            {cropTypeDistribution.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <PieIcon size={18} className="text-gray-600" />
                  <h3 className="font-semibold text-gray-800">{t("analytics.cropDistribution", "Crop Type Distribution")}</h3>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={cropTypeDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                      {cropTypeDistribution.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Area cultivated per farm */}
            {expenseByFarm.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 size={18} className="text-gray-600" />
                  <h3 className="font-semibold text-gray-800">{t("analytics.areaByFarm", "Cultivated Area by Farm")}</h3>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={expenseByFarm}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value) => `${value} ${t("farm.acres", "acres")}`} />
                    <Bar dataKey="area" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;