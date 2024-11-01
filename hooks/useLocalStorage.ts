import { useEffect, useState } from 'react';
import { loadFoodData, saveFoodData, clearStorage } from '../services/storageService';
import { foodData } from '../constants/foodData';
import { Food } from '../app/types';

export const useFoodData = () => {
  const [foods, setFoods] = useState<Food[]>([]);

  useEffect(() => {
    const loadData = async () => {
      await clearStorage();  // Limpia el almacenamiento local
      let data = await loadFoodData();
      if (data.length === 0) {
        data = foodData;  // Usa datos predeterminados si el almacenamiento está vacío
        await saveFoodData(data);
      }
      setFoods(data);
    };
    loadData();
  }, []);

  return [foods, setFoods] as const;
};
