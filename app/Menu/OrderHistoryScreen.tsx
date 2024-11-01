import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { CartItem } from '../types';

type Order = {
  id: number;
  date: string;
  items: CartItem[];
  total: number;
};

const OrderHistoryScreen = ({ orders }: { orders: Order[] }) => {
  return (
    <View>
      <FlatList
        data={orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())}
        renderItem={({ item }) => (
          <View>
            <Text>{item.date}</Text>
            <Text>Total: ${item.total}</Text>
            {/* Detail of each item */}
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default OrderHistoryScreen;
