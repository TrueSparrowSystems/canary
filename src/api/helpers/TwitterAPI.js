import {isArray, sampleSize} from 'lodash';
import {Constants} from '../../constants/Constants';
import {APIService} from '../../services/Api';
import PreferencesDataHelper from '../../services/PreferencesDataHelper';

const CONTEXTS_LIMIT = 12;
const USERS_LIMIT = 20;

const EndPoints = {
  timelineFeed: 'https://api.twitter.com/2/tweets/search/recent',
  searchResultFeed: 'https://api.twitter.com/2/tweets/search/recent',
  userListFeed: 'https://api.twitter.com/2/tweets/search/recent',
  multipleTweetsLookup: 'https://api.twitter.com/2/tweets',
  conversationThread: 'https://api.twitter.com/2/tweets/search/recent',
  getSingleTweet: tweetId => `https://api.twitter.com/2/tweets/${tweetId}`,
  getAvailableWoeids: 'https://api.twitter.com/1.1/trends/available.json',
  getTrendsFromWoeid: 'https://api.twitter.com/1.1/trends/place.json',
  getTweetStatus: 'https://api.twitter.com/1.1/statuses/show.json',
  getUserByUserName: userName =>
    `https://api.twitter.com/2/users/by/username/${userName}`,
  getUsersByUserNames: 'https://api.twitter.com/2/users/by',
  userSearch: 'https://api.twitter.com/1.1/users/search.json',
};

const API_REQUEST_PARAMETERS = {
  expansions:
    'attachments.media_keys,author_id,in_reply_to_user_id,geo.place_id',
  'media.fields':
    'media_key,duration_ms,height,preview_image_url,type,url,width',
  'place.fields':
    'contained_within,country,country_code,full_name,geo,id,name,place_type',
  'tweet.fields':
    'conversation_id,author_id,context_annotations,created_at,entities,geo,id,in_reply_to_user_id,referenced_tweets,source,text,public_metrics',
  'user.fields': 'id,name,profile_image_url,username,verified',
};

class TwitterApi {
  getContexts(
    preferredTopics = PreferencesDataHelper.getSelectedPreferencesListFromCache(),
  ) {
    let contexts = [];

    if (isArray(preferredTopics) && preferredTopics?.length > 0) {
      preferredTopics.map(topic => {
        const currentTopicContext =
          PreferencesDataHelper.getItemContextQuery(topic);
        contexts.push(currentTopicContext);
      });
    }

    contexts = sampleSize(contexts, CONTEXTS_LIMIT);

    const contextString = contexts.join(' OR ');

    return contextString;
  }

  getUserNameQueryFromArray(userNameArray) {
    let userNameQueryArray = [];
    if (userNameArray.length > 0) {
      userNameArray.map(userName => {
        userNameQueryArray.push(`from:${userName}`);
      });
    }

    userNameQueryArray = sampleSize(userNameQueryArray, USERS_LIMIT);

    const userNameQuery = userNameQueryArray.join(' OR ');
    return userNameQuery;
  }

  timelineFeed(
    shouldShowVerifiedUsers,
    sortOrder = Constants.SortOrder.Relevancy,
    maxResultCount = 20,
    nextPageIdentifier,
  ) {
    const query = `(${this.getContexts()}) (lang:EN) (-is:retweet -is:reply -is:quote ${
      shouldShowVerifiedUsers ? 'is:verified' : ''
    })`;
    const data = {
      max_results: maxResultCount,
      sort_order: sortOrder,
      query: query,
      ...API_REQUEST_PARAMETERS,
    };
    if (
      nextPageIdentifier &&
      nextPageIdentifier !== Constants.ApiModes.VerifiedRecent &&
      nextPageIdentifier !== Constants.ApiModes.AllUsersRelevent
    ) {
      data.next_token = nextPageIdentifier;
    }
    const apiService = new APIService({});
    return apiService.get(EndPoints.timelineFeed, data);
  }

