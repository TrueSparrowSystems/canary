import {PreferencesData} from '../constants/PreferencesData';

class PreferencesDataHelper {
  constructor() {
    this.data = PreferencesData;
    this.getItemsArray.bind(this);
    this.getItemData.bind(this);
    this.getItemTitle.bind(this);
    this.getItemDomainId.bind(this);
    this.getItemEntityId.bind(this);
    this.getItemContextQuery.bind(this);
  }

  getItemsArray() {
    return this.data.items;
  }

  getItemData(key) {
    if (key) {
      return this.data.data?.[key];
    }
    return null;
  }

  getItemTitle(key) {
    if (key) {
      return this.getItemData(key)?.title;
    }
    return null;
  }

  getItemDomainId(key) {
    if (key) {
      return this.getItemData(key)?.domainId;
    }
    return null;
  }

  getItemEntityId(key) {
    if (key) {
      return this.getItemData(key)?.entityId;
    }
    return null;
  }

  getItemContextQuery(key) {
    if (key) {
      return `${this.getItemDomainId(key)}.${this.getItemEntityId(key)}`;
    }
    return null;
  }
}
export default new PreferencesDataHelper();
