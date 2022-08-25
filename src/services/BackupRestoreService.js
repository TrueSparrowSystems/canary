import {firebase} from '@react-native-firebase/database';
import {NativeModules} from 'react-native';
import deviceInfoModule from 'react-native-device-info';
import {Constants} from '../constants/Constants';
import AsyncStorage from './AsyncStorage';

export function backUpDataToFirebase(onBackUpSuccess) {
  deviceInfoModule.getUniqueId().then(deviceID => {
    AsyncStorage.getAllKeys().then(allKeys => {
      AsyncStorage.multiGet(allKeys).then(storeData => {
        const reference = firebase
          .app()
          .database(Constants.FirebaseDatabaseUrl)
          .ref(`${Constants.FirebaseDatabasePath}${deviceID}`);
        reference.set({id: deviceID, data: storeData}).then(() => {
          onBackUpSuccess?.();
        });
      });
    });
  });
}

export function clearData() {
  AsyncStorage.clear().then(() => {
    NativeModules.DevSettings.reload();
  });
}

export function restoreDataFromFirebase(onRestoreSuccess) {
  deviceInfoModule.getUniqueId().then(deviceID => {
    const reference = firebase
      .app()
      .database(Constants.FirebaseDatabaseUrl)
      .ref(`${Constants.FirebaseDatabasePath}${deviceID}`);
    reference.once('value').then(databaseData => {
      const responseData = JSON.parse(JSON.stringify(databaseData));
      AsyncStorage.multiSet(responseData?.data).then(isDataSet => {
        if (isDataSet) {
          NativeModules.DevSettings.reload();
        }
      });
      onRestoreSuccess?.();
    });
  });
}
