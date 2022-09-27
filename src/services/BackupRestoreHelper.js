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
import {decryptData, encryptData, generateKey} from './DataSecureService';
import Cache from './Cache';
import {CacheKey} from './Cache/CacheStoreConstants';

class BackupRestoreHelper {
  constructor() {
    this.backupKeys = Object.values(StoreKeys);
    this.backupKeys.splice(this.backupKeys.indexOf(StoreKeys.IsAppReloaded), 1);
    this.responseData = null;
    this.backupDataToFirebase.bind(this);
    this.clearData.bind(this);
    this.clearDataFromFirebase.bind(this);
    this.getResponseDataFromFirebase.bind(this);
    this.getLastBackupTimeStamp.bind(this);
    this.restoreDataFromFirebase.bind(this);
    this.generateKeyFromPassword.bind(this);
    this.encrypt.bind(this);
    this.decrypt.bind(this);
  }
  backupDataToFirebase({onBackupSuccess}) {
    LocalEvent.emit(EventTypes.ShowCommonConfirmationModal, {
      headerText: 'Are you Sure you want to backup your data?',
      primaryText:
        'Note: Your data(Preferences, Lists & Archives) will be stored with us',
      testID: 'back_up',
      onSureButtonPress: () => {
        deviceInfoModule.getUniqueId().then(deviceID => {
          AsyncStorage.multiGet(this.backupKeys)
            .then(storeData => {
              this.encrypt(storeData, 'canary')
                .then(encryptedData => {
                  const reference = firebase
                    .app()
                    .database(Constants.FirebaseDatabaseUrl)
                    .ref(`${Constants.FirebaseDatabasePath}${deviceID}`);
                  reference
                    .set({
                      id: deviceID,
                      data: encryptedData,
                      timeStamp: moment.now(),
                    })
                    .then(() => {
                      Toast.show({
                        type: ToastType.Success,
                        text1: 'Data Backed Up Successfully',
                      });
                      this.responseData = null;
                      onBackupSuccess?.();
                    })
                    .catch(() => {
                      Toast.show({
                        type: ToastType.Error,
                        text1: 'Data Backup Failed. Please Try Again',
                      });
                    });
                })
                .catch(() => {
                  Toast.show({
                    type: ToastType.Error,
                    text1: 'Data Backup Failed. Please Try Again',
                  });
                });
            })
            .catch(() => {});
        });
      },
    });
  }
  clearData() {
    LocalEvent.emit(EventTypes.ShowCommonConfirmationModal, {
      headerText: 'Are you sure you want to clear your data',
      primaryText:
        'All your preferances, lists & archives will be cleared. \nThis will also restart the app.',
      testID: 'clear',
      onSureButtonPress: () => {
        AsyncStorage.multiRemove(this.backupKeys).then(() => {
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

  clearDataFromFirebase() {
    deviceInfoModule.getUniqueId().then(deviceID => {
      const reference = firebase
        .app()
        .database(Constants.FirebaseDatabaseUrl)
        .ref(`${Constants.FirebaseDatabasePath}${deviceID}`);
      reference.remove();
      this.responseData = null;
    });
  }

  async getResponseDataFromFirebase(canaryId) {
    return new Promise((resolve, reject) => {
      if (this.responseData[canaryId]) {
        return resolve();
      }
      const reference = firebase
        .app()
        .database(Constants.FirebaseDatabaseUrl)
        .ref(`${Constants.FirebaseDatabasePath}${canaryId}`);
      reference.once(
        'value',
        databaseData => {
          if (JSON.stringify(databaseData) !== 'null') {
            const responseData = JSON.parse(JSON.stringify(databaseData));
            this.responseData[canaryId] = responseData;
            return resolve();
          } else {
            return reject();
          }
        },
        err => {
          return reject(err);
        },
      );
    });
  }

  async getLastBackupTimeStamp() {
    return new Promise(resolve => {
      let canaryId = Cache.getValue(CacheKey.DeviceCanaryId);
      console.log({canaryId});
      if (canaryId) {
        this.getResponseDataFromFirebase(canaryId)
          .then(() => {
            return resolve(
              moment(this.responseData?.[canaryId]?.timeStamp).format(
                'MMM Do YYYY, hh:mma',
              ),
            );
          })
          .catch(() => {
            return resolve();
          });
      } else {
        return resolve();
      }
    });
  }

  async restoreData({backupUrl, onRestoreSuccess}) {
    return new Promise((resolve, reject) => {
      LocalEvent.emit(EventTypes.CommonLoader.Show);
      // Decrypt backup url and get canary id
      let canaryId = '';
      this.getResponseDataFromFirebase(canaryId)
        .then(() => {
          // decrypt data if req
          // set in async store
          // restart app
          return resolve();
        })
        .catch(() => {
          // TODO: remove timeout
          setTimeout(() => {
            LocalEvent.emit(EventTypes.CommonLoader.Hide);
          }, 2000);
          return reject();
        });
    });
  }

  async restoreDataFromFirebase({onRestoreSuccess}) {
    return new Promise((resolve, reject) => {
      this.getResponseDataFromFirebase()
        .then(() => {
          LocalEvent.emit(EventTypes.ShowCommonConfirmationModal, {
            headerText: 'Are you Sure you want to Restore your data? ',
            primaryText: ` Restore Data from: ${moment(
              this.responseData.timeStamp,
            ).format(
              'MMM Do YYYY, hh:mma',
            )} \n This also will restart the application`,
            testID: 'restore',
            onSureButtonPress: () => {
              this.decrypt(this.responseData.data, 'canary').then(data => {
                AsyncStorage.multiSet(JSON.parse(data)).then(isDataSet => {
                  if (isDataSet) {
                    AsyncStorage.set(StoreKeys.IsAppReloaded, true).then(() => {
                      onRestoreSuccess?.();
                      Toast.show({
                        type: ToastType.Success,
                        text1: 'Data Restored Successfully',
                      });
                      RNRestart.Restart();
                      return resolve();
                    });
                  } else {
                    Toast.show({
                      type: ToastType.Error,
                      text1: 'Data Restore Failed. Please Try Again',
                    });
                    return reject();
                  }
                });
              });
            },
          });
        })
        .catch(() => {
          Toast.show({
            type: ToastType.Error,
            text1: 'Data Restore Failed. Please Try Again',
          });
        });
    });
  }

  async generateKeyFromPassword(password) {
    return new Promise(resolve => {
      generateKey(
        password,
        Constants.Encryption.salt,
        Constants.Encryption.cost,
        Constants.Encryption.length,
      ).then(key => {
        return resolve(key);
      });
    });
  }

  async encrypt(data, password) {
    return new Promise((resolve, reject) => {
      this.generateKeyFromPassword(password).then(key => {
        encryptData(JSON.stringify(data), key)
          .then(encryptedData => {
            return resolve(encryptedData);
          })
          .catch(err => {
            return reject(err);
          });
      });
    });
  }

  async decrypt(encryptedData, password) {
    return new Promise((resolve, reject) => {
      this.generateKeyFromPassword(password).then(key => {
        decryptData(encryptedData, key)
          .then(text => {
            return resolve(text);
          })
          .catch(err => {
            return reject(err);
          });
      });
    });
  }
}
export default new BackupRestoreHelper();
