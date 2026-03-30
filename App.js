import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS } from './src/lib/constants';

import LoginScreen from './src/screens/LoginScreen';
import MainScreen from './src/screens/MainScreen';
import EducationRecordScreen from './src/screens/EducationRecordScreen';
import BranchManageScreen from './src/screens/BranchManageScreen';
import DashboardScreen from './src/screens/DashboardScreen';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: COLORS.primary },
  headerTintColor: COLORS.white,
  headerTitleStyle: { fontWeight: '700' },
  headerBackTitle: '',
  contentStyle: { backgroundColor: COLORS.background },
};

function BackButton({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={{ paddingLeft: 8 }}>
      <Text style={{ color: COLORS.white, fontSize: 13, fontWeight: '600' }}>{'뒤로'}</Text>
    </TouchableOpacity>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={MainScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EducationRecord"
          component={EducationRecordScreen}
          options={({ navigation }) => ({
            title: '교육 기록 입력',
            headerLeft: () => null,
            headerRight: () => <BackButton onPress={() => navigation.goBack()} />,
          })}
        />
        <Stack.Screen
          name="BranchManage"
          component={BranchManageScreen}
          options={({ navigation }) => ({
            title: '지점 관리',
            headerLeft: () => null,
            headerRight: () => <BackButton onPress={() => navigation.goBack()} />,
          })}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={({ navigation }) => ({
            title: '전체 현황 대시보드',
            headerLeft: () => null,
            headerRight: () => <BackButton onPress={() => navigation.goBack()} />,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
