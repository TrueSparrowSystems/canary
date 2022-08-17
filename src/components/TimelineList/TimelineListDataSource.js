import PaginatedListDataSource from '../PaginatedList/PaginatedListDataSource';
import TwitterAPI from '../../api/helpers/TwitterAPI';
import {getTweetData} from '../utils/ViewData';
import PreferencesDataHelper from '../../services/PreferencesDataHelper';
import lodashSet from 'lodash/set';
import uuid from 'react-native-uuid';
import {Constants} from '../../constants/Constants';

const PROMOTION_TWEET_THRESHOLD = 50;

class TimelineListDataSource extends PaginatedListDataSource {
  constructor() {
    super();
    this.getVerifiedUserPreference.bind(this);
    this.apiMode = Constants.ApiModes.AllResults;
    this.switchApiModeToDefault.bind(this);
    this.switchApiModeToDefault();
  }
  // Endpoint which is to be called for fetching list data.
  apiCall(...args) {
    switch (this.apiMode) {
      case Constants.ApiModes.VerifiedRelevent:
        return TwitterAPI.timelineFeed(
          true,
          Constants.SortOrder.Relevancy,
          50,
          ...args,
        );
      case Constants.ApiModes.VerifiedRecent:
        return TwitterAPI.timelineFeed(
          true,
          Constants.SortOrder.Recency,
          20,
          ...args,
        );
      case Constants.ApiModes.AllUsersRelevent:
        return TwitterAPI.timelineFeed(
          false,
          Constants.SortOrder.Relevancy,
          20,
          ...args,
        );
      case Constants.ApiModes.AllResults: {
        return TwitterAPI.getAllTweets(...args);
      }
      default: {
        this.apiMode = Constants.ApiModes.AllUsersRelevent;
        return TwitterAPI.timelineFeed(
          false,
          Constants.SortOrder.Relevancy,
          20,
          ...args,
        );
      }
    }
  }

  getVerifiedUserPreference() {
    return PreferencesDataHelper.getVerifiedUsersPreferenceFromCache();
  }

  switchApiModeToDefault() {
    this.apiMode = this.getVerifiedUserPreference()
      ? Constants.ApiModes.VerifiedRelevent
      : Constants.ApiModes.AllUsersRelevent;
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
        case Constants.ApiModes.VerifiedRelevent:
          lodashSet(
            response,
            'data.meta.next_token',
            Constants.ApiModes.VerifiedRecent,
          );
          this.apiMode = Constants.ApiModes.VerifiedRecent;
          break;
        case Constants.ApiModes.VerifiedRecent:
          lodashSet(
            response,
            'data.meta.next_token',
            Constants.ApiModes.AllUsersRelevent,
          );
          this.apiMode = Constants.ApiModes.AllUsersRelevent;
          break;
        case Constants.ApiModes.AllUsersRelevent:
          lodashSet(
            response,
            'data.meta.next_token',
            Constants.ApiModes.AllResults,
          );
          this.apiMode = Constants.ApiModes.AllResults;
          break;
        default:
          lodashSet(
            response,
            'data.meta.next_token',
            Constants.ApiModes.AllResults,
          );
          this.apiMode = Constants.ApiModes.AllResults;
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

      if (Object.keys(this.viewData).length === PROMOTION_TWEET_THRESHOLD) {
        array.push({
          id: uuid.v4(),
          card_type: Constants.CardTypes.ShareCard,
        });
      }
    });

    return array;
  }
}
export default TimelineListDataSource;
