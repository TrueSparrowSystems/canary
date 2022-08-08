import {StoreKeys} from './AsyncStorage/StoreConstants';
import Store from './AsyncStorage';
import uuid from 'react-native-uuid';
import {getRandomColorCombination} from '../utils/RandomColorUtil';
import Cache from './Cache';
import {CacheKey} from './Cache/CacheStoreConstants';
import {find} from 'lodash';

const LIST_LIMIT = 30;

class ListService {
  constructor() {
    this.lists = null;
  }

  async removeAllLists() {
    await Store.removeItem(StoreKeys.Lists);
  }

  async addList(listName) {
    return new Promise((resolve, reject) => {
      const colorCombination = getRandomColorCombination();
      Store.get(StoreKeys.Lists).then(list => {
        if (list == null) {
          const id = uuid.v4();
          var listObj = {};
          listObj[id] = {
            id: id,
            name: listName,
            userNames: [],
            colorCombination,
          };

          this.lists = listObj;
          Store.set(StoreKeys.Lists, listObj)
            .then(() => {
              return resolve({listId: id});
            })
            .catch(() => {
              return reject('Could not add list. Please try again');
            });
        } else {
          var _list = JSON.parse(list);
          const listLength = Object.keys(_list).length;
          if (listLength > LIST_LIMIT) {
            return reject('List Limit exceeded');
          }

          if (find(_list, {name: listName})) {
            return reject('List name already exists.');
          }

          const newId = uuid.v4();

          const newList = {};
          newList[newId] = {
            id: newId,
            name: listName,
            userNames: [],
            colorCombination,
          };

          _list = {..._list, ...newList};
          this.lists = _list;
          Store.set(StoreKeys.Lists, _list)
            .then(() => {
              return resolve({listId: newId});
            })
            .catch(() => {
              return reject('Could not add list. Please try again');
            });
        }
      });
    });
  }

  async getListDetails(listId) {
    return new Promise((resolve, reject) => {
      if (this.lists && Object.keys(this.lists).length === 0) {
        this.getAllLists()
          .then(list => {
            return resolve(list[listId]);
          })
          .catch(() => {
            return reject();
          });
      } else {
        return resolve(this.lists[listId]);
      }
    });
  }

  async getAllLists() {
    return new Promise((resolve, reject) => {
      Store.get(StoreKeys.Lists)
        .then(list => {
          var jsonList = JSON.parse(list);
          this.lists = jsonList;
          return resolve(list);
        })
        .catch(() => {
          return reject();
        });
    });
  }

  async _addUser(listId, userName) {
    return new Promise((resolve, reject) => {
      this.lists[listId].userNames.push(userName);
      Store.set(StoreKeys.Lists, this.lists)
        .then(() => {
          const userToListMap = Cache.getValue(CacheKey.UserToListMap) || {};
          if (userToListMap.hasOwnProperty(userName)) {
            const listIdArray = userToListMap?.[userName];
            listIdArray.push(listId);
            userToListMap[userName] = listIdArray;
          } else {
            userToListMap[userName] = [listId];
          }
          Cache.setValue(CacheKey.UserToListMap, userToListMap);
          Store.set(StoreKeys.UserToListMap, userToListMap).then(() => {
            return resolve();
          });
        })
        .catch(() => {
          return reject();
        });
    });
  }

  async addUserToList(listId, userName) {
    return new Promise((resolve, reject) => {
      if (this.lists && Object.keys(this.lists).length === 0) {
        // If local copy is not populated, populate and then add user
        this.getAllLists()
          .then(() => {
            this._addUser(listId, userName)
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
      } else {
        // If local copy is populated, add user
        this._addUser(listId, userName)
          .then(() => {
            return resolve();
          })
          .catch(() => {
            return reject();
          });
      }
    });
  }

  async removeList(listId) {
    return new Promise((resolve, reject) => {
      delete this.lists[listId];
      Store.set(StoreKeys.Lists, this.lists)
        .then(() => {
          return resolve();
        })
        .catch(() => {
          return reject();
        });
    });
  }

  async removeUserFromList(listId, userName) {
    return new Promise((resolve, reject) => {
      const userNames = this.lists[listId]?.userNames;
      const index = userNames.indexOf(userName);
      if (index > -1) {
        userNames.splice(index, 1);
      }
      this.lists[listId].userNames = userNames;
      Store.set(StoreKeys.Lists, this.lists)
        .then(() => {
          const userToListMap = Cache.getValue(CacheKey.UserToListMap);
          const listIdArray = userToListMap?.[userName];
          listIdArray.splice(listIdArray.indexOf(listId), 1);
          userToListMap[userName] = listIdArray;
          Cache.setValue(CacheKey.UserToListMap, userToListMap);
          Store.set(StoreKeys.UserToListMap, userToListMap).then(() => {
            return resolve();
          });
        })
        .catch(() => {
          return reject('Unable to remove user from list');
        });
    });
  }
}

let _listService = null;
const listService = () => {
  if (!_listService) {
    _listService = new ListService();
  }
  return _listService;
};

export {listService};