  getAllTweets(nextPageIdentifier) {
    const itemsArray = PreferencesDataHelper.getItemsArray();
    const query = `(${this.getContexts(
      itemsArray,
    )}) (lang:EN) (-is:retweet -is:reply -is:quote)`;
    const data = {
      max_results: 10,
      sort_order: Constants.SortOrder.Relevancy,
      query: query,
      ...API_REQUEST_PARAMETERS,
    };
    if (
      nextPageIdentifier &&
      nextPageIdentifier !== Constants.ApiModes.AllResults
    ) {
      data.next_token = nextPageIdentifier;
    }
    const apiService = new APIService({});
    return apiService.get(EndPoints.timelineFeed, data);
  }

  searchResultFeed(
    query,
    sortOrder = Constants.SortOrder.Recency,
    nextPageIdentifier,
  ) {
    const data = {
      max_results: sortOrder === Constants.SortOrder.Relevancy ? 100 : 20,
      sort_order: sortOrder,
      query: `${query} (-is:retweet -is:reply -is:quote)`,
      ...API_REQUEST_PARAMETERS,
    };
    if (nextPageIdentifier) {
      data.next_token = nextPageIdentifier;
    }
    const apiService = new APIService({});
    return apiService.get(EndPoints.searchResultFeed, data);
  }

  userListFeed(userNameArray, nextPageIdentifier) {
    const data = {
      max_results: 10,
      query: `(${this.getUserNameQueryFromArray(
        userNameArray,
      )}) (-is:retweet -is:reply -is:quote)`,
      ...API_REQUEST_PARAMETERS,
    };
    if (nextPageIdentifier) {
      data.next_token = nextPageIdentifier;
    }
    const apiService = new APIService({});
    return apiService.get(EndPoints.userListFeed, data);
  }

  multipleTweetLookup(ids) {
    if (ids.length === 0) {
      return;
    }

    const data = {
      ids: ids,
      ...API_REQUEST_PARAMETERS,
    };

    const apiService = new APIService({});
    return apiService.get(EndPoints.multipleTweetsLookup, data);
  }

  getConversationThread(conversationId, username, nextPageIdentifier) {
    const data = {
      max_results: 10,
      query: `(conversation_id:${conversationId}) (to:${username}) (-is:retweet)`,
      ...API_REQUEST_PARAMETERS,
    };
    if (nextPageIdentifier) {
      data.next_token = nextPageIdentifier;
    }
    const apiService = new APIService({});
    return apiService.get(EndPoints.conversationThread, data);
  }

  getSingleTweet(tweetId) {
    const data = {...API_REQUEST_PARAMETERS};
    const apiService = new APIService({});
    return apiService.get(EndPoints.getSingleTweet(tweetId), data);
  }
  getAvailableWoeids() {
    const apiService = new APIService({});
    return apiService.get(EndPoints.getAvailableWoeids);
  }
  getTrendsFromWoeid(woeid) {
    const data = {
      id: woeid,
    };
    const apiService = new APIService({});
    return apiService.get(EndPoints.getTrendsFromWoeid, data);
  }
  getTweetStatusfromTweetId(tweetId) {
    const data = {
      id: tweetId,
      includes_entities: true,
      tweet_mode: 'extended',
    };
    const apiService = new APIService({});
    return apiService.get(EndPoints.getTweetStatus, data);
  }
  getUserByUserName(userName) {
    const data = {
      'user.fields':
        'id,name,profile_image_url,username,verified,description,public_metrics',
    };
    const apiService = new APIService({});
    return apiService.get(EndPoints.getUserByUserName(userName), data);
  }
  getUsersByUserNames(usernames) {
    const data = {
      usernames: usernames,
      'user.fields': 'id,name,profile_image_url,username,verified',
    };
    const apiService = new APIService({});
    return apiService.get(EndPoints.getUsersByUserNames, data);
  }
  searchUser(query) {
    const data = {
      q: query,
      include_entities: false,
    };
    const apiService = new APIService({});
    return apiService.get(EndPoints.userSearch, data);
  }
}
export default new TwitterApi();
