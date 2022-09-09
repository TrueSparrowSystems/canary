import {useNavigation} from '@react-navigation/native';
import {useCallback, useEffect, useState} from 'react';
import {Share} from 'react-native';
import {Constants} from '../../constants/Constants';
import ScreenName from '../../constants/ScreenName';
import BackupRestoreHelper from '../../services/BackupRestoreHelper';

function useSettingScreenData() {
  const navigation = useNavigation();
  const [restoreDataText, setRestoreDataText] = useState(
    'Restore data from ...',
  );

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

  const onBackupPress = useCallback(() => {
    navigation.navigate(ScreenName.BackupScreen);
  }, [navigation]);

  const onRestorePress = useCallback(() => {
    navigation.navigate(ScreenName.RestoreScreen);
  }, [navigation]);

  useEffect(() => {
    BackupRestoreHelper.getLastBackupTimeStamp().then(timeStamp => {
      if (timeStamp) {
        setRestoreDataText(`Restore data from (backup ${timeStamp})`);
      } else {
        setRestoreDataText('No data to restore');
      }
    });
  }, []);

  return {
    sRestoreDataText: restoreDataText,
    fnOnInfoPress: onInfoPress,
    fnOnShareAppPress: onShareAppPress,
    fnOnBackupPress: onBackupPress,
    fnOnPersonalizeFeedPress: onPersonalizeFeedPress,
    fnOnRestorePress: onRestorePress,
  };
}
export default useSettingScreenData;
