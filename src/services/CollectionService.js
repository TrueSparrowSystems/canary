import {StoreKeys} from './AsyncStorage/StoreConstants';
import Store from './AsyncStorage';
import uuid from 'react-native-uuid';
import Cache from './Cache';
import {CacheKey} from './Cache/CacheStoreConstants';
import {getRandomColorCombination} from '../utils/RandomColorUtil';
import {find} from 'lodash';
import {isEmpty} from 'lodash-es';
import {compareFunction} from '../utils/Strings';

const COLLECTION_TWEET_LIMIT = 25;

class CollectionService {
  constructor() {
    this.collections = {};
  }

  async removeAllCollections() {
    await Store.removeItem(StoreKeys.CollectionsList);
  }

  async addCollection(collectionName) {
    return new Promise((resolve, reject) => {
      if (isEmpty(collectionName.trim())) {
        return reject('Please enter a valid name');
      }
      Store.get(StoreKeys.CollectionsList).then(list => {
        const colorCombination = getRandomColorCombination();
        if (isEmpty(JSON.parse(list))) {
          const id = uuid.v4();
          var collectionObj = {};
          collectionObj[id] = {
            id: id,
            name: collectionName,
            tweetIds: [],
            colorScheme: colorCombination,
          };

          this.collections = collectionObj;
          Store.set(StoreKeys.CollectionsList, collectionObj)
            .then(() => {
              return resolve({collectionId: id});
            })
            .catch(() => {
              return reject('Could not add archive. Please try again');
            });
        } else {
          var _list = JSON.parse(list);
          const newId = uuid.v4();

          if (find(_list, {name: collectionName.trim()})) {
            return reject('Archive name already exists.');
          }

          const newCollection = {};
          newCollection[newId] = {
            id: newId,
            name: collectionName,
            tweetIds: [],
            colorScheme: colorCombination,
          };

          _list = {..._list, ...newCollection};
          this.collections = _list;
          Store.set(StoreKeys.CollectionsList, _list)
            .then(() => {
              return resolve({collectionId: newId});
            })
            .catch(() => {
              return reject('Could not add archive. Please try again');
            });
        }
      });
    });
  }

  async getCollectionDetails(collectionId) {
    return new Promise((resolve, reject) => {
      if (this.collections && Object.keys(this.collections).length === 0) {
        this.getAllCollections()
          .then(list => {
            return resolve(list[collectionId]);
          })
          .catch(() => {
            return reject();
          });
      } else {
        return resolve(this.collections[collectionId]);
      }
    });
  }

  async getAllCollections() {
    return new Promise((resolve, reject) => {
      Store.get(StoreKeys.CollectionsList)
        .then(list => {
          var jsonList = {};
          if (list !== null) {
            jsonList = JSON.parse(list);
          }
          const listArray = Object.entries(jsonList);
          listArray.sort((collection1, collection2) => {
            return compareFunction(collection1[1].name, collection2[1].name);
          });

          this.collections = Object.fromEntries(listArray);
          return resolve(this.collections);
        })
        .catch(() => {
          return reject();
        });
    });
  }

  async updateBookmarkedTweetsInCacheAndStore(bookmarkedTweets) {
    return new Promise((resolve, reject) => {
      Cache.setValue(CacheKey.BookmarkedTweetsList, bookmarkedTweets);
      Store.set(StoreKeys.BookmarkedTweetsList, bookmarkedTweets)
        .then(() => {
          return resolve();
        })
        .catch(() => {
          return reject();
        });
    });
  }

