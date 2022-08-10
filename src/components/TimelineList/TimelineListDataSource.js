import PaginatedListDataSource from '../PaginatedList/PaginatedListDataSource';
import TwitterAPI from '../../api/helpers/TwitterAPI';
import {getTweetData} from '../utils/ViewData';
import PreferencesDataHelper from '../../services/PreferencesDataHelper';

class TimelineListDataSource extends PaginatedListDataSource {
  constructor() {
    super();
    this.getVerifiedUserPreference.bind(this);
  }
  // Endpoint which is to be called for fetching list data.
  apiCall(...args) {
    return TwitterAPI.timelineFeed(this.getVerifiedUserPreference(), ...args);
  }

  getVerifiedUserPreference() {
    const data = PreferencesDataHelper.getVerifiedUsersPreferenceFromCache();
    return data;
  }

  processData({data, response}) {
    const array = [];
    data.forEach(tweet => {
      this.viewData[tweet.id] = getTweetData(tweet, response);
      array.push(this.viewData[tweet.id]);
    });
    return array;
  }
}
export default TimelineListDataSource;
