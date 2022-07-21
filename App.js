import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import AddCollectionModal from './src/components/AddCollectionModal';
import AddToCollectionModal from './src/components/AddToCollectionModal';
import {useStyleProcessor} from './src/hooks/useStyleProcessor';
import RootNavigation from './src/RootNavigation';
import colors from './src/utils/colors';
import Toast from 'react-native-toast-message';

function App() {
  const localStyle = useStyleProcessor(styles, 'App');
  return (
    <SafeAreaView style={localStyle.container}>
      <StatusBar barStyle={'light-content'} />
      <NavigationContainer>
        <RootNavigation />
        <AddCollectionModal />
        <AddToCollectionModal />
      </NavigationContainer>
      <Toast />
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
