import React from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../app/types';
import { Food } from '../../app/types';

type CartItem = Food & { quantity: number };

const CartScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'Cart'>>();
  const cart = route.params.cart;

  const calculateTotal = () => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let delivery = 5000;
    if (total > 90000) delivery = 0;
    else if (total > 70000) delivery = 3000;
    return { total, delivery, grandTotal: total + delivery };
  };

  const { total, delivery, grandTotal } = calculateTotal();

  return (
    <View>
      <FlatList
        data={cart}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name} x{item.quantity} - ${item.price * item.quantity}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      <Text>Total: ${total}</Text>
      <Text>Delivery: ${delivery}</Text>
      <Text>Grand Total: ${grandTotal}</Text>
      <Button title="Confirm Order" onPress={() => { /* Confirm order logic */ }} />
    </View>
  );
};

export default CartScreen;
