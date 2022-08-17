import TwitterAPI from '../../api/helpers/TwitterAPI';
import PaginatedListDataSource from '../../components/PaginatedList/PaginatedListDataSource';
import {getTweetData} from '../../components/utils/ViewData';

class ListTweetDataSource extends PaginatedListDataSource {
  constructor(userNameArray) {
    super();
    this.userNameArray = userNameArray;
  }
  // Endpoint which is to be called for fetching list data.
  apiCall(...args) {
    return TwitterAPI.userListFeed(this.userNameArray, ...args);
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
export default ListTweetDataSource;
