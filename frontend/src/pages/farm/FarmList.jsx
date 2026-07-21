import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Tractor } from "lucide-react";
import { useFarm } from "../../hooks/useFarm";
import FarmCard from "../../components/farm/FarmCard";
import AddFarmModal from "../../components/farm/AddFarmModal";

const FarmList = () => {
  const { t } = useTranslation();
  const { farms, loading } = useFarm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [farmToEdit, setFarmToEdit] = useState(null);

  const handleAddClick = () => {
    setFarmToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (farm) => {
    setFarmToEdit(farm);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setFarmToEdit(null);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t("farm.title")}</h1>
          <p className="text-gray-500 text-sm">{t("farm.subtitle")}</p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={18} />
          {t("farm.addFarm")}
        </button>
      </div>

      {loading ? (
        <div className="text-gray-400 text-sm">{t("common.loading")}</div>
      ) : farms.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-16 flex flex-col items-center justify-center text-gray-400">
          <Tractor size={36} />
          <p className="mt-3 text-sm">{t("farm.noFarms")}</p>
          <button onClick={handleAddClick} className="mt-4 text-green-600 font-medium text-sm hover:underline">
            {t("farm.addFirstFarm")}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {farms.map((farm) => (
            <FarmCard key={farm.id} farm={farm} onEdit={handleEditClick} />
          ))}
        </div>
      )}

      <AddFarmModal isOpen={isModalOpen} onClose={handleClose} farmToEdit={farmToEdit} />
    </div>
  );
};

export default FarmList;