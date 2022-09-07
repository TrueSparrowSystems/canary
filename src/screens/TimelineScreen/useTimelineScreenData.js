import {useNavigation} from '@react-navigation/native';
import {useCallback, useEffect, useState} from 'react';
import ScreenName from '../../constants/ScreenName';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';

function useTimelineScreenData() {
  const navigation = useNavigation();

  const [refreshing, setRefreshing] = useState(false);

  const onSettingsPress = useCallback(() => {
    navigation.navigate(ScreenName.SettingScreen);
  }, [navigation]);

  const updateList = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  useEffect(() => {
    LocalEvent.on(EventTypes.UpdateTimeline, updateList);
    return () => {
      LocalEvent.off(EventTypes.UpdateTimeline, updateList);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    fnOnSettingsPress: onSettingsPress,
    bRefreshing: refreshing,
  };
}

export default useTimelineScreenData;
