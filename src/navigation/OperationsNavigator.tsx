import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OperationsScreen from '@/screens/operations/OperationsScreen';
import type { OperationsStackParamList } from './types';

const Stack = createNativeStackNavigator<OperationsStackParamList>();

export default function OperationsNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Operations" component={OperationsScreen} />
    </Stack.Navigator>
  );
}
