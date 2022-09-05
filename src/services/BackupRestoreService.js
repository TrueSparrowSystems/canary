import {firebase} from '@react-native-firebase/database';
import moment from 'moment';
import deviceInfoModule from 'react-native-device-info';
import {Constants} from '../constants/Constants';
import {EventTypes, LocalEvent} from '../utils/LocalEvent';
import AsyncStorage from './AsyncStorage';
import Toast from 'react-native-toast-message';
import {ToastType} from '../constants/ToastConstants';
import {StoreKeys} from './AsyncStorage/StoreConstants';
import RNRestart from 'react-native-restart';

const BackupKeys = Object.values(StoreKeys);

export function backUpDataToFirebase({onBackUpSuccess}) {
  LocalEvent.emit(EventTypes.ShowCommonConfirmationModal, {
    headerText: 'BackUp',
    primaryText: 'Are you Sure you want to backup your data?',
    secondaryText:
      'Note: Your data(Preferences, Lists & Archives) will be stored with us',
    testID: 'back_up',
    onSureButtonPress: () => {
      deviceInfoModule.getUniqueId().then(deviceID => {
        AsyncStorage.multiGet(BackupKeys).then(storeData => {
          const reference = firebase
            .app()
            .database(Constants.FirebaseDatabaseUrl)
            .ref(`${Constants.FirebaseDatabasePath}${deviceID}`);
          reference
            .set({id: deviceID, data: storeData, timeStamp: moment.now()})
            .then(() => {
              Toast.show({
                type: ToastType.Success,
                text1: 'Data Backed Up Successfully',
              });
              onBackUpSuccess?.();
            });
        });
      });
    },
  });
}

export function clearData() {
  LocalEvent.emit(EventTypes.ShowCommonConfirmationModal, {
    headerText: 'Clear',
    primaryText: 'Are you Sure you want to clear your data?',
    secondaryText:
      'Note: Your data(Preferences, Lists & Archives) will be cleared. \nThis will also restart the application',
    testID: 'clear',
    onSureButtonPress: () => {
      AsyncStorage.multiRemove(BackupKeys).then(() => {
        AsyncStorage.set(StoreKeys.IsAppReloaded, true).then(() => {
          Toast.show({
            type: ToastType.Success,
            text1: 'Data Cleared Successfully',
          });
          RNRestart.Restart();
        });
      });
    },
  });
}

export function clearDataFromFirebase() {
  deviceInfoModule.getUniqueId().then(deviceID => {
    const reference = firebase
      .app()
      .database(Constants.FirebaseDatabaseUrl)
      .ref(`${Constants.FirebaseDatabasePath}${deviceID}`);
    reference.remove();
  });
}

export function restoreDataFromFirebase({onRestoreSuccess}) {
  deviceInfoModule.getUniqueId().then(deviceID => {
    const reference = firebase
      .app()
      .database(Constants.FirebaseDatabaseUrl)
      .ref(`${Constants.FirebaseDatabasePath}${deviceID}`);
    reference.once('value', databaseData => {
      if (JSON.stringify(databaseData) !== 'null') {
        const responseData = JSON.parse(JSON.stringify(databaseData));
        LocalEvent.emit(EventTypes.ShowCommonConfirmationModal, {
          headerText: 'Restore',
          primaryText: `Are you Sure you want to Restore your data? \n\n Last Backup: ${moment(
            responseData.timeStamp,
          ).format('DD MMM YYYY hh:mm a')}`,
          secondaryText: 'Note: This will restart the application',
          testID: 'restore',
          onSureButtonPress: () => {
            AsyncStorage.multiSet(responseData?.data).then(isDataSet => {
              if (isDataSet) {
                AsyncStorage.set(StoreKeys.IsAppReloaded, true).then(() => {
                  onRestoreSuccess?.();
                  Toast.show({
                    type: ToastType.Success,
                    text1: 'Data Restored Successfully',
                  });
                  RNRestart.Restart();
                });
              } else {
                Toast.show({
                  type: ToastType.Error,
                  text1: 'Data Restore Failed. Please Try Again',
                });
              }
            });
          },
        });
      } else {
        Toast.show({
          type: ToastType.Error,
          text1: 'No Data to Restore',
        });
      }
    });
  });
}
