import React, {useContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {ROUTES_CONSTANTS} from './RoutesConstants';
import AuthScreen from '@src/screens/auth/Auth';
import HomeScreen from '@screens/home/HomeScreen';
import Edit from '@screens/edit/Edit';
import Write from '@src/screens/write/write';
import {UserContext} from './userContext';
import { TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Posts from '@src/screens/posts/Posts';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from '@src/types/rootStackParamList';

type NavigatorProps = {};

const Stack = createStackNavigator<RootStackParamList>();

const Routes = () => {
  const {user, logout} = useContext(UserContext);

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {user ? (
        <>
          <Stack.Screen
            name={ROUTES_CONSTANTS.HOME_SCREEN}
            options={{
              title: `Pratik's Unity`,
              headerShown: true,
              headerRight: () => {
                return (
                  <TouchableOpacity onPress={logout} style={{marginRight: 10}}>
                    <MaterialIcons name="logout" size={28} />
                  </TouchableOpacity>
                );
              },
            }}
            component={HomeScreen}
          />
          <Stack.Screen name={ROUTES_CONSTANTS.POSTS} component={Posts} />
          <Stack.Screen name={ROUTES_CONSTANTS.EDIT} component={Edit} />
          <Stack.Screen name={ROUTES_CONSTANTS.WRITE} component={Write} />
        </>
      ) : (
        <Stack.Screen name={ROUTES_CONSTANTS.LOGIN} component={AuthScreen} />
      )}
    </Stack.Navigator>
  );
};

export default Routes;
