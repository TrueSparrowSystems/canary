import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import AddCollectionModal from './src/components/AddCollectionModal';
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
        <AddCollectionModal />
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
