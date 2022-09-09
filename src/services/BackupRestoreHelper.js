import {firebase} from '@react-native-firebase/database';
import moment from 'moment';
import {Constants} from '../constants/Constants';
import {EventTypes, LocalEvent} from '../utils/LocalEvent';
import AsyncStorage from './AsyncStorage';
import Toast from 'react-native-toast-message';
import {ToastType} from '../constants/ToastConstants';
import {StoreKeys} from './AsyncStorage/StoreConstants';
import RNRestart from 'react-native-restart';
import {decryptData, encryptData, generateKey} from './DataSecureService';
import ShortUniqueId from 'short-unique-id';
import Cache from './Cache';
import {CacheKey} from './Cache/CacheStoreConstants';

class BackupRestoreHelper {
  constructor() {
    this.backupKeys = Object.values(StoreKeys);
    Constants.KeysIgnoredForBackup.map(key => {
      this.backupKeys.splice(this.backupKeys.indexOf(key), 1);
    });
    this.responseData = {};
    this.backupDataToFirebase.bind(this);
    this.backupData.bind(this);
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
        this.backupData({
          password: 'password',
          onBackupSuccess,
          isPasswordProtected: false,
        });
      },
    });
  }
  async backupData({password, onBackupSuccess, isPasswordProtected}) {
    return new Promise((resolve, reject) => {
      AsyncStorage.multiGet(this.backupKeys).then(storeData => {
        let canaryId = Cache.getValue(CacheKey.DeviceCanaryId) || '';
        if (canaryId.length === 0) {
          const uid = new ShortUniqueId({length: 8});
          canaryId = `canary_${uid()}`;
          AsyncStorage.set(StoreKeys.DeviceCanaryId, canaryId);
          Cache.setValue(CacheKey.DeviceCanaryId, canaryId);
        }
        this.encrypt(storeData, password)
          .then(encryptedData => {
            const reference = firebase
              .app()
              .database(Constants.FirebaseDatabaseUrl)
              .ref(`${Constants.FirebaseDatabasePath}${canaryId}`);
            reference
              .set({
                id: canaryId,
                data: encryptedData,
                timeStamp: moment.now(),
                isPasswordProtected,
              })
              .then(() => {
                Toast.show({
                  type: ToastType.Success,
                  text1: 'Data Backed Up Successfully',
                });
                delete this.responseData?.[canaryId];
                if (isPasswordProtected) {
                  AsyncStorage.set(StoreKeys.BackupPassword, password);
                  Cache.setValue(CacheKey.BackupPassword, password);
                }
                onBackupSuccess?.();
                return resolve();
              })
              .catch(() => {
                Toast.show({
                  type: ToastType.Error,
                  text1: 'Data Backup Failed. Please Try Again',
                });
                return reject();
              });
          })
          .catch(() => {
            Toast.show({
              type: ToastType.Error,
              text1: 'Data Backup Failed. Please Try Again',
            });
            return reject();
          });
      });
    });
  }
  clearData() {
    LocalEvent.emit(EventTypes.ShowCommonConfirmationModal, {
      headerText: 'Are you sure you want to clear your data',
      primaryText:
        'All your preferances, lists & archives will be cleared. \nThis will also restart the app.',
      testID: 'clear',
      onSureButtonPress: () => {
        LocalEvent.emit(EventTypes.CommonLoader.Show);
        AsyncStorage.multiRemove(this.backupKeys)
          .then(() => {
            AsyncStorage.remove(StoreKeys.BackupPassword);
            AsyncStorage.set(StoreKeys.IsAppReloaded, true).then(() => {
              Toast.show({
                type: ToastType.Success,
                text1: 'Data Cleared Successfully',
              });

              setTimeout(() => {
                LocalEvent.emit(EventTypes.CommonLoader.Hide);
                RNRestart.Restart();
              }, 5000);
            });
          })
          .catch(() => {
            LocalEvent.emit(EventTypes.CommonLoader.Hide);
          });
      },
    });
  }

  async clearDataFromFirebase() {
    AsyncStorage.get(StoreKeys.DeviceCanaryId).then(canaryId => {
      const reference = firebase
        .app()
        .database(Constants.FirebaseDatabaseUrl)
        .ref(`${Constants.FirebaseDatabasePath}${canaryId}`);
      reference.remove();
      delete this.responseData?.canaryId;
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
  async isDataPasswordProtected(canaryId) {
    return new Promise((resolve, reject) => {
      this.getResponseDataFromFirebase(canaryId)
        .then(() => {
          return resolve(this.responseData?.[canaryId]?.isPasswordProtected);
        })
        .catch(() => {
          return reject();
        });
    });
  }

  async restoreDataFromFirebase({canaryId, onRestoreSuccess}) {
    return new Promise((resolve, reject) => {
      this.getLastBackupTimeStamp(canaryId)
        .then(backupTimeStamp => {
          LocalEvent.emit(EventTypes.ShowCommonConfirmationModal, {
            headerText: 'Are you Sure you want to Restore your data? ',
            primaryText: ` Restore Data from: ${backupTimeStamp} \n This also will restart the application`,
            testID: 'restore',
            onSureButtonPress: () => {
              this.restoreData({
                canaryId,
                password: 'password',
                onRestoreSuccess,
              })
                .then(() => {
                  return resolve();
                })
                .catch(() => {
                  return reject();
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

  async restoreData({canaryId, password, onRestoreSuccess}) {
    return new Promise((resolve, reject) => {
      LocalEvent.emit(EventTypes.CommonLoader.Show);
      this.getResponseDataFromFirebase(canaryId)
        .then(() => {
          this.decrypt(this.responseData?.[canaryId]?.data, password)
            .then(data => {
              AsyncStorage.multiSet(JSON.parse(data)).then(isDataSet => {
                if (isDataSet) {
                  AsyncStorage.set(StoreKeys.IsAppReloaded, true).then(() => {
                    onRestoreSuccess?.();
                    Toast.show({
                      type: ToastType.Success,
                      text1: 'Data Restored Successfully',
                    });
                    setTimeout(() => {
                      LocalEvent.emit(EventTypes.CommonLoader.Hide);
                      RNRestart.Restart();
                    }, 5000);
                    return resolve();
                  });
                } else {
                  Toast.show({
                    type: ToastType.Error,
                    text1: 'Data Restore Failed. Please Try Again',
                  });
                  LocalEvent.emit(EventTypes.CommonLoader.Hide);
                  return reject();
                }
              });
            })
            .catch(() => {
              LocalEvent.emit(EventTypes.CommonLoader.Hide);
              return reject();
            });
        })
        .catch(() => {
          LocalEvent.emit(EventTypes.CommonLoader.Hide);
          return reject();
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
