import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeStackNavigation from './HomeStackNavigation';
import Chat from '../screens/Chat';
import UserProfile from '../screens/UserProfile';

const BottomTabNavigation = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, size}) => {
          let iconName: any;

          if (route.name === 'HomeStackNavigation') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbox' : 'chatbox-outline';
          } else if (route.name === 'UserProfile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={focused ? '#39A37D' : 'black'}
            />
          );
        },
        tabBarStyle: {
          height: 60,
          backgroundColor: 'white',
        },
        tabBarShowLabel: false,
      })}>
      <Tab.Screen
        name="HomeStackNavigation"
        component={HomeStackNavigation}
        options={{headerShown: false}}
      />
      <Tab.Screen name="Chat" component={Chat} options={{headerShown: false}} />
      <Tab.Screen
        name="UserProfile"
        component={UserProfile}
        options={{headerTitle: 'Profile'}}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigation;
