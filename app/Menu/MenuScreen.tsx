import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFoodData } from '../../hooks/useLocalStorage';
import FilterBar from './FilterBar';
import FoodItem from './FoodItem';
import { Food } from '../../app/types';
import { RootStackParamList } from '../../app/types';

type MenuScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Menu'>;

const MenuScreen = () => {
  const [foods, cart, setCart] = useFoodData();
  const [filter, setFilter] = useState({ category: '' });
  const navigation = useNavigation<MenuScreenNavigationProp>();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={() => navigation.navigate('Cart', { cart, setCart })}
          title={`Ver Carrito (${cart.length})`}
          color="blue"
        />
      ),
    });
  }, [navigation, cart]);

  const addToCart = (food: Food) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === food.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === food.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...food, quantity: 1 }];
      }
    });
  };

  const filteredFoods = foods.filter((food: Food) =>
    (filter.category ? food.category === filter.category : true)
  );


  return (
    <View style={styles.container}>
      <FilterBar filter={filter} setFilter={setFilter} />
      <FlatList
        data={filteredFoods}
        renderItem={({ item }) => <FoodItem food={item} addToCart={addToCart} />}
        keyExtractor={(item: Food) => item.id.toString()}
      />
   
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MenuScreen;
