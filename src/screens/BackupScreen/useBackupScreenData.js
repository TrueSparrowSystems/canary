import {useCallback, useEffect, useRef, useState} from 'react';
import BackupRestoreHelper from '../../services/BackupRestoreHelper';
import Clipboard from '@react-native-clipboard/clipboard';
import {Share} from 'react-native';
import Toast from 'react-native-toast-message';
import {ToastType} from '../../constants/ToastConstants';

function useBackupScreenData() {
  const _backupRestoreHelper = BackupRestoreHelper;

  const [backupTimeStamp, setBackupTimeStamp] = useState('...');
  const backupUrl = useRef('');

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const fetchData = useCallback(() => {
    _backupRestoreHelper.getLastBackupTimeStamp().then(lastBackupTimeStamp => {
      _backupRestoreHelper.getBackupUrl().then(url => {
        backupUrl.current = url;
        setBackupTimeStamp(lastBackupTimeStamp);
      });
    });
  }, [_backupRestoreHelper]);

  const onBackupButtonPress = useCallback(() => {
    _backupRestoreHelper.backupDataToFirebase({
      onBackupSuccess: fetchData,
    });
  }, [_backupRestoreHelper, fetchData]);

  const onCopyLinkPress = useCallback(() => {
    Clipboard.setString(backupUrl.current);
    Toast.show({
      type: ToastType.Success,
      text1: 'Link copied to clipboard.',
    });
  }, []);

  const onShareButtonPress = useCallback(() => {
    Share.share({message: `Canary Backup.\n${backupUrl.current}`});
  }, []);

  return {
    sBackupTimeStamp: backupTimeStamp,
    sBackupUrl: backupUrl.current,
    fnOnBackupButtonPress: onBackupButtonPress,
    fnOnCopyLinkPress: onCopyLinkPress,
    fnOnShareButtonPress: onShareButtonPress,
  };
}

export default useBackupScreenData;
