import {useNavigation} from '@react-navigation/native';
import {useCallback, useState} from 'react';
import ScreenName from '../../constants/ScreenName';
import BackupRestoreHelper from '../../services/BackupRestoreHelper';

function useBackupConfirmationScreenData() {
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const navigation = useNavigation();

  const onPasswordChange = useCallback(
    value => {
      if (errorText !== '') {
        setErrorText('');
      }
      setPassword(value);
    },
    [errorText],
  );

  const onBackupSuccess = useCallback(() => {
    navigation.navigate(ScreenName.BackupCompletionScreen);
  }, [navigation]);

  const onContinueButtonPress = useCallback(() => {
    if (password.length < 8) {
      setErrorText('Password must be of minimum 8 characters');
    } else {
      BackupRestoreHelper.backupData({
        password,
        onBackupSuccess,
        isPasswordProtected: true,
      });
    }
  }, [onBackupSuccess, password]);

  return {
    bIsButtonDisabled: password.length < 8,
    sErrorText: errorText,
    fnOnContinueButtonPress: onContinueButtonPress,
    fnOnPasswordChange: onPasswordChange,
  };
}
export default useBackupConfirmationScreenData;
