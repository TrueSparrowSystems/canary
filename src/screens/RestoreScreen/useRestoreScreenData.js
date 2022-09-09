import {useCallback, useState} from 'react';
import BackupRestoreHelper from '../../services/BackupRestoreHelper';
import Cache from '../../services/Cache';
import {CacheKey} from '../../services/Cache/CacheStoreConstants';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';

function useRestoreScreenData() {
  const [canaryId, setCanaryId] = useState(
    Cache.getValue(CacheKey.DeviceCanaryId),
  );
  const [password, setPassword] = useState();
  const [errorText, setErrorText] = useState();
  const [showPasswordField, setShowPasswordField] = useState(false);

  const onCanaryIdChange = useCallback(
    value => {
      if (errorText !== '') {
        setErrorText('');
      }
      if (showPasswordField) {
        setShowPasswordField(false);
      }
      setCanaryId(value);
    },
    [errorText, showPasswordField],
  );

  const onPasswordChange = useCallback(
    value => {
      if (errorText !== '') {
        setErrorText('');
      }
      setPassword(value);
    },
    [errorText],
  );

  const onContinueButtonPress = useCallback(() => {
    LocalEvent.emit(EventTypes.CommonLoader.Show);
    BackupRestoreHelper.isDataPasswordProtected(canaryId)
      .then(isPasswordProtected => {
        if (isPasswordProtected) {
          setShowPasswordField(true);
        } else {
          BackupRestoreHelper.restoreDataFromFirebase({
            canaryId,
            onRestoreSuccess: () => {},
          }).catch(() => {});
        }
      })
      .catch(() => {
        setErrorText('Please enter a valid Canary Id');
      })
      .finally(() => {
        LocalEvent.emit(EventTypes.CommonLoader.Hide);
      });
  }, [canaryId]);

  const onConfirmButtonPress = useCallback(() => {
    BackupRestoreHelper.restoreData({
      canaryId,
      password,
      onRestoreSuccess: () => {},
    }).catch(() => {
      setErrorText('Enter valid password');
    });
  }, [canaryId, password]);

  return {
    bShowPasswordField: showPasswordField,
    sCanaryId: canaryId,
    sErrorText: errorText,
    fnOnCanaryIdChange: onCanaryIdChange,
    fnOnPasswordChange: onPasswordChange,
    fnOnContinueButtonPress: onContinueButtonPress,
    fnOnConfirmButtonPress: onConfirmButtonPress,
  };
}
export default useRestoreScreenData;
