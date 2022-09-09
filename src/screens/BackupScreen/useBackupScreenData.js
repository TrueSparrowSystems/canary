import {useNavigation} from '@react-navigation/native';
import {useCallback} from 'react';
import ScreenName from '../../constants/ScreenName';
import BackupRestoreHelper from '../../services/BackupRestoreHelper';

function useBackupScreenData() {
  const navigation = useNavigation();

  const onContinueButtonPress = useCallback(() => {
    navigation.navigate(ScreenName.BackupConfirmationScreen);
  }, [navigation]);

  const onBackupSuccess = useCallback(() => {
    navigation.navigate(ScreenName.BackupCompletionScreen);
  }, [navigation]);

  const onBackupWithoutEncryptionPress = useCallback(() => {
    BackupRestoreHelper.backupDataToFirebase({
      onBackupSuccess: onBackupSuccess,
    });
  }, [onBackupSuccess]);

  return {
    fnOnContinueButtonPress: onContinueButtonPress,
    fnOnBackupWithoutEncryptionPress: onBackupWithoutEncryptionPress,
  };
}
export default useBackupScreenData;
