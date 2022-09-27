import {useCallback, useEffect, useState} from 'react';
import BackupRestoreHelper from '../../services/BackupRestoreHelper';
import Cache from '../../services/Cache';
import {CacheKey} from '../../services/Cache/CacheStoreConstants';

function useRestoreScreenData() {
  const [isLoading, setIsLoading] = useState(true);
  const [backupUrl, setBackupUrl] = useState('');
  const [restoreText, setRestoreText] = useState('');
  const [errorText, setErrorText] = useState();

  useEffect(() => {
    setBackupUrl(Cache.getValue(CacheKey.BackupUrl));
    BackupRestoreHelper.getLastBackupTimeStamp()
      .then(timeStamp => {
        if (timeStamp) {
          setRestoreText(`Last backup dated ${timeStamp}`);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const onBackupUrlChange = useCallback(
    value => {
      if (errorText !== '') {
        setErrorText('');
      }
      setBackupUrl(value);
    },
    [errorText],
  );

  const onConfirmButtonPress = useCallback(() => {
    if (!backupUrl || backupUrl.length === 0) {
      setErrorText('URL cannot be empty');
      return;
    }
    BackupRestoreHelper.restoreData({
      backupUrl,
      onRestoreSuccess: () => {},
    }).catch(() => {});
  }, [backupUrl]);

  return {
    bIsLoading: isLoading,
    sErrorText: errorText,
    sRestoreText: restoreText,
    sBackupUrl: backupUrl,
    fnOnBackupUrlChange: onBackupUrlChange,
    fnOnConfirmButtonPress: onConfirmButtonPress,
  };
}

export default useRestoreScreenData;
