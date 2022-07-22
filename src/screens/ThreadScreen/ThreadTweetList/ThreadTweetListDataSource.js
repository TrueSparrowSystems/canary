import TwitterAPI from '../../../api/helpers/TwitterAPI';
import PaginatedListDataSource from '../../../components/PaginatedList/PaginatedListDataSource';
import {getTweetData} from '../../../components/utils/ViewData';

const ReferencedTweetTypes = {
  RepliedTo: 'replied_to',
};

class ThreadTweetListDataSource extends PaginatedListDataSource {
  constructor({tweetId, conversationId}) {
    super();

    this.tweetId = tweetId;
    this.conversationId = conversationId;
  }
  // Endpoint which is to be called for fetching list data.
  apiCall(...args) {
    return TwitterAPI.getConversationThread(this.conversationId, ...args);
  }

  processData({data, response}) {
    const array = [];

    data.forEach(tweet => {
      const referencedTweets = tweet.referenced_tweets[0];
      if (
        referencedTweets.type === ReferencedTweetTypes.RepliedTo &&
        referencedTweets.id === this.tweetId
      ) {
        this.viewData[tweet.id] = getTweetData(tweet, response);

        array.push(this.viewData[tweet.id]);
      }
    });
    return array;
  }
}
export default ThreadTweetListDataSource;
