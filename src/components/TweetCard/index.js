import {unescape} from 'lodash';
import React, {useCallback, useState, useRef, useMemo} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {
  BookmarkedIcon,
  bookmarkIcon,
  commentIcon,
  likeIcon,
  ListIcon,
  retweetIcon,
  verifiedIcon,
} from '../../assets/common';
import {ToastPosition, ToastType} from '../../constants/ToastConstants';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {collectionService} from '../../services/CollectionService';
import colors from '../../utils/colors';
import useTweetCardData from './useTweetCardData';
import Toast from 'react-native-toast-message';
import ImageCard from '../ImageCard';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';
import {getFormattedStat} from '../../utils/TextUtils';
import Image from 'react-native-fast-image';
import TwitterTextView from '../common/TwitterTextView';
import {layoutPtToPx} from '../../utils/responsiveUI';

function TweetCard(props) {
  const {dataSource, isDisabled = false} = props;

  const {fnOnCardPress, fnOnUserNamePress} = useTweetCardData(props);
  const localStyle = useStyleProcessor(styles, 'TweetCard');
  const {collectionId, user, text, id, public_metrics, media, entities} =
    dataSource;
  var {isBookmarked} = dataSource;
  const collectionIdRef = useRef(collectionId);
  const [isBookmarkedState, setIsBookmarkedState] = useState(isBookmarked);
  const onAddToCollectionSuccess = useCallback(_collectionId => {
    collectionIdRef.current = _collectionId;
    setIsBookmarkedState(true);
  }, []);

  const onBookmarkButtonPress = useCallback(() => {
    if (isBookmarkedState) {
      collectionService()
        .removeTweetFromCollection(id)
        .then(() => {
          setIsBookmarkedState(false);
        })
        .catch(error => {
          Toast.show({
            text1: error,
            type: ToastType.Error,
            position: ToastPosition.Top,
          });
        });
    } else {
      LocalEvent.emit(EventTypes.ShowAddToCollectionModal, {
        tweetId: id,
        onAddToCollectionSuccess: onAddToCollectionSuccess,
      });
    }
  }, [id, isBookmarkedState, onAddToCollectionSuccess]);

  const onAddToListSuccess = useCallback(() => {
    //TODO: handle on add to list success
  }, []);

  const onAddToListPress = useCallback(() => {
    LocalEvent.emit(EventTypes.ShowAddToListModal, {
      userName: user.username,
      onAddToListSuccess: onAddToListSuccess,
    });
  }, [onAddToListSuccess, user]);

  const hasMedia = useMemo(() => {
    return media && media?.length !== 0;
  }, [media]);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={fnOnCardPress}
      style={localStyle.cardContainer}
      disabled={isDisabled}>
      <TouchableOpacity
        onPress={fnOnUserNamePress}
        style={localStyle.profileImageContainer}>
        <Image
          source={{uri: user?.profile_image_url}}
          style={localStyle.userProfileImage}
        />
      </TouchableOpacity>
      <View style={localStyle.tweetDetailContainer}>
        <TouchableOpacity onPress={fnOnUserNamePress}>
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
        </TouchableOpacity>
        <TwitterTextView
          style={localStyle.tweetText}
          hasMedia={hasMedia}
          urls={entities?.urls}>
          {unescape(text)}
        </TwitterTextView>
        {hasMedia ? <ImageCard mediaArray={media} /> : null}
        <View style={localStyle.likeCommentStrip}>
          <Image source={commentIcon} style={localStyle.iconStyle} />
          <Text style={localStyle.publicMetricText}>
            {public_metrics?.reply_count === 0
              ? 0
              : getFormattedStat(public_metrics?.reply_count)}
          </Text>
          <Image source={retweetIcon} style={localStyle.iconStyle} />
          <Text style={localStyle.publicMetricText}>
            {public_metrics?.retweet_count === 0
              ? 0
              : getFormattedStat(public_metrics?.retweet_count)}
          </Text>
          <Image source={likeIcon} style={localStyle.iconStyle} />
          <Text style={localStyle.publicMetricText}>
            {public_metrics?.like_count === 0
              ? 0
              : getFormattedStat(public_metrics?.like_count)}
          </Text>
          <TouchableOpacity onPress={onBookmarkButtonPress}>
            <Image
              source={isBookmarkedState ? BookmarkedIcon : bookmarkIcon}
              style={localStyle.iconStyle}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onAddToListPress}>
            <Image source={ListIcon} style={localStyle.iconStyle} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
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
  profileImageContainer: {
    height: layoutPtToPx(50),
    width: layoutPtToPx(50),
  },
  userProfileImage: {
    height: '100%',
    width: '100%',
    borderRadius: 25,
  },
  tweetDetailContainer: {
    flex: 1,
    marginHorizontal: 10,
    justifyContent: 'center',
  },
  tweetText: {
    marginBottom: 10,
    color: colors.Black,
  },
  flexRow: {
    flexDirection: 'row',
  },
  nameText: {
    fontWeight: '600',
    fontSize: 15,
    flexShrink: 1,
    color: colors.Black,
  },
  verifiedIcon: {
    height: 20,
    width: 20,
  },
  userNameText: {
    fontSize: 12,
    padding: 2,
    flexShrink: 1,
    color: colors.Black,
  },
  likeCommentStrip: {
    flexDirection: 'row',
    paddingTop: 10,
  },
  iconStyle: {
    height: 15,
    width: 15,
    marginRight: 10,
    marginTop: 1,
  },
  publicMetricText: {
    flex: 1,
    color: colors.Black,
  },
};

export default React.memo(TweetCard);
