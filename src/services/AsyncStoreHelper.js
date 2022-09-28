import {Constants} from '../constants/Constants';
import AsyncStorage from './AsyncStorage';

class AsyncStoreHelper {
  async setInitialStoreValues() {
    const initialData = [];
    for (const key of Constants.KeysForClear) {
      const data = [key];
      data.push('');
      initialData.push(data);
    }
    AsyncStorage.multiSet(initialData);
  }
}
export default new AsyncStoreHelper();
