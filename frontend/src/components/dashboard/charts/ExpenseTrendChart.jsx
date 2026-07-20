import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useExpense } from "../../../hooks/useExpense";
import { BarChart3 } from "lucide-react";

const ExpenseTrendChart = () => {
  const { t } = useTranslation();
  const { expenses, loading } = useExpense();

  const chartData = useMemo(() => {
    if (!expenses.length) return [];

    const grouped = {};
    expenses.forEach((e) => {
      const monthKey = e.date?.slice(0, 7); // "YYYY-MM"
      if (!monthKey) return;
      grouped[monthKey] = (grouped[monthKey] || 0) + e.amount;
    });

    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, amount]) => ({
        month: new Date(month + "-01").toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
        amount,
      }));
  }, [expenses]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">{t("dashboard.expenseTrend")}</h3>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
          {t("common.loading")}
        </div>
      ) : chartData.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-gray-300 border border-dashed border-gray-200 rounded-xl">
          <BarChart3 size={36} />
          <p className="text-sm text-gray-400 mt-2">{t("expense.noExpenses")}</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value) => [`₹${value.toLocaleString("en-IN")}`, "Amount"]} />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#f59e0b"
              fill="url(#expenseFill)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ExpenseTrendChart;