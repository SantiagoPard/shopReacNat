// AppNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MenuScreen from '../../app/Menu/MenuScreen';
import CartScreen from '../../app/Menu/CartScreen';

const Stack = createStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator initialRouteName="Menu">
    <Stack.Screen name="Menu" component={MenuScreen} />
    <Stack.Screen name="Cart" component={CartScreen} />
  </Stack.Navigator>
);

export default AppNavigator;
