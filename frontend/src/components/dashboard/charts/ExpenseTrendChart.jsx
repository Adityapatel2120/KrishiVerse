import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import { useExpense } from "../../../hooks/useExpense";
import { useRevenue } from "../../../hooks/useRevenue";

const ExpenseTrendChart = () => {
  const { t } = useTranslation();
  const { expenses, loading: expenseLoading } = useExpense();
  const { revenues, loading: revenueLoading } = useRevenue();
  const [view, setView] = useState("monthly"); // "monthly" | "cumulative"

  const loading = expenseLoading || revenueLoading;

  const chartData = useMemo(() => {
    if (!expenses.length && !revenues.length) return [];

    const grouped = {};

    expenses.forEach((e) => {
      const monthKey = e.date?.slice(0, 7);
      if (!monthKey) return;
      if (!grouped[monthKey]) grouped[monthKey] = { expense: 0, revenue: 0 };
      grouped[monthKey].expense += e.amount;
    });

    revenues.forEach((r) => {
      const monthKey = r.date?.slice(0, 7);
      if (!monthKey) return;
      if (!grouped[monthKey]) grouped[monthKey] = { expense: 0, revenue: 0 };
      grouped[monthKey].revenue += r.amount;
    });

    const sorted = Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));

    let cumulativeExpense = 0;
    let cumulativeRevenue = 0;

    return sorted.map(([month, values]) => {
      cumulativeExpense += values.expense;
      cumulativeRevenue += values.revenue;
      const profit = values.revenue - values.expense;
      const cumulativeProfit = cumulativeRevenue - cumulativeExpense;

      return {
        month: new Date(month + "-01").toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
        expense: values.expense,
        revenue: values.revenue,
        profit,
        cumulativeExpense,
        cumulativeRevenue,
        cumulativeProfit,
      };
    });
  }, [expenses, revenues]);

  const totals = useMemo(() => {
    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalRevenue = revenues.reduce((sum, r) => sum + r.amount, 0);
    return {
      totalExpense,
      totalRevenue,
      netProfit: totalRevenue - totalExpense,
    };
  }, [expenses, revenues]);

  const isProfitable = totals.netProfit >= 0;

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    const revenueVal = view === "monthly"
      ? payload.find((p) => p.dataKey === "revenue")?.value
      : payload.find((p) => p.dataKey === "cumulativeRevenue")?.value;
    const expenseVal = view === "monthly"
      ? payload.find((p) => p.dataKey === "expense")?.value
      : payload.find((p) => p.dataKey === "cumulativeExpense")?.value;
    const profitVal = view === "monthly"
      ? payload.find((p) => p.dataKey === "profit")?.value
      : payload.find((p) => p.dataKey === "cumulativeProfit")?.value;

    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-3 text-sm">
        <p className="font-medium text-gray-800 mb-1.5">{label}</p>
        <p className="text-green-600">{t("revenue.title")}: ₹{revenueVal?.toLocaleString("en-IN")}</p>
        <p className="text-amber-600">{t("expense.title")}: ₹{expenseVal?.toLocaleString("en-IN")}</p>
        <p className={`font-semibold border-t border-gray-100 mt-1.5 pt-1.5 ${profitVal >= 0 ? "text-green-700" : "text-red-600"}`}>
          {t("analytics.profit", "Profit")}: {profitVal >= 0 ? "+" : ""}₹{profitVal?.toLocaleString("en-IN")}
        </p>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <h3 className="font-semibold text-gray-800">{t("dashboard.expenseTrend")}</h3>
        {chartData.length > 0 && (
          <div className="flex bg-gray-50 rounded-lg p-1">
            <button
              onClick={() => setView("monthly")}
              className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${
                view === "monthly" ? "bg-white shadow-sm text-gray-800" : "text-gray-500"
              }`}
            >
              {t("analytics.monthly", "Monthly")}
            </button>
            <button
              onClick={() => setView("cumulative")}
              className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${
                view === "cumulative" ? "bg-white shadow-sm text-gray-800" : "text-gray-500"
              }`}
            >
              {t("analytics.cumulative", "Cumulative")}
            </button>
          </div>
        )}
      </div>

      {!loading && chartData.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          {isProfitable ? (
            <TrendingUp size={16} className="text-green-600" />
          ) : (
            <TrendingDown size={16} className="text-red-500" />
          )}
          <span className={`text-sm font-semibold ${isProfitable ? "text-green-700" : "text-red-600"}`}>
            {t("analytics.netProfit", "Net")}: {isProfitable ? "+" : ""}₹{totals.netProfit.toLocaleString("en-IN")}
          </span>
          <span className="text-xs text-gray-400">
            ({t("revenue.title")} ₹{totals.totalRevenue.toLocaleString("en-IN")} − {t("expense.title")} ₹{totals.totalExpense.toLocaleString("en-IN")})
          </span>
        </div>
      )}

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
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={chartData}>
            <defs>
              <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />

            {view === "monthly" ? (
              <>
                <Area type="monotone" dataKey="revenue" name={t("revenue.title")} stroke="#16a34a" fill="url(#revenueFill)" strokeWidth={2} />
                <Area type="monotone" dataKey="expense" name={t("expense.title")} stroke="#f59e0b" fill="url(#expenseFill)" strokeWidth={2} />
                <Line type="monotone" dataKey="profit" name={t("analytics.profit", "Profit")} stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
              </>
            ) : (
              <>
                <Area type="monotone" dataKey="cumulativeRevenue" name={t("revenue.title")} stroke="#16a34a" fill="url(#revenueFill)" strokeWidth={2} />
                <Area type="monotone" dataKey="cumulativeExpense" name={t("expense.title")} stroke="#f59e0b" fill="url(#expenseFill)" strokeWidth={2} />
                <Line type="monotone" dataKey="cumulativeProfit" name={t("analytics.profit", "Profit")} stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ExpenseTrendChart;