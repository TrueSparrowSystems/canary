import {useNavigation} from '@react-navigation/native';
import {useCallback, useMemo, useState} from 'react';
import ScreenName from '../../constants/ScreenName';
import BackupRestoreHelper from '../../services/BackupRestoreHelper';
import Cache from '../../services/Cache';
import {CacheKey} from '../../services/Cache/CacheStoreConstants';

function useBackupConfirmationScreenData() {
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const navigation = useNavigation();
  const _password = useMemo(() => Cache.getValue(CacheKey.BackupPassword), []);

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

  const onContinueWithPreviousPasswordPress = useCallback(() => {
    BackupRestoreHelper.backupData({
      password: _password,
      onBackupSuccess,
      isPasswordProtected: true,
    });
  }, [_password, onBackupSuccess]);

  return {
    bIsButtonDisabled: password.length < 8,
    bShowContinueWithPreviousPassword: !!_password,
    sErrorText: errorText,
    fnOnContinueButtonPress: onContinueButtonPress,
    fnOnContinueWithPreviousPasswordPress: onContinueWithPreviousPasswordPress,
    fnOnPasswordChange: onPasswordChange,
  };
}
export default useBackupConfirmationScreenData;
