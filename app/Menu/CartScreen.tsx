import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Image, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList, CartItem } from '../../app/types';
import { useRouter } from 'expo-router';

type CartParams = {
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
};

const CartScreen = () => {
  
  const route = useRoute<RouteProp<RootStackParamList, 'Cart'>>();
  const router = useRouter(); 
  const { cart, setCart } = route.params as CartParams;

  const [quantities, setQuantities] = useState<{ [key: number]: number }>(
    cart.reduce((acc, item) => {
      acc[item.id] = item.quantity;
      return acc;
    }, {} as { [key: number]: number })
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [warningModalVisible, setWarningModalVisible] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);


  //actualizacion de el total y el valor del envio
  useEffect(() => {
    const calculateTotals = () => {
      const amount = cart.reduce((sum, item) => sum + item.price * quantities[item.id], 0);
      const shipping = amount > 90000 ? 0 : amount > 70000 ? 3000 : 5000;
      setTotalAmount(amount);
      setShippingCost(shipping);
    };

    calculateTotals();
  }, [cart, quantities]);

  useEffect(() => {
    const saveCart = async () => {
      await AsyncStorage.setItem('cart', JSON.stringify(cart));
    };
    saveCart();
  }, [cart]);

  //confirmar pedido
  const confirmOrder = async () => {
    //en caso de estar vacio se hace visible el warningModal
    if (cart.length === 0) {
      setWarningModalVisible(true);
      return;
    }
    //de lo contrario se procedera con el pedido
    try {
      console.log("confirmOrder se ha llamado");
      const existingOrders = await AsyncStorage.getItem('orders');
      const orders = existingOrders ? JSON.parse(existingOrders) : [];
      
      const newOrder = {
        id: Date.now(),
        date: new Date().toISOString(),
        items: cart,
        total: totalAmount + shippingCost,
        shippingCost: shippingCost,
      };
      orders.push(newOrder);
      await AsyncStorage.setItem('orders', JSON.stringify(orders));
      setModalVisible(true);
    } catch (error) {
      console.error("Error al confirmar el pedido:", error);
    }
  };

  const handleCloseWarningModal = () => {
    setWarningModalVisible(false);
  };

  //maneja el cierre de el modal cuando se tienen objetos en el carrito
  const handleCloseModal = async () => {
    const updatedQuantities = Object.keys(quantities).reduce((acc, key) => {
      acc[Number(key)] = 0;
      return acc;
    }, {} as { [key: number]: number });

    setQuantities(updatedQuantities);
    setCart([]);
    await AsyncStorage.setItem('cart', JSON.stringify([]));
    setModalVisible(false);
    router.push('/pedidos');

  };


  //modificar cantidad de productos en el carrito
  const updateQuantity = (item: CartItem, change: number) => {
    const newQuantity = quantities[item.id] + change;

    if (newQuantity >= 0) {
      setQuantities((prev) => ({
        ...prev,
        [item.id]: newQuantity,
      }));

      const updatedCart = cart
        .map((cartItem) => {
          if (cartItem.id === item.id) {
            return { ...cartItem, quantity: newQuantity };
          }
          return cartItem;
        })
        .filter((cartItem) => cartItem.quantity > 0);

      setCart(updatedCart);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carrito:</Text>
      <FlatList
        data={cart.filter(item => quantities[item.id] > 0)}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>${item.price}</Text>
              <View style={styles.quantityContainer}>
                <Button title="-" onPress={() => updateQuantity(item, -1)} />
                <Text style={styles.quantityText}>{quantities[item.id]}</Text>
                <Button title="+" onPress={() => updateQuantity(item, 1)} />
              </View>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      <Text style={styles.totalText}>Total: ${totalAmount}</Text>
      <Text style={styles.shippingText}>
        Costo de envío: ${shippingCost}
      </Text>
      <Text style={styles.finalTotalText}>
        Total con envío: ${totalAmount + shippingCost}
      </Text>
      <Button title="CONFIRMAR PEDIDO" onPress={confirmOrder} />

       {// modal si se da al boton de confirmar orden sin tener objetos en el carrito
        }

        
      <Modal
        animationType="slide"
        transparent={true}
        visible={warningModalVisible}
        onRequestClose={handleCloseWarningModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Carrito Vacío</Text>
            <Text>No puedes confirmar un pedido si el carrito está vacío.</Text>
            <Button title="Cerrar" onPress={handleCloseWarningModal} />
          </View>
        </View>
      </Modal>

      {// modal si se da al boton de confirmar orden teniendo objetos en el carrito
        }

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Pedido Confirmado</Text>
            <Text>Tu pedido ha sido realizado con éxito.</Text>
            <Button title="Cerrar" onPress={handleCloseModal} />
          </View>
        </View>
      </Modal>
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
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 16,
    color: 'green',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  shippingText: {
    fontSize: 16,
    marginTop: 5,
  },
  finalTotalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default CartScreen;
