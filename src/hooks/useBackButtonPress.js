import {useNavigation} from '@react-navigation/native';
import {useEffect} from 'react';
import {BackHandler} from 'react-native';

/**
 * Hook to add back button press action. Default action is to go back.
 * @param {Function} action Action to perform on back button press.
 */
function useBackButtonPress(action) {
  const navigation = useNavigation();
  useEffect(() => {
    const goBack = () => {
      if (action) {
        action();
      } else if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        BackHandler.exitApp();
      }
      return true;
    };
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      goBack,
    );
    return () => {
      subscription.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export default useBackButtonPress;
