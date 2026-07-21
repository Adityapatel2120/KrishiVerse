import React from "react";
import { useTranslation } from "react-i18next";
import { MapPin, Layers, Trash2, Pencil } from "lucide-react";
import { useFarm } from "../../hooks/useFarm";

const FarmCard = ({ farm, onEdit }) => {
  const { t } = useTranslation();
  const { deleteFarm } = useFarm();

  const handleDelete = () => {
    if (window.confirm(t("farm.deleteConfirm"))) {
      deleteFarm(farm.id);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-gray-800">{farm.name}</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(farm)}
            className="text-gray-300 hover:text-green-600 transition-colors"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={handleDelete}
            className="text-gray-300 hover:text-red-500 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <MapPin size={14} />
          {farm.location}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Layers size={14} />
          {farm.areaInAcres} {t("farm.acres")} · {farm.soilType} {t("farm.soil")}
        </div>
      </div>
    </div>
  );
};

export default FarmCard;