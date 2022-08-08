import {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import Cache from '../services/Cache';
import {CacheKey} from '../services/Cache/CacheStoreConstants';
import ScreenName from '../constants/ScreenName';

const ScreenIndex = {
  [ScreenName.TimelineScreen]: 0,
  [ScreenName.DiscoverScreen]: 1,
  [ScreenName.ListScreen]: 2,
  [ScreenName.CollectionScreen]: 3,
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
      let state = Cache.getValue(CacheKey.tabPressCount[screenName]) || 0;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);
};
