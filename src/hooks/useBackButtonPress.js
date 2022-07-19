import {useNavigation} from '@react-navigation/native';
import {useEffect} from 'react';
import {BackHandler} from 'react-native';
import {CacheKey} from '../services/Cache/CacheStoreConstants';
import Cache from '../services/Cache';
import {EventTypes, LocalEvent} from '../utils/LocalEvent';

/**
 * Hook to add back button press action. Default action is to go back.
 * @param {Function} action Action to perform on back button press.
 */
function useBackButtonPress(action) {
  const navigation = useNavigation();
  useEffect(() => {
    const goBack = () => {
      const isBottomSheetOpen = Cache.getValue(CacheKey.isBottomSheetOpen);
      if (isBottomSheetOpen) {
        LocalEvent.emit(EventTypes.BottomSheets.CloseBottomSheet);
      } else if (action) {
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
  }, []);
}

export default useBackButtonPress;
