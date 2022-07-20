import {useNavigation} from '@react-navigation/native';
import {useCallback} from 'react';
import ScreenName from '../../constants/ScreenName';

function useTimelineScreenData() {
  const navigation = useNavigation();

  const onSettingsPress = useCallback(() => {
    navigation.navigate(ScreenName.SettingScreen);
  }, [navigation]);

  return {fnOnSettingsPress: onSettingsPress};
}

export default useTimelineScreenData;
