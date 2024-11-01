import React, { useState } from 'react';
import { View, FlatList, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFoodData } from '../../hooks/useLocalStorage';
import FilterBar from './FilterBar';
import FoodItem from './FoodItem';
import { Food, CartItem } from '../../app/types';
import { RootStackParamList } from '../../app/types'; // Importa el tipo

type MenuScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Menu'>;

const MenuScreen = () => {
  const [foods] = useFoodData();
  const [filter, setFilter] = useState({ type: '', category: '' });
  const [cart, setCart] = useState<CartItem[]>([]); // Define `cart` como `CartItem[]`
  const navigation = useNavigation<MenuScreenNavigationProp>();

  const addToCart = (food: Food) => {
    setCart((prevCart) => {
      // Busca si el alimento ya está en el carrito
      const existingItem = prevCart.find((item) => item.id === food.id);
      if (existingItem) {
        // Incrementa la cantidad si ya existe
        return prevCart.map((item) =>
          item.id === food.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Añade el nuevo item con quantity = 1
        return [...prevCart, { ...food, quantity: 1 }];
      }
    });
  };

  const filteredFoods = foods.filter((food: Food) =>
    (filter.type ? food.type === filter.type : true) &&
    (filter.category ? food.category === filter.category : true)
  );

  return (
    <View>
      <FilterBar filter={filter} setFilter={setFilter} />
      <FlatList
        data={filteredFoods}
        renderItem={({ item }) => <FoodItem food={item} addToCart={addToCart} />}
        keyExtractor={(item: Food) => item.id.toString()}
      />
      <Text>Carrito: {cart.length} items</Text>
      <Button title="Ver Carrito" onPress={() => navigation.navigate('Cart', { cart })} />
    </View>
  );
};

export default MenuScreen;
