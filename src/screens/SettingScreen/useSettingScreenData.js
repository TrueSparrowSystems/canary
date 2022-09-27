import {useNavigation} from '@react-navigation/native';
import {useCallback} from 'react';
import {Share} from 'react-native';
import {Constants} from '../../constants/Constants';
import ScreenName from '../../constants/ScreenName';

function useSettingScreenData() {
  const navigation = useNavigation();

  const onInfoPress = useCallback(() => {
    navigation.navigate(ScreenName.LandingScreen, {enableBackButton: true});
  }, [navigation]);

  const onShareAppPress = useCallback(() => {
    Share.share({
      message: `Check out Canary app - The incognito mode of Twitter.\n${Constants.GoogleDriveLink}`,
    });
  }, []);

  const onPersonalizeFeedPress = useCallback(() => {
    navigation.navigate(ScreenName.PreferenceScreen, {
      isNotOnboardingScreen: true,
    });
  }, [navigation]);

  const onRestorePress = useCallback(() => {
    navigation.navigate(ScreenName.RestoreScreen);
  }, [navigation]);

  return {
    fnOnInfoPress: onInfoPress,
    fnOnShareAppPress: onShareAppPress,
    fnOnPersonalizeFeedPress: onPersonalizeFeedPress,
    fnOnRestorePress: onRestorePress,
  };
}
export default useSettingScreenData;
