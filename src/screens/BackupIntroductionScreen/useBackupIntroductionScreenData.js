import {useNavigation} from '@react-navigation/native';
import {useCallback} from 'react';
import {Constants} from '../../constants/Constants';
import ScreenName from '../../constants/ScreenName';
import BackupRestoreHelper from '../../services/BackupRestoreHelper';

function useBackupIntroductionScreenData() {
  const navigation = useNavigation();

  const onBackupButtonPress = useCallback(() => {
    BackupRestoreHelper.backupDataToFirebase({
      onBackupSuccess: () => {
        navigation.replace(ScreenName.BackupScreen);
      },
    });
  }, [navigation]);

  const onLinkTextPress = useCallback(() => {
    navigation.navigate(ScreenName.InAppPdfViewerScreen, {
      pdfUrl: Constants.Pdf,
    });
  }, [navigation]);

  return {
    fnOnBackupButtonPress: onBackupButtonPress,
    fnOnLinkTextPress: onLinkTextPress,
  };
}
export default useBackupIntroductionScreenData;
