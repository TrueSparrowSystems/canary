import {APIService} from '../../services/Api';

const EndPoints = {
  timelineFeed: 'https://api.twitter.com/2/tweets/search/recent',
  multipleTweetsLookup: 'https://api.twitter.com/2/tweets',
};
class TwitterApi {
  timelineFeed(nextPageIdentifier) {
    const data = {
      max_results: 10,
      query:
        '(context:11.847900493514891265 OR context:152.825047692124442624) (lang:EN) (-is:retweet)',
      expansions:
        'attachments.media_keys,author_id,in_reply_to_user_id,geo.place_id,referenced_tweets.id',

      'media.fields':
        'media_key,duration_ms,height,preview_image_url,type,url,width',
      'place.fields':
        'contained_within,country,country_code,full_name,geo,id,name,place_type',
      'tweet.fields':
        'attachments,conversation_id,author_id,context_annotations,created_at,entities,geo,id,in_reply_to_user_id,referenced_tweets,source,text',
      'user.fields': 'id,name,profile_image_url,username,verified',
    };
    if (nextPageIdentifier) {
      data.next_token = nextPageIdentifier;
    }
    const apiService = new APIService({});
    return apiService.get(EndPoints.timelineFeed, data);
  }

  multipleTweetLookup(ids) {
    if (ids.length === 0) {
      return;
    }

    const data = {
      ids: ids,
      expansions:
        'attachments.media_keys,author_id,in_reply_to_user_id,geo.place_id,referenced_tweets.id',
      'media.fields':
        'media_key,duration_ms,height,preview_image_url,type,url,width',
      'place.fields':
        'contained_within,country,country_code,full_name,geo,id,name,place_type',
      'tweet.fields':
        'attachments,conversation_id,author_id,context_annotations,created_at,entities,geo,id,in_reply_to_user_id,referenced_tweets,source,text',
      'user.fields': 'id,name,profile_image_url,username,verified',
    };

    const apiService = new APIService({});
    return apiService.get(EndPoints.multipleTweetsLookup, data);
  }
}
export default new TwitterApi();
