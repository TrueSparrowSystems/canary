import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import AddCollectionModal from './src/components/AddCollectionModal';
import AddToCollectionModal from './src/components/AddToCollectionModal';
import {useStyleProcessor} from './src/hooks/useStyleProcessor';
import RootNavigation from './src/RootNavigation';
import colors from './src/constants/colors';
import Toast from 'react-native-toast-message';
import AddListModal from './src/components/AddListModal';
import AddToListModal from './src/components/AddToListModal';
import ConfirmDeleteModal from './src/components/common/ConfirmDeleteModal';
import toastConfig from './src/utils/ToastConfig';
import SearchUserModal from './src/components/SearchUserModal';
import CustomImageViewer from './src/components/CustomImageViewer';
import Orientation from 'react-native-orientation';
import {SafeAreaProvider} from 'react-native-safe-area-context';

function App() {
  const localStyle = useStyleProcessor(styles, 'App');

  useEffect(() => {
    Orientation.lockToPortrait();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={localStyle.container}>
        <StatusBar barStyle={'dark-content'} backgroundColor={colors.White} />
        <NavigationContainer>
          <RootNavigation />
          <AddCollectionModal />
          <AddToCollectionModal />
          <ConfirmDeleteModal />
          <AddListModal />
          <SearchUserModal />
          <AddToListModal />
          <CustomImageViewer />
        </NavigationContainer>
        <Toast config={toastConfig} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.White,
  },
};

export default React.memo(App);
