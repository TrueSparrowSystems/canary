import {useNavigation} from '@react-navigation/native';
import {useCallback, useEffect, useState} from 'react';
import {Share} from 'react-native';
import {Constants} from '../../constants/Constants';
import ScreenName from '../../constants/ScreenName';
import BackupRestoreHelper from '../../services/BackupRestoreHelper';

function useSettingScreenData() {
  const navigation = useNavigation();
  const [lastBackupTimeStamp, setLastBackUpTimeStamp] = useState();

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

  useEffect(() => {
    BackupRestoreHelper.getLastBackupTimeStamp().then(timeStamp => {
      setLastBackUpTimeStamp(timeStamp);
    });
  }, []);

  return {
    sLastBackUpTimeStamp: lastBackupTimeStamp,
    fnOnInfoPress: onInfoPress,
    fnOnShareAppPress: onShareAppPress,
    fnOnPersonalizeFeedPress: onPersonalizeFeedPress,
  };
}
export default useSettingScreenData;
