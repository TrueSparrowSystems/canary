import {StoreKeys} from './AsyncStorage/StoreConstants';
import Store from './AsyncStorage';

const COLLECTION_LIMIT = 30;

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
          const collectionObj = {
            1: {
              id: 1,
              name: collectionName,
              tweetIds: [],
            },
          };
          this.collections = collectionObj;
          Store.set(StoreKeys.CollectionsList, collectionObj)
            .then(() => {
              return resolve();
            })
            .catch(() => {
              return reject('Could not add collection. Please try again');
            });
        } else {
          var _list = JSON.parse(list);
          const listLength = Object.keys(_list).length;
          if (listLength > COLLECTION_LIMIT) {
            return reject('Collection Limit exceeded');
          }

          const newId = listLength + 1;
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
              return resolve();
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
      this.collections[collectionId].tweetIds.push(tweetId);
      Store.set(StoreKeys.CollectionsList, this.collections)
        .then(() => {
          return resolve();
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
            this._addTweet(collectionId, tweetId).catch(() => {
              return reject();
            });
          })
          .catch(() => {
            return reject();
          });
      } else {
        // If local copy is populated, add tweet
        this._addTweet(collectionId, tweetId).catch(() => {
          return reject();
        });
      }
      return resolve();
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
