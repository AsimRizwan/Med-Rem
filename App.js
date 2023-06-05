import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

import LoginScreen from './LoginScreen';
import HomeScreen from './HomeScreen';
import SettingsScreen from './SettingsScreen';

const Drawer = createDrawerNavigator();

const App = () => {
  const getDrawerIcon = (iconName) => ({ focused, color, size }) => (
    <Ionicons name={iconName} size={size} color={color} />
  );

  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Login"
        drawerStyle={{
          backgroundColor: '#fff',
          width: 240,
        }}
        screenOptions={({ route }) => ({
          drawerIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Login') {
              iconName = focused ? 'person' : 'person-outline';
            } else if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            return getDrawerIcon(iconName)({ focused, color, size });
          },
        })}
      >
        <Drawer.Screen name="Login" component={LoginScreen} />
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;
