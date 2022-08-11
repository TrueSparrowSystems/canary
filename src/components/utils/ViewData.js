import Cache from '../../services/Cache';
import {CacheKey} from '../../services/Cache/CacheStoreConstants';

export function getTweetData(tweet, response) {
  const authorId = tweet.author_id;
  const mediaKeys = tweet?.attachments?.media_keys || [];
  var data = {...tweet};
  const bookmarkedTweetList = Cache.getValue(CacheKey.BookmarkedTweetsList);
  data.isBookmarked = bookmarkedTweetList
    ? bookmarkedTweetList?.hasOwnProperty(tweet.id)
    : false;
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
