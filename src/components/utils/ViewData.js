import Cache from '../../services/Cache';
import {CacheKey} from '../../services/Cache/CacheStoreConstants';
import {CARD_TYPE} from '../TimelineList/TimelineListDataSource';

export function getTweetData(tweet, response) {
  const authorId = tweet.author_id;
  const mediaKeys = tweet?.attachments?.media_keys || [];
  var data = {...tweet, card_type: CARD_TYPE.TweetCard};
  data.isBookmarked = checkIsTweetBookmarked(tweet.id);
  const userData = response?.data?.includes?.users;
  userData?.forEach(user => {
    if (user.id === authorId) {
      data = {...data, user};
      return;
    }
  });
  const mediaData = response.data?.includes?.media;
  if (mediaData && mediaKeys.length !== 0) {
    mediaData.forEach(media => {
      if (mediaKeys.includes(media.media_key)) {
        if (data.media) {
          data.media = [...data.media, media];
        } else {
          data = {...data, media: [media]};
        }
      }
    });
  }
  return data;
}

export function checkIsTweetBookmarked(tweetId) {
  if (!tweetId) {
    return false;
  }
  const bookmarkedTweetList = Cache.getValue(CacheKey.BookmarkedTweetsList);
  return bookmarkedTweetList
    ? bookmarkedTweetList?.hasOwnProperty(tweetId)
    : false;
}
