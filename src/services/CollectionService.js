import {StoreKeys} from './AsyncStorage/StoreConstants';
import Store from './AsyncStorage';
import uuid from 'react-native-uuid';

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
          const listLength = Object.keys(_list).length;
          if (listLength > COLLECTION_LIMIT) {
            return reject('Collection Limit exceeded');
          }

          const newId = uuid.v4();

          const newCollection = {};
          newCollection[newId] = {
            id: newId,
            name: collectionName,
            tweetIds: [],
          };

          _list = {..._list, ...newCollection};
          console.log('.......', _list);
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

  async removeCollection(collectionId) {
    return new Promise((resolve, reject) => {
      delete this.collections[collectionId];
      Store.set(StoreKeys.CollectionsList, this.collections)
        .then(() => {
          return resolve();
        })
        .catch(() => {
          return reject();
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
