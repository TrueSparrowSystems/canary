import PaginatedListDataSource from '../PaginatedList/PaginatedListDataSource';
import TwitterAPI from '../../api/helpers/TwitterAPI';
import {getTweetData} from '../utils/ViewData';

class TimelineListDataSource extends PaginatedListDataSource {
  constructor() {
    super();
  }
  // Endpoint which is to be called for fetching list data.
  apiCall(...args) {
    return TwitterAPI.timelineFeed(...args);
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
