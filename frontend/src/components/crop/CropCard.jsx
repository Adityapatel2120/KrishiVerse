import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Calendar, Layers, Trash2, Sprout, Pencil, IndianRupee, Plus } from "lucide-react";
import { useCrop } from "../../hooks/useCrop";
import { useFarm } from "../../hooks/useFarm";
import { useRevenue } from "../../hooks/useRevenue";
import AddRevenueModal from "./AddRevenueModal";

const statusColor = {
  growing: "bg-green-50 text-green-700 border-green-200",
  harvested: "bg-blue-50 text-blue-700 border-blue-200",
  diseased: "bg-red-50 text-red-700 border-red-200",
};

const CropCard = ({ crop, onEdit }) => {
  const { t } = useTranslation();
  const { deleteCrop } = useCrop();
  const { farms } = useFarm();
  const { getRevenueForCrop } = useRevenue();
  const [isRevenueModalOpen, setIsRevenueModalOpen] = useState(false);

  const farm = farms.find((f) => f._id === crop.farmId);
  const revenue = getRevenueForCrop(crop._id);
  const isHarvested = crop.status === "harvested";

  const handleDelete = () => {
    if (window.confirm(t("crop.deleteConfirm"))) {
      deleteCrop(crop._id);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Sprout size={18} className="text-green-600" />
          <h3 className="font-semibold text-gray-800">{t(`crops.${crop.type}`)}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onEdit(crop)} className="text-gray-300 hover:text-green-600 transition-colors">
            <Pencil size={16} />
          </button>
          <button onClick={handleDelete} className="text-gray-300 hover:text-red-500 transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar size={14} />
          {crop.sownDate}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Layers size={14} />
          {crop.areaInAcres} {t("farm.acres")} {farm ? `· ${farm.name}` : ""}
        </div>
      </div>

      <span className={`inline-block mt-3 text-xs font-medium px-2.5 py-1 rounded-lg border ${statusColor[crop.status]}`}>
        {t(`crop.status${crop.status.charAt(0).toUpperCase() + crop.status.slice(1)}`)}
      </span>

      {/* Revenue section — only relevant once harvested */}
      {isHarvested && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          {revenue ? (
            <button
              onClick={() => setIsRevenueModalOpen(true)}
              className="w-full flex items-center justify-between bg-green-50 hover:bg-green-100 rounded-xl px-3 py-2 transition-colors"
            >
              <span className="text-xs font-medium text-green-700 flex items-center gap-1">
                <IndianRupee size={12} />
                {t("revenue.title")}
              </span>
              <span className="text-sm font-bold text-green-700">
                ₹{revenue.amount.toLocaleString("en-IN")}
              </span>
            </button>
          ) : (
            <button
              onClick={() => setIsRevenueModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 border border-dashed border-green-300 text-green-600 hover:bg-green-50 text-sm font-medium py-2 rounded-xl transition-colors"
            >
              <Plus size={14} />
              {t("revenue.addRevenue")}
            </button>
          )}
        </div>
      )}

      <AddRevenueModal
        isOpen={isRevenueModalOpen}
        onClose={() => setIsRevenueModalOpen(false)}
        crop={crop}
        existingRevenue={revenue}
      />
    </div>
  );
};

export default CropCard;