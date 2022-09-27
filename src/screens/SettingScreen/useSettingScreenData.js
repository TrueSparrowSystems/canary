import {useNavigation} from '@react-navigation/native';
import {useCallback} from 'react';
import {Share} from 'react-native';
import {Constants} from '../../constants/Constants';
import ScreenName from '../../constants/ScreenName';
import Cache from '../../services/Cache';
import {CacheKey} from '../../services/Cache/CacheStoreConstants';

function useSettingScreenData() {
  const navigation = useNavigation();

  const onBackupPress = useCallback(() => {
    let canaryId = Cache.getValue(CacheKey.DeviceCanaryId) || '';
    if (canaryId.length === 0) {
      navigation.navigate(ScreenName.BackupIntroductionScreen);
    } else {
      navigation.navigate(ScreenName.BackupScreen);
    }
  }, [navigation]);

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

  return {
    fnOnBackupPress: onBackupPress,
    fnOnInfoPress: onInfoPress,
    fnOnShareAppPress: onShareAppPress,
    fnOnPersonalizeFeedPress: onPersonalizeFeedPress,
  };
}
export default useSettingScreenData;
