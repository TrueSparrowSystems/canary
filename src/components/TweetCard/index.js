import {unescape} from 'lodash';
import React, {useCallback} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {
  bookmarkIcon,
  commentIcon,
  likeIcon,
  retweetIcon,
  verifiedIcon,
} from '../../assets/common';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import colors from '../../utils/colors';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';
import ImageCard from '../ImageCard';

function TweetCard({dataSource}) {
  const localStyle = useStyleProcessor(styles, 'TweetCard');
  const {user, text, public_metrics, media} = dataSource;

  const onAddToCollectionPress = useCallback(() => {
    LocalEvent.emit(EventTypes.ShowAddToCollectionModal, {
      tweetId: dataSource.id,
    });
  }, [dataSource]);
  return (
    <View style={localStyle.cardContainer}>
      <Image
        source={{uri: user?.profile_image_url}}
        style={localStyle.userProfileImage}
      />
      <View style={localStyle.tweetDetailContainer}>
        <View style={localStyle.flexRow}>
          <Text style={localStyle.nameText} numberOfLines={1}>
            {unescape(user?.name)}
          </Text>
          {user?.verified ? (
            <Image source={verifiedIcon} style={localStyle.verifiedIcon} />
          ) : null}
          <Text style={localStyle.userNameText} numberOfLines={1}>
            @{unescape(user?.username)}
          </Text>
        </View>
        <Text>{unescape(text)}</Text>
        {media && media?.length !== 0 ? <ImageCard mediaArray={media} /> : null}
        <View style={localStyle.likeCommentStrip}>
          <Image source={commentIcon} style={localStyle.iconStyle} />
          <Text style={localStyle.flex1}>
            {public_metrics?.reply_count === 0
              ? ''
              : public_metrics?.reply_count}
          </Text>
          <Image source={retweetIcon} style={localStyle.iconStyle} />
          <Text style={localStyle.flex1}>
            {public_metrics?.retweet_count === 0
              ? ''
              : public_metrics?.retweet_count}
          </Text>
          <Image source={likeIcon} style={localStyle.iconStyle} />
          <Text style={localStyle.flex1}>
            {public_metrics?.like_count === 0 ? '' : public_metrics?.like_count}
          </Text>
          <TouchableOpacity onPress={onAddToCollectionPress}>
            <Image source={bookmarkIcon} style={localStyle.iconStyle} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = {
  cardContainer: {
    borderTopWidth: 1,
    borderColor: colors.LightGrey,
    marginBottom: 10,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 5,
    flexDirection: 'row',
    flex: 1,
  },
  userProfileImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  tweetDetailContainer: {
    flex: 1,
    marginHorizontal: 10,
    justifyContent: 'center',
  },
  flexRow: {flexDirection: 'row'},
  nameText: {fontWeight: '600', fontSize: 15, flexShrink: 1},
  verifiedIcon: {height: 20, width: 20},
  userNameText: {fontSize: 12, padding: 2, flexShrink: 1},
  likeCommentStrip: {
    flexDirection: 'row',
    paddingTop: 10,
  },
  iconStyle: {height: 15, width: 15, marginRight: 10, marginTop: 1},
  flex1: {flex: 1},
};

export default React.memo(TweetCard);
