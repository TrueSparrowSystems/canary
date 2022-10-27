import {firebase} from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
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
import {getExportURL, resolveAndGetImportData} from './ShareHelper';

class BackupRestoreHelper {
  constructor() {
    this.responseData = {};
    this.backupDataToFirebase.bind(this);
    this.clearData.bind(this);
    this.clearDataFromFirebase.bind(this);
    this.getResponseDataFromFirebase.bind(this);
    this.getLastBackupTimeStamp.bind(this);
    this.getBackupUrl.bind(this);
    this.generateKeyFromPassword.bind(this);
    this.encrypt.bind(this);
    this.decrypt.bind(this);
  }

  backupDataToFirebase({onBackupSuccess}) {
    LocalEvent.emit(EventTypes.CommonLoader.Show);
    AsyncStorage.multiGet(Constants.KeysForBackup)
      .then(storeData => {
        let canaryId = Cache.getValue(CacheKey.DeviceCanaryId) || '';
        if (canaryId.length === 0) {
          const uid = new ShortUniqueId({length: 8});
          canaryId = `canary_${uid()}`;
          AsyncStorage.set(StoreKeys.DeviceCanaryId, canaryId);
          Cache.setValue(CacheKey.DeviceCanaryId, canaryId);
          this.getBackupUrl().then(url => {
            AsyncStorage.set(StoreKeys.DeviceBackupUrl, url);
            Cache.setValue(CacheKey.DeviceBackupUrl, url);
          });
        }
        this.encrypt(storeData, 'canary')
          .then(encryptedData => {
            const isFirebaseAuthenticated = Cache.getValue(
              CacheKey.FirebaseAutheticatedSuccessfully,
            );
            if (isFirebaseAuthenticated) {
              this.setDataToFirebase(canaryId, encryptedData, onBackupSuccess);
            } else {
              auth()
                .signInAnonymously()
                .then(() => {
                  Cache.setValue(
                    CacheKey.FirebaseAutheticatedSuccessfully,
                    true,
                  );
                  this.setDataToFirebase(
                    canaryId,
                    encryptedData,
                    onBackupSuccess,
                  );
                })
                .catch(() => {
                  LocalEvent.emit(EventTypes.CommonLoader.Hide);
                  Toast.show({
                    type: ToastType.Error,
                    text1: 'Data Backup Failed. Please Try Again',
                  });
                  Cache.setValue(
                    CacheKey.FirebaseAutheticatedSuccessfully,
                    false,
                  );
                });
            }
          })
          .catch(() => {
            LocalEvent.emit(EventTypes.CommonLoader.Hide);
            Toast.show({
              type: ToastType.Error,
              text1: 'Data Backup Failed. Please Try Again',
            });
          });
      })
      .catch(() => {
        LocalEvent.emit(EventTypes.CommonLoader.Hide);
        Toast.show({
          type: ToastType.Error,
          text1: 'Data Backup Failed. Please Try Again',
        });
      });
  }

  setDataToFirebase(canaryId, encryptedData, onBackupSuccess) {
    const reference = firebase
      .app()
      .database(Constants.FirebaseDatabaseUrl)
      .ref(`${Constants.FirebaseDatabasePath}${canaryId}`);
    reference
      .set({
        id: canaryId,
        data: encryptedData,
        timeStamp: moment.now(),
      })
      .then(() => {
        Toast.show({
          type: ToastType.Success,
          text1: 'Data Backed Up Successfully',
        });
        this.responseData = {};

        LocalEvent.emit(EventTypes.CommonLoader.Hide);
        onBackupSuccess?.();
      })
      .catch(() => {
        LocalEvent.emit(EventTypes.CommonLoader.Hide);
        Toast.show({
          type: ToastType.Error,
          text1: 'Data Backup Failed. Please Try Again',
        });
      });
  }

