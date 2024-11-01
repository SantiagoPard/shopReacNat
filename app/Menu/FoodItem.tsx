import React from 'react';
import { View, Text, Image, StyleSheet, Button } from 'react-native';
import { Food } from '../../app/types';

type FoodItemProps = {
  food: Food;
  addToCart: (food: Food) => void;
};

const FoodItem: React.FC<FoodItemProps> = ({ food, addToCart }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: food.image }} style={styles.image} />
      <Text style={styles.name}>{food.name}</Text>
      <Text style={styles.price}>${food.price}</Text>
      <Text style={styles.description}>{food.description}</Text>
      <Button title="Añadir al Carrito" onPress={() => addToCart(food)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 10 },
  image: { width: 100, height: 100, borderRadius: 10 },
  name: { fontSize: 16, fontWeight: 'bold' },
  price: { fontSize: 14, color: 'green' },
  description: { fontSize: 12, color: 'gray' },
});

export default FoodItem;
