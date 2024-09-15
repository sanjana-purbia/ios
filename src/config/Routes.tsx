import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '@screens/login/Login';
import { ROUTES_CONSTANTS } from './RoutesConstants';
import HomeScreen from '@screens/home/HomeScreen';
import Edit from '@screens/edit/Edit';
import Write from '@src/screens/write/write';

const Stack = createStackNavigator<RootStackParamList>();

const Routes = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {/* <Stack.Screen name={ROUTES_CONSTANTS.LOGIN} component={Login} /> */}
      <Stack.Screen name={ROUTES_CONSTANTS.HOME_SCREEN} component={HomeScreen} />
      <Stack.Screen name={ROUTES_CONSTANTS.EDIT} component={Edit} />
      <Stack.Screen name={ROUTES_CONSTANTS.WRITE} component={Write} />
    </Stack.Navigator>
  );
};

export default Routes;
