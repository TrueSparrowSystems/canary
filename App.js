import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import AddCollectionModal from './src/components/AddCollectionModal';
import AddToCollectionModal from './src/components/AddToCollectionModal';
import {useStyleProcessor} from './src/hooks/useStyleProcessor';
import RootNavigation from './src/RootNavigation';
import colors from './src/constants/colors';
import Toast from 'react-native-toast-message';
import AddListModal from './src/components/AddListModal';
import AddToListModal from './src/components/AddToListModal';

function App() {
  const localStyle = useStyleProcessor(styles, 'App');
  return (
    <SafeAreaView style={localStyle.container}>
      <StatusBar barStyle={'dark-content'} />
      <NavigationContainer>
        <RootNavigation />
        <AddCollectionModal />
        <AddToCollectionModal />
        <AddListModal />
        <AddToListModal />
      </NavigationContainer>
      <Toast />
    </SafeAreaView>
  );
}
const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.GoldenTainoi,
  },
};

export default React.memo(App);
