import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

type Order = {
  id: number;
  date: string;
  shippingCost: number;
  items: { name: string; quantity: number }[];
  total: number;
};

const ExploreScreen = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  const loadOrders = async () => {
    const storedOrders = await AsyncStorage.getItem('orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadOrders();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Pedidos:</Text>
      <FlatList
        data={orders}
        renderItem={({ item }) => (
          <View style={styles.order}>
            <Text>Pedido ID: {item.id}</Text>
            <Text>Fecha: {item.date}</Text>
            <Text>Costo de envío: ${item.shippingCost}</Text>
            <Text>Total: ${item.total}</Text>
            {item.items.map((food, index) => (
              <Text key={index}>{food.name} - Cantidad: {food.quantity}</Text>
            ))}
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  order: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
});

export default ExploreScreen; 
