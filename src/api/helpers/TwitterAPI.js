import {isArray} from 'lodash';
import {APIService} from '../../services/Api';
import PreferencesDataHelper from '../../services/PreferencesDataHelper';

const EndPoints = {
  timelineFeed: 'https://api.twitter.com/2/tweets/search/recent',
  searchResultFeed: 'https://api.twitter.com/2/tweets/search/recent',
  userListFeed: 'https://api.twitter.com/2/tweets/search/recent',
  multipleTweetsLookup: 'https://api.twitter.com/2/tweets',
  conversationThread: 'https://api.twitter.com/2/tweets/search/recent',
  getSingleTweet: tweetId => `https://api.twitter.com/2/tweets/${tweetId}`,
};

const API_REQUEST_PARAMETERS = {
  expansions:
    'attachments.media_keys,author_id,in_reply_to_user_id,geo.place_id,referenced_tweets.id',
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
      query: `${query} (lang:EN) (-is:retweet -is:reply -is:quote)`,
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
      )}) (lang:EN) (-is:retweet -is:reply -is:quote)`,
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

  getConversationThread(conversationId, nextPageIdentifier) {
    const data = {
      max_results: 10,
      query: `(conversation_id:${conversationId}) (lang:EN) (-is:retweet)`,
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
}
export default new TwitterApi();
