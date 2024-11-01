import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveFoodData = async (data: any) => {
  try {
    await AsyncStorage.setItem('foodData', JSON.stringify(data));
  } catch (error) {
    console.error("Error saving data", error);
  }
};

export const loadFoodData = async () => {
  try {
    const data = await AsyncStorage.getItem('foodData');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading data", error);
    return [];
  }
};

export const clearStorage = async () => {
  try {
    await AsyncStorage.removeItem('foodData');
    console.log("Datos de almacenamiento local eliminados");
  } catch (error) {
    console.error("Error al eliminar los datos", error);
  }
};
