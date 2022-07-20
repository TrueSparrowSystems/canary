import {StoreKeys} from './AsyncStorage/StoreConstants';
import Store from './AsyncStorage';

const COLLECTION_LIMIT = 30;

class CollectionService {
  constructor() {}

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

  async addTweetToCollection() {
    // TODO: implementation pending
  }

  async getAllCollections() {
    return new Promise((resolve, reject) => {
      Store.get(StoreKeys.CollectionsList)
        .then(list => {
          return resolve(list);
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
