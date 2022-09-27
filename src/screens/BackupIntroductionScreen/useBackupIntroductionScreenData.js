import {useNavigation} from '@react-navigation/native';
import {useCallback} from 'react';
import ScreenName from '../../constants/ScreenName';
import BackupRestoreHelper from '../../services/BackupRestoreHelper';

function useBackupIntroductionScreenData() {
  const navigation = useNavigation();

  const onBackupButtonPress = useCallback(() => {
    BackupRestoreHelper.backupDataToFirebase({
      onBackupSuccess: () => {
        navigation.navigate(ScreenName.BackupScreen);
      },
    });
  }, [navigation]);

  const onLinkTextPress = useCallback(() => {
    // TODO: Open in-app web backup screen
  }, []);

  return {
    fnOnBackupButtonPress: onBackupButtonPress,
    fnOnLinkTextPress: onLinkTextPress,
  };
}
export default useBackupIntroductionScreenData;
