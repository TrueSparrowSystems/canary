import {setCountriesWoeidsInCache} from '../utils/CountryWoeidUtils';
import AsyncStorage from './AsyncStorage';
import {StoreKeys} from './AsyncStorage/StoreConstants';
import Cache from './Cache';
import {CacheKey} from './Cache/CacheStoreConstants';
import {networkConnection} from './NetworkConnection';

class BootService {
  initialize() {
    return new Promise(resolve => {
      networkConnection();
      AsyncStorage.getItem(StoreKeys.AreInitialPreferencesSet).then(isSet => {
        Cache.setValue(CacheKey.AreInitialPreferencesSet, isSet);
        if (isSet) {
          setCountriesWoeidsInCache();
          AsyncStorage.getItem(StoreKeys.PreferenceList).then(list => {
            AsyncStorage.get(StoreKeys.BookmarkedTweetsList).then(
              bookmarkedTweetList => {
                Cache.setValue(
                  CacheKey.BookmarkedTweetsList,
                  JSON.parse(bookmarkedTweetList),
                );
              },
            );
            Cache.setValue(CacheKey.PreferenceList, list);
            return resolve();
          });
        } else {
          return resolve();
        }
      });
    });
  }
}

export default new BootService();
