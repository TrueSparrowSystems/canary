import TwitterAPI from '../../api/helpers/TwitterAPI';
import PaginatedListDataSource from '../../components/PaginatedList/PaginatedListDataSource';
import {getTweetData} from '../../components/utils/ViewData';

class SearchResultListDataSource extends PaginatedListDataSource {
  constructor(query) {
    super();
    this.query = query;
    this.onQueryChange.bind(this);
  }
  // Endpoint which is to be called for fetching list data.
  apiCall(...args) {
    return TwitterAPI.searchResultFeed(this.query, ...args);
  }

  onQueryChange(query) {
    this.query = query;
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
export default SearchResultListDataSource;