  async _addTweet(collectionId, tweetId) {
    return new Promise((resolve, reject) => {
      if (
        this.collections?.[collectionId]?.tweetIds.length >
        COLLECTION_TWEET_LIMIT
      ) {
        return reject(
          'This archive is full. Try adding it to a different archive or create a new one.',
        );
      }
      var bookmarkedTweets =
        Cache.getValue(CacheKey.BookmarkedTweetsList) || {};
      var newArray = [];
      if (bookmarkedTweets[tweetId]) {
        // Add same tweet to multiple collections case
        newArray = bookmarkedTweets[tweetId];
      }
      // TODO : check for existing collection id
      newArray.push(collectionId);
      bookmarkedTweets[tweetId] = newArray;

      this.collections?.[collectionId]?.tweetIds?.push?.(tweetId);

      Store.set(StoreKeys.CollectionsList, this.collections)
        .then(() => {
          this.updateBookmarkedTweetsInCacheAndStore(bookmarkedTweets)
            .then(() => {
              return resolve();
            })
            .catch(() => {
              return reject();
            });
        })
        .catch(() => {
          return reject();
        });
    });
  }

  async addTweetToCollection(collectionId, tweetId) {
    return new Promise((resolve, reject) => {
      if (this.collections && Object.keys(this.collections).length === 0) {
        // If local copy is not populated, populate and then add tweet
        this.getAllCollections()
          .then(() => {
            this._addTweet(collectionId, tweetId)
              .then(() => {
                return resolve();
              })
              .catch(error => {
                return reject(error);
              });
          })
          .catch(() => {
            return reject();
          });
      } else {
        // If local copy is populated, add tweet
        this._addTweet(collectionId, tweetId)
          .then(() => {
            return resolve();
          })
          .catch(error => {
            return reject(error);
          });
      }
    });
  }

  async removeCollection(collectionId) {
    return new Promise((resolve, reject) => {
      const tweetIdsOfThisCollection = this.collections[collectionId].tweetIds;
      const bookmarkedIds = Cache.getValue(CacheKey.BookmarkedTweetsList) || {};
      delete this.collections[collectionId];
      Store.set(StoreKeys.CollectionsList, this.collections)
        .then(() => {
          tweetIdsOfThisCollection.forEach(tweetId => {
            delete bookmarkedIds[tweetId];
          });
          this.updateBookmarkedTweetsInCacheAndStore(bookmarkedIds)
            .then(() => {
              return resolve();
            })
            .catch(() => {});
          return resolve();
        })
        .catch(() => {
          return reject();
        });
    });
  }

  async removeTweetFromCollection(collectionId, tweetId) {
    return new Promise((resolve, reject) => {
      const bookmarkedIds = Cache.getValue(CacheKey.BookmarkedTweetsList) || {};
      const collectionIds = bookmarkedIds[tweetId];
      collectionIds.splice(collectionIds.indexOf(collectionId), 1);
      if (collectionIds.length === 0) {
        delete bookmarkedIds[tweetId];
      } else {
        bookmarkedIds[tweetId] = collectionIds;
      }
      const tweetIds = this.collections[collectionId]?.tweetIds;
      const index = tweetIds.indexOf(tweetId);
      if (index > -1) {
        tweetIds.splice(index, 1);
      }
      this.collections[collectionId].tweetIds = tweetIds;
      Store.set(StoreKeys.CollectionsList, this.collections)
        .then(() => {
          this.updateBookmarkedTweetsInCacheAndStore(bookmarkedIds)
            .then(() => {
              return resolve();
            })
            .catch(() => {
              return reject();
            });
          return resolve();
        })
        .catch(() => {
          return reject('Unable to remove tweet from archive');
        });
    });
  }

  isTweetRemoveFromAllCollections(tweetId) {
    const bookmarkedTweets = Cache.getValue(CacheKey.BookmarkedTweetsList);
    console.log({bookmarkedTweets}, bookmarkedTweets?.hasOwnProperty(tweetId));
    if (bookmarkedTweets) {
      const isPresent = bookmarkedTweets?.hasOwnProperty(tweetId);
      return !isPresent;
    }
    return true;
  }
}

let _collectionService = null;
const collectionService = () => {
  if (!_collectionService) {
    _collectionService = new CollectionService();
  }
  return _collectionService;
};

export {collectionService};
