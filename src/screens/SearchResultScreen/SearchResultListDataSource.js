import TwitterAPI, {SortOrder} from '../../api/helpers/TwitterAPI';
import PaginatedListDataSource from '../../components/PaginatedList/PaginatedListDataSource';
import {getTweetData} from '../../components/utils/ViewData';

class SearchResultListDataSource extends PaginatedListDataSource {
  constructor(query, sortOrder = SortOrder.Relevancy) {
    super();
    this.query = query;
    this.sortOrder = sortOrder;
    this.onQueryChange.bind(this);
    this.onSortOrderChange.bind(this);
  }
  // Endpoint which is to be called for fetching list data.
  apiCall(...args) {
    return TwitterAPI.searchResultFeed(this.query, this.sortOrder, ...args);
  }

  onQueryChange(query) {
    this.query = query;
  }

  onSortOrderChange(order) {
    this.sortOrder = order;
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
