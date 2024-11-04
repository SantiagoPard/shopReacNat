import { useEffect, useState } from 'react';
import { loadFoodData, saveFoodData, clearStorage } from '../services/storageService';
import { foodData } from '../constants/foodData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Food, CartItem } from '../app/types';

export const useFoodData = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

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

    const loadCart = async () => {
      const storedCart = await AsyncStorage.getItem('cart');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    };

    loadData();
    loadCart();
  }, []);

  useEffect(() => {
    const saveCart = async () => {
      await AsyncStorage.setItem('cart', JSON.stringify(cart));
    };
    saveCart();
  }, [cart]);

  return [foods, cart, setCart] as const;
};
