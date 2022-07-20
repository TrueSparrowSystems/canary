import AsyncStorage from '@react-native-async-storage/async-storage';

class AsyncStore {
  async getAllKeys() {
    let keys = [];
    try {
      keys = await AsyncStorage.getAllKeys();
    } catch (error) {
      //logger.error('Exception in Store.getAllKeys: ', error);
    }
    return keys;
  }

  async clear() {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      //logger.error('Exception in Store.clear: ', error);
    }
  }

  async get(key) {
    if (!key || typeof key !== 'string') {
      return null;
    }
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      //logger.error('Exception in Store.get: ', error);
      return null;
    }
  }

  async set(key, value) {
    try {
      if (!key || typeof key !== 'string') {
        return false;
      }
      const stringifiedPayload = this._getStringValue(value);
      if (!stringifiedPayload) {
        return false;
      }
      await AsyncStorage.setItem(key, stringifiedPayload);
      return true;
    } catch (error) {
      //logger.error('Exception in Store.set: ', error);
      return false;
    }
  }

  async remove(key) {
    if (!key || typeof key !== 'string') {
      return false;
    }
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      //logger.error('Exception in Store.remove: ', error);
      return false;
    }
  }

  async setItem(key, value) {
    return await this.set(key, value);
  }

  async getItem(key) {
    const value = await this.get(key);
    if (value) {
      return this._convertToObject(value);
    }
    return null;
  }

  async removeItem(key) {
    return await this.remove(key);
  }

  async multiSet(items) {
    try {
      await AsyncStorage.multiSet(items);
      return true;
    } catch (error) {
      //logger.error('Exception in Store.multiSet: ', error);
      return false;
    }
  }

  async multiGet(keys) {
    let values = [];
    try {
      values = await AsyncStorage.multiGet(keys);
    } catch (error) {
      //logger.error('Exception in Store.multiGet: ', error);
    }
    return values;
  }

  async mergeItem(key, value) {
    try {
      if (!key || typeof key !== 'string') {
        return false;
      }
      const stringifiedPayload = this._getStringValue(value);
      if (!stringifiedPayload) {
        return false;
      }
      await AsyncStorage.mergeItem(key, stringifiedPayload);
      return true;
    } catch (error) {
      //logger.error('Exception in Store.mergeItem: ', error);
      return false;
    }
  }

  async multiMerge(items) {
    let mergedItem = null;
    try {
      mergedItem = await AsyncStorage.multiMerge(items);
    } catch (error) {
      //logger.error('Exception in Store.multiMerge: ', error);
    }
    return mergedItem;
  }

  async multiRemove(keys) {
    try {
      await AsyncStorage.multiRemove(keys);
      return true;
    } catch (error) {
      //logger.error('Exception in Store.multiRemove: ', error);
      return false;
    }
  }

  _getStringValue(payload) {
    if (typeof payload === 'function') {
      return null;
    }
    if (typeof payload === 'string') {
      return payload;
    }
    return JSON.stringify(payload);
  }

  _convertToObject(stringData) {
    try {
      return JSON.parse(stringData);
    } catch (error) {
      // Keep this as warning. It will be expected.
      //logger.warn('Exception in Store._convertToObject: ', error);
      return stringData;
    }
  }
}

export default new AsyncStore();
