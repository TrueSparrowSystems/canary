import {isArray, sampleSize} from 'lodash';
import {APIService} from '../../services/Api';
import PreferencesDataHelper from '../../services/PreferencesDataHelper';

const CONTEXTS_LIMIT = 12;

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
  getContexts() {
    let contexts = [];
    const preferredTopics =
      PreferencesDataHelper.getSelectedPreferencesListFromCache();

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
    const userNameQueryArray = [];
    if (userNameArray.length > 0) {
      userNameArray.map(userName => {
        userNameQueryArray.push(`from:${userName}`);
      });
    }
    const userNameQuery = userNameQueryArray.join(' OR ');
    return userNameQuery;
  }

  timelineFeed(nextPageIdentifier) {
    const data = {
      max_results: 10,
      sort_order: 'relevancy',
      query: `(${this.getContexts()}) (lang:EN) (-is:retweet -is:reply -is:quote)`,
      ...API_REQUEST_PARAMETERS,
    };
    if (nextPageIdentifier) {
      data.next_token = nextPageIdentifier;
    }
    const apiService = new APIService({});
    return apiService.get(EndPoints.timelineFeed, data);
  }

  searchResultFeed(query, nextPageIdentifier) {
    const data = {
      max_results: 10,
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
      'user.fields': 'id,name,profile_image_url,username,verified',
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
