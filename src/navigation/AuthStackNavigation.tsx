import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../screens/Login';
import Register from '../screens/Register';
import {AuthStackNavigationType} from '../Types';
import ForgotPassword from '../screens/ForgotPassword';

const AuthStackNavigation = () => {
  const AuthStack = createNativeStackNavigator<AuthStackNavigationType>();

  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <AuthStack.Screen
        name="Register"
        component={Register}
        options={{
          headerTitle: 'Registration',
          headerShown: false,
        }}
      />
      <AuthStack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{
          headerTitle: 'Forgot Password',
        }}
      />
    </AuthStack.Navigator>
  );
};

export default AuthStackNavigation;
