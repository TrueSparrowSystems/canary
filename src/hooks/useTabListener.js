import {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import ScreenNames from '../ScreenName';
import Cache from '../services/Cache';
import {CacheKey} from '../services/Cache/CacheStoreConstants';

const ScreenIndex = {
  [ScreenNames.HomeScreen]: 0,
  [ScreenNames.FindMyFitScreen]: 1,
  [ScreenNames.SearchScreen]: 2,
  [ScreenNames.MessageCenterLoginScreen]: 3,
  [ScreenNames.MembershipScreen]: 4,
};

const TabAction = {
  NoAction: 1,
  ScrollToTop: 2,
};

export default (screenName, scrollToTop) => {
  const navigation = useNavigation();
  useEffect(() => {
    const tabHandler = navigation.getParent().addListener('tabPress', e => {
      const parentIndex = navigation.getParent().getState().index;
      const {index} = navigation.getState();
      let state = Cache.getValue(CacheKey.tabPressCount[screenName]);
      if (parentIndex === ScreenIndex[screenName] && index !== 0) {
        navigation.popToTop();
        Cache.setValue(
          CacheKey.tabPressCount[screenName],
          TabAction.ScrollToTop,
        );
      } else if (parentIndex !== ScreenIndex[screenName]) {
        Cache.setValue(
          CacheKey.tabPressCount[screenName],
          TabAction.ScrollToTop,
        );
      } else if (index === 0 || state === TabAction.ScrollToTop) {
        scrollToTop?.();
        Cache.setValue(CacheKey.tabPressCount[screenName], TabAction.NoAction);
      }
    });
    return tabHandler;
  }, [navigation]);
};