  clearData() {
    LocalEvent.emit(EventTypes.ShowCommonConfirmationModal, {
      headerText: 'Are you sure you want to clear your data',
      primaryText:
        'All your preferences, lists & archives will be cleared. \nThis will also restart the app.',
      testID: 'clear',
      onSureButtonPress: () => {
        LocalEvent.emit(EventTypes.CommonLoader.Show);
        AsyncStorage.multiRemove(Constants.KeysForClear)
          .then(() => {
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
      const reference = firebase
        .app()
        .database(Constants.FirebaseDatabaseUrl)
        .ref(`${Constants.FirebaseDatabasePath}${canaryId}`);
      reference.once(
        'value',
        databaseData => {
          if (JSON.stringify(databaseData) !== 'null') {
            const parsedDatabaseData = JSON.parse(JSON.stringify(databaseData));
            this.responseData[canaryId] = parsedDatabaseData;
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

  async getBackupUrl() {
    return new Promise(resolve => {
      let canaryId = Cache.getValue(CacheKey.DeviceCanaryId);
      if (canaryId) {
        const exportData = {
          pn: Constants.PageName.Restore,
          data: {canary_id: canaryId},
        };
        getExportURL(exportData)
          .then(backupUrl => {
            return resolve(backupUrl);
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
      resolveAndGetImportData(backupUrl)
        .then(importData => {
          let canaryId = importData?.data?.canary_id || '';
          const isFirebaseAuthenticated = Cache.getValue(
            CacheKey.FirebaseAutheticatedSuccessfully,
          );
          if (isFirebaseAuthenticated) {
            return this.restoreDataFromFirebase(canaryId, onRestoreSuccess);
          } else {
            auth()
              .signInAnonymously()
              .then(() => {
                Cache.setValue(CacheKey.FirebaseAutheticatedSuccessfully, true);
                return this.restoreDataFromFirebase(canaryId, onRestoreSuccess);
              })
              .catch(() => {
                LocalEvent.emit(EventTypes.CommonLoader.Hide);
                Toast.show({
                  type: ToastType.Error,
                  text1: 'Data Restore Failed. Please Try Again',
                });
                Cache.setValue(
                  CacheKey.FirebaseAutheticatedSuccessfully,
                  false,
                );
                return reject();
              });
          }
        })
        .catch(() => {
          LocalEvent.emit(EventTypes.CommonLoader.Hide);
          Toast.show({
            type: ToastType.Error,
            text1: 'Data Restore Failed. Please Try Again',
          });
          return reject();
        });
    });
  }

  async restoreDataFromFirebase(canaryId, onRestoreSuccess) {
    return new Promise((resolve, reject) => {
      this.getResponseDataFromFirebase(canaryId)
        .then(() => {
          this.decrypt(this.responseData?.[canaryId]?.data, 'canary')
            .then(data => {
              AsyncStorage.multiSet(JSON.parse(data)).then(isDataSet => {
                if (isDataSet) {
                  AsyncStorage.set(StoreKeys.IsAppReloaded, true).then(() => {
                    onRestoreSuccess?.();
                    Toast.show({
                      type: ToastType.Success,
                      text1: 'Data Restored Successfully',
                    });
                    LocalEvent.emit(EventTypes.CommonLoader.Hide);
                    RNRestart.Restart();
                    return resolve();
                  });
                } else {
                  LocalEvent.emit(EventTypes.CommonLoader.Hide);
                  Toast.show({
                    type: ToastType.Error,
                    text1: 'Data Restore Failed. Please Try Again',
                  });
                  return reject();
                }
              });
            })
            .catch(() => {
              Toast.show({
                type: ToastType.Error,
                text1: 'Data Restore Failed. Please Try Again',
              });
              LocalEvent.emit(EventTypes.CommonLoader.Hide);
              return reject();
            });
        })
        .catch(() => {
          Toast.show({
            type: ToastType.Error,
            text1: 'Data Restore Failed. Please Try Again',
          });
          LocalEvent.emit(EventTypes.CommonLoader.Hide);
          return reject();
        });
    });
  }

  async generateKeyFromPassword(password) {
    return new Promise((resolve, reject) => {
      generateKey(
        password,
        Constants.Encryption.salt,
        Constants.Encryption.cost,
        Constants.Encryption.length,
      )
        .then(key => {
          return resolve(key);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }

  async encrypt(data, password) {
    return new Promise((resolve, reject) => {
      this.generateKeyFromPassword(password)
        .then(key => {
          encryptData(JSON.stringify(data), key)
            .then(encryptedData => {
              return resolve(encryptedData);
            })
            .catch(err => {
              return reject(err);
            });
        })
        .catch(err => {
          return reject(err);
        });
    });
  }

  async decrypt(encryptedData, password) {
    return new Promise((resolve, reject) => {
      this.generateKeyFromPassword(password)
        .then(key => {
          decryptData(encryptedData, key)
            .then(text => {
              return resolve(text);
            })
            .catch(err => {
              return reject(err);
            });
        })
        .catch(err => {
          return reject(err);
        });
    });
  }
}
export default new BackupRestoreHelper();
