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
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import {getDisplayDate} from '../../utils/TimeUtils';

function TweetCard(props) {
  const {dataSource, isDisabled = false} = props;

  const {fnOnCardPress, fnOnUserNamePress} = useTweetCardData(props);
  const localStyle = useStyleProcessor(styles, 'TweetCard');
  const {
    collectionId,
    user,
    text,
    id,
    public_metrics,
    media,
    entities,
    created_at,
  } = dataSource;
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

  const displayDate = getDisplayDate(created_at);
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={fnOnCardPress}
      style={localStyle.cardContainer}
      disabled={isDisabled}>
      <TouchableOpacity
        onPress={fnOnUserNamePress}
        style={localStyle.userProfileContainer}>
        <View style={localStyle.userNameView}>
          <Image
            source={{uri: user?.profile_image_url}}
            style={localStyle.userProfileImage}
          />
          <TouchableOpacity
            onPress={fnOnUserNamePress}
            style={localStyle.flexShrink}>
            {/* <View style={localStyle.flexRow}> */}
            <View>
              <Text style={localStyle.nameText} numberOfLines={1}>
                {unescape(user?.name)}
              </Text>
              <View style={localStyle.flexRow}>
                <Text style={localStyle.userNameText} numberOfLines={1}>
                  @{unescape(user?.username)}
                </Text>
                {true ? (
                  <Image
                    source={verifiedIcon}
                    style={localStyle.verifiedIcon}
                  />
                ) : null}
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View style={localStyle.timeView}>
          <Text style={localStyle.displayDateText}>{displayDate}</Text>
        </View>
      </TouchableOpacity>
      <View style={localStyle.tweetDetailContainer}>
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
    borderWidth: 1,
    borderColor: colors.BlackPearl20,
    marginHorizontal: layoutPtToPx(8),
    marginBottom: layoutPtToPx(12),
    borderRadius: layoutPtToPx(8),
    padding: layoutPtToPx(12),
    flex: 1,
  },
  userProfileContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  userProfileImage: {
    height: layoutPtToPx(40),
    width: layoutPtToPx(40),
    marginRight: layoutPtToPx(8),
    borderRadius: layoutPtToPx(20),
  },
  userNameView: {
    flexShrink: 1,
    flexDirection: 'row',
    paddingRight: layoutPtToPx(10),
  },
  timeView: {
    flexGrow: 1,
    alignItems: 'flex-end',
  },
  tweetDetailContainer: {
    flex: 1,
    marginTop: layoutPtToPx(8),
    justifyContent: 'center',
  },
  tweetText: {
    // TODO: add inter font
    marginBottom: 10,
    color: colors.BlackPearl,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexShrink: {
    flexShrink: 1,
    justifyContent: 'center',
  },
  displayDateText: {
    // TODO: add inter font
    flexGrow: 1,
    color: colors.BlackPearl50,
    fontSize: fontPtToPx(12),
    lineHeight: layoutPtToPx(16),
    marginTop: layoutPtToPx(8),
  },
  nameText: {
    // TODO: add inter font
    fontSize: fontPtToPx(16),
    lineHeight: layoutPtToPx(19),
    flexShrink: 1,
    color: colors.BlackPearl,
  },
  verifiedIcon: {
    height: layoutPtToPx(12),
    width: layoutPtToPx(12),
    marginLeft: layoutPtToPx(2),
  },
  userNameText: {
    // TODO: add inter font
    fontSize: fontPtToPx(12),
    lineHeight: layoutPtToPx(15),
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
