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
            AsyncStorage.get(StoreKeys.ShowPromotionOnArchives).then(res => {
              if (!res) {
                Cache.setValue(CacheKey.ShowPromotionOnArchives, true);
              } else {
                Cache.setValue(
                  CacheKey.ShowPromotionOnArchives,
                  JSON.parse(res),
                );
              }
            });
            AsyncStorage.get(StoreKeys.ShowPromotionOnLists).then(res => {
              if (!res) {
                Cache.setValue(CacheKey.ShowPromotionOnLists, true);
              } else {
                Cache.setValue(CacheKey.ShowPromotionOnLists, JSON.parse(res));
              }
            });
            AsyncStorage.get(StoreKeys.UserToListMap).then(userToListMap => {
              Cache.setValue(CacheKey.UserToListMap, JSON.parse(userToListMap));
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
