import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import {useStyleProcessor} from './src/hooks/useStyleProcessor';
import RootNavigation from './src/RootNavigation';
import colors from './src/utils/colors';

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
    flex: 1,
    backgroundColor: colors.DodgerBlue,
  },
};

export default React.memo(App);
