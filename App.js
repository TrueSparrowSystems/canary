import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import {useStyleProcessor} from './src/hooks/useStyleProcessor';
import RootNavigation from './src/RootNavigation';

function App() {
  const localStyle = useStyleProcessor(styles, 'App');
  return (
    <SafeAreaView style={localStyle.container}>
      <StatusBar barStyle={'light-content'} />
      <NavigationContainer>
        <RootNavigation />
      </NavigationContainer>
    </SafeAreaView>
  );
}
const styles = {
  container: {
    height: '100%',
  },
};

export default React.memo(App);
