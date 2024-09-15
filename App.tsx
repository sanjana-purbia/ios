/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Routes from '@config/Routes';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {Platform, SafeAreaView, StatusBar} from 'react-native';
import {viewStyles} from '@src/utility/ViewStyles';

function App(): React.JSX.Element {
  const queryClient = new QueryClient();
  const barColor = Platform.OS === 'ios' ? 'dark-content' : 'light-content';

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView style={viewStyles.container}>
        <StatusBar barStyle={barColor}/>
        <NavigationContainer>
          <Routes />
        </NavigationContainer>
      </SafeAreaView>
    </QueryClientProvider>
  );
}

export default App;
