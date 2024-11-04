import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Image } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../app/types';
import { Food } from '../../app/types';

type CartItem = Food & { quantity: number };

const CartScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'Cart'>>();
  const initialCart = route.params.cart as CartItem[];
  const [cart, setCart] = useState<CartItem[]>(initialCart);

  const calculateTotal = () => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let delivery = 5000;
    if (total > 90000) delivery = 0;
    else if (total > 70000) delivery = 3000;
    return { total, delivery, grandTotal: total + delivery };
  };

  const { total, delivery, grandTotal } = calculateTotal();

  const updateQuantity = (item: CartItem, action: 'increase' | 'decrease') => {
    setCart((prevCart) => {
      return prevCart
        .map((cartItem) => {
          if (cartItem.id === item.id) {
            const newQuantity = action === 'increase' ? cartItem.quantity + 1 : cartItem.quantity - 1;
            return { ...cartItem, quantity: Math.max(newQuantity, 0) };
          }
          return cartItem;
        })
        .filter((cartItem) => cartItem.quantity > 0);
    });
  };

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>${item.price}</Text>
        <View style={styles.quantityContainer}>
          <Button title="-" onPress={() => updateQuantity(item, 'decrease')} />
          <Text style={styles.quantity}>{item.quantity}</Text>
          <Button title="+" onPress={() => updateQuantity(item, 'increase')} />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <Text style={styles.total}>Total: ${total}</Text>
      <Text style={styles.delivery}>Delivery: ${delivery}</Text>
      <Text style={styles.grandTotal}>Grand Total: ${grandTotal}</Text>
      <Button title="Confirm Order" onPress={() => { /* Confirm order logic */ }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 14,
    color: 'green',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  quantity: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  delivery: {
    fontSize: 16,
    marginTop: 10,
  },
  grandTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default CartScreen;
