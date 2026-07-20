import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Sprout } from "lucide-react";
import { useCrop } from "../../hooks/useCrop";
import CropCard from "../../components/crop/CropCard";
import AddCropModal from "../../components/crop/AddCropModal";

const CropList = () => {
  const { t } = useTranslation();
  const { crops, loading } = useCrop();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cropToEdit, setCropToEdit] = useState(null);

  const handleAddClick = () => {
    setCropToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (crop) => {
    setCropToEdit(crop);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setCropToEdit(null);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t("crop.title")}</h1>
          <p className="text-gray-500 text-sm">{t("crop.subtitle")}</p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={18} />
          {t("crop.addCrop")}
        </button>
      </div>

      {loading ? (
        <div className="text-gray-400 text-sm">{t("common.loading")}</div>
      ) : crops.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-16 flex flex-col items-center justify-center text-gray-400">
          <Sprout size={36} />
          <p className="mt-3 text-sm">{t("crop.noCrops")}</p>
          <button onClick={handleAddClick} className="mt-4 text-green-600 font-medium text-sm hover:underline">
            {t("crop.addFirstCrop")}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {crops.map((crop) => (
            <CropCard key={crop.id} crop={crop} onEdit={handleEditClick} />
          ))}
        </div>
      )}

      <AddCropModal isOpen={isModalOpen} onClose={handleClose} cropToEdit={cropToEdit} />
    </div>
  );
};

export default CropList;