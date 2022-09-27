import {setCountriesWoeidsInCache} from '../utils/CountryWoeidUtils';
import AsyncStorage from './AsyncStorage';
import {StoreKeys} from './AsyncStorage/StoreConstants';
import Cache from './Cache';
import {CacheKey} from './Cache/CacheStoreConstants';
import {collectionService} from './CollectionService';
import {listService} from './ListService';
import {networkConnection} from './NetworkConnection';

class BootService {
  initialize() {
    return new Promise(resolve => {
      networkConnection();

      AsyncStorage.getItem(StoreKeys.AreInitialPreferencesSet).then(isSet => {
        setCountriesWoeidsInCache();
        Cache.setValue(CacheKey.AreInitialPreferencesSet, isSet);
        AsyncStorage.get(StoreKeys.ShowPromotionOnArchives).then(res => {
          let newValue = 0;
          if (!res && JSON.parse(res) !== 0) {
            Cache.setValue(CacheKey.ShowPromotionOnArchives, 0);
          } else {
            newValue = JSON.parse(res) + 1;
            Cache.setValue(CacheKey.ShowPromotionOnArchives, newValue);
          }
        });
        AsyncStorage.get(StoreKeys.DeviceCanaryId).then(res => {
          Cache.setValue(CacheKey.DeviceCanaryId, res);
        });
        AsyncStorage.get(StoreKeys.DeviceBackupUrl).then(res => {
          Cache.setValue(CacheKey.DeviceBackupUrl, res);
        });
        AsyncStorage.get(StoreKeys.ShowPromotionOnLists).then(res => {
          let newValue = 0;
          if (!res && JSON.parse(res) !== 0) {
            Cache.setValue(CacheKey.ShowPromotionOnLists, 0);
          } else {
            newValue = JSON.parse(res) + 1;
            Cache.setValue(CacheKey.ShowPromotionOnLists, newValue);
          }
        });
        if (isSet) {
          AsyncStorage.getItem(StoreKeys.PreferenceList).then(list => {
            Cache.setValue(CacheKey.PreferenceList, list);
            AsyncStorage.get(StoreKeys.BookmarkedTweetsList).then(
              bookmarkedTweetList => {
                Cache.setValue(
                  CacheKey.BookmarkedTweetsList,
                  JSON.parse(bookmarkedTweetList),
                );
              },
            );
            AsyncStorage.get(StoreKeys.UserToListMap).then(userToListMap => {
              Cache.setValue(CacheKey.UserToListMap, JSON.parse(userToListMap));
            });
            AsyncStorage.get(StoreKeys.IsRedirectModalHidden).then(value => {
              Cache.setValue(CacheKey.IsRedirectModalHidden, JSON.parse(value));
            });
            AsyncStorage.get(StoreKeys.ShouldShowTimelineFromVerifiedUsersOnly)
              .then(pref => {
                Cache.setValue(
                  CacheKey.ShouldShowTimelineFromVerifiedUsersOnly,
                  !!JSON.parse(pref),
                );
              })
              .finally(() => {
                listService().getAllLists();
                collectionService().getAllCollections();
                return resolve();
              });
          });
        } else {
          return resolve();
        }
      });
    });
  }
}

export default new BootService();
