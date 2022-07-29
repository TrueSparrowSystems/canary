import {StoreKeys} from './AsyncStorage/StoreConstants';
import Store from './AsyncStorage';
import uuid from 'react-native-uuid';
import Cache from './Cache';
import {CacheKey} from './Cache/CacheStoreConstants';

const COLLECTION_TWEET_LIMIT = 25;

class CollectionService {
  constructor() {
    this.collections = null;
  }

  async removeAllCollections() {
    await Store.removeItem(StoreKeys.CollectionsList);
  }

  async addCollection(collectionName) {
    return new Promise((resolve, reject) => {
      Store.get(StoreKeys.CollectionsList).then(list => {
        if (list == null) {
          const id = uuid.v4();
          var collectionObj = {};
          collectionObj[id] = {
            id: id,
            name: collectionName,
            tweetIds: [],
          };

          this.collections = collectionObj;
          Store.set(StoreKeys.CollectionsList, collectionObj)
            .then(() => {
              return resolve({collectionId: 1});
            })
            .catch(() => {
              return reject('Could not add collection. Please try again');
            });
        } else {
          var _list = JSON.parse(list);
          const newId = uuid.v4();

          const newCollection = {};
          newCollection[newId] = {
            id: newId,
            name: collectionName,
            tweetIds: [],
          };

          _list = {..._list, ...newCollection};
          this.collections = _list;
          Store.set(StoreKeys.CollectionsList, _list)
            .then(() => {
              return resolve({collectionId: newId});
            })
            .catch(() => {
              return reject('Could not add collection. Please try again');
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
          var jsonList = JSON.parse(list);
          this.collections = jsonList;
          return resolve(list);
        })
        .catch(() => {
          return reject();
        });
    });
  }

  async _addTweet(collectionId, tweetId) {
    return new Promise((resolve, reject) => {
      if (
        this.collections[collectionId].tweetIds.length > COLLECTION_TWEET_LIMIT
      ) {
        return reject(
          'This collection is full. Try adding it to a different collection or create a new one.',
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
      this.collections[collectionId].tweetIds.push(tweetId);

      Store.set(StoreKeys.CollectionsList, this.collections)
        .then(() => {
          Cache.setValue(CacheKey.BookmarkedTweetsList, bookmarkedTweets);
          Store.set(StoreKeys.BookmarkedTweetsList, bookmarkedTweets)
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
      const bookmarkedIds = Cache.getValue(CacheKey.BookmarkedTweetsList) || [];
      delete this.collections[collectionId];
      Store.set(StoreKeys.CollectionsList, this.collections)
        .then(() => {
          tweetIdsOfThisCollection.forEach(tweetId => {
            delete bookmarkedIds[tweetId];
          });
          Cache.setValue(CacheKey.BookmarkedTweetsList, bookmarkedIds);
          Store.set(StoreKeys.BookmarkedTweetsList, bookmarkedIds)
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

  async removeTweetFromCollection(tweetId) {
    return new Promise((resolve, reject) => {
      const bookmarkedIds = Cache.getValue(CacheKey.BookmarkedTweetsList) || [];
      const collectionIds = bookmarkedIds[tweetId];
      collectionIds.forEach(collectionId => {
        const tweetIds = this.collections[collectionId]?.tweetIds;
        const index = tweetIds.indexOf(tweetId);
        if (index > -1) {
          tweetIds.splice(index, 1);
        }
        this.collections[collectionId].tweetIds = tweetIds;
      });
      Store.set(StoreKeys.CollectionsList, this.collections)
        .then(() => {
          delete bookmarkedIds[tweetId];
          Cache.setValue(CacheKey.BookmarkedTweetsList, bookmarkedIds);
          Store.set(StoreKeys.BookmarkedTweetsList, bookmarkedIds)
            .then(() => {
              return resolve();
            })
            .catch(() => {
              return reject();
            });
          return resolve();
        })
        .catch(() => {
          return reject('Unable to remove tweet from collection');
        });
    });
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
