import PaginatedListDataSource from '../PaginatedList/PaginatedListDataSource';
import TwitterAPI, {SortOrder} from '../../api/helpers/TwitterAPI';
import {getTweetData} from '../utils/ViewData';
import PreferencesDataHelper from '../../services/PreferencesDataHelper';
import lodashSet from 'lodash/set';

export const API_MODE = {
  //Verified with relevency with context
  VerifiedRelevent: 'verified_relevent',
  //Verified with recency with context
  VerifiedRecent: 'verified_recent',
  //All user with relevency with context
  AllUsersRelevent: 'all_users_relevent',
  //All Tweets with relevency without context
  AllResults: 'all_results',
};

export const CARD_TYPE = {
  ShareCard: 'share_card',
  TweetCard: 'tweet_card',
};

class TimelineListDataSource extends PaginatedListDataSource {
  constructor() {
    super();
    this.getVerifiedUserPreference.bind(this);
    this.apiMode = API_MODE.AllResults;
    this.switchApiModeToDefault.bind(this);
    this.switchApiModeToDefault();
    this.addShareCard = false;
  }
  // Endpoint which is to be called for fetching list data.
  apiCall(...args) {
    switch (this.apiMode) {
      case API_MODE.VerifiedRelevent:
        return TwitterAPI.timelineFeed(true, SortOrder.Relevancy, 50, ...args);
      case API_MODE.VerifiedRecent:
        return TwitterAPI.timelineFeed(true, SortOrder.Recency, 20, ...args);
      case API_MODE.AllUsersRelevent:
        return TwitterAPI.timelineFeed(false, SortOrder.Relevancy, 20, ...args);
      case API_MODE.AllResults: {
        return TwitterAPI.getAllTweets(...args);
      }
      default: {
        this.apiMode = API_MODE.AllUsersRelevent;
        return TwitterAPI.timelineFeed(false, SortOrder.Relevancy, 20, ...args);
      }
    }
  }

  getVerifiedUserPreference() {
    return PreferencesDataHelper.getVerifiedUsersPreferenceFromCache();
  }

  switchApiModeToDefault() {
    this.apiMode = this.getVerifiedUserPreference()
      ? API_MODE.VerifiedRelevent
      : API_MODE.AllUsersRelevent;
  }
  clearViewData() {
    super.clearViewData();
    this.switchApiModeToDefault();
  }

  onResponse(response) {
    if (
      !response.data?.meta?.next_token ||
      response.data?.meta?.result_count === 0
    ) {
      switch (this.apiMode) {
        case API_MODE.VerifiedRelevent:
          lodashSet(response, 'data.meta.next_token', API_MODE.VerifiedRecent);
          this.apiMode = API_MODE.VerifiedRecent;
          this.addShareCard = true;
          break;
        case API_MODE.VerifiedRecent:
          lodashSet(
            response,
            'data.meta.next_token',
            API_MODE.AllUsersRelevent,
          );
          this.apiMode = API_MODE.AllUsersRelevent;
          break;
        case API_MODE.AllUsersRelevent:
          lodashSet(response, 'data.meta.next_token', API_MODE.AllResults);
          this.apiMode = API_MODE.AllResults;
          this.addShareCard = true;
          break;
        default:
          lodashSet(response, 'data.meta.next_token', API_MODE.AllResults);
          this.apiMode = API_MODE.AllResults;
          break;
      }
    }

    return response;
  }

  processData({data, response}) {
    const array = [];
    data.forEach(tweet => {
      this.viewData[tweet.id] = getTweetData(tweet, response);
      array.push(this.viewData[tweet.id]);
    });
    if (this.addShareCard) {
      this.addShareCard = false;
      array.push({card_type: CARD_TYPE.ShareCard});
    }
    return array;
  }
}
export default TimelineListDataSource;
