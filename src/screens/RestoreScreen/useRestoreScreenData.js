import {useNavigation} from '@react-navigation/native';
import {useCallback, useEffect, useState} from 'react';
import {Constants} from '../../constants/Constants';
import ScreenName from '../../constants/ScreenName';
import BackupRestoreHelper from '../../services/BackupRestoreHelper';
import Cache from '../../services/Cache';
import {CacheKey} from '../../services/Cache/CacheStoreConstants';

function useRestoreScreenData(params) {
  const backupURL = params?.backupUrl || '';
  const [isLoading, setIsLoading] = useState(false);
  const [backupUrl, setBackupUrl] = useState(backupURL);
  const [restoreText, setRestoreText] = useState('');
  const [errorText, setErrorText] = useState();
  const navigation = useNavigation();

  useEffect(() => {
    if (backupUrl?.length === 0) {
      setIsLoading(true);
      setBackupUrl(Cache.getValue(CacheKey.DeviceBackupUrl));
      BackupRestoreHelper.getLastBackupTimeStamp()
        .then(timeStamp => {
          if (timeStamp) {
            setRestoreText(`Last backup dated ${timeStamp}`);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const onLinkTextPress = useCallback(() => {
    navigation.navigate(ScreenName.InAppPdfViewerScreen, {
      pdfUrl: Constants.Pdf,
    });
  }, [navigation]);

  return {
    bIsLoading: isLoading,
    sErrorText: errorText,
    sRestoreText: restoreText,
    sBackupUrl: backupUrl,
    fnOnBackupUrlChange: onBackupUrlChange,
    fnOnConfirmButtonPress: onConfirmButtonPress,
    fnOnLinkTextPress: onLinkTextPress,
  };
}

export default useRestoreScreenData;