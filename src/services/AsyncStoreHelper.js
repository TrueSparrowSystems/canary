import AsyncStorage from './AsyncStorage';
import {StoreKeys} from './AsyncStorage/StoreConstants';

class AsyncStoreHelper {
  constructor() {
    this.backupKeys = Object.values(StoreKeys);
  }
  async setInitialStoreValues() {
    const initialData = [];
    for (const key of this.backupKeys) {
      const data = [key];
      data.push('');
      initialData.push(data);
    }
    AsyncStorage.multiSet(initialData);
  }
}
export default new AsyncStoreHelper();
