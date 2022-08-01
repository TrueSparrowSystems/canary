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
  ShareIcon,
  verifiedIcon,
} from '../../assets/common';
import {ToastPosition, ToastType} from '../../constants/ToastConstants';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {collectionService} from '../../services/CollectionService';
import colors from '../../constants/colors';
import useTweetCardData from './useTweetCardData';
import Toast from 'react-native-toast-message';
import ImageCard from '../ImageCard';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';
import {getFormattedStat} from '../../utils/TextUtils';
import Image from 'react-native-fast-image';
import TwitterTextView from '../common/TwitterTextView';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import {getDisplayDate} from '../../utils/TimeUtils';
import fonts from '../../constants/fonts';

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
          <View style={localStyle.flexRow}>
            <Image source={likeIcon} style={localStyle.iconStyle} />
            <Text style={localStyle.publicMetricText}>
              {public_metrics?.like_count === 0
                ? 0
                : getFormattedStat(public_metrics?.like_count)}
            </Text>
            <Image source={commentIcon} style={localStyle.iconStyle} />
            <Text style={localStyle.publicMetricText}>
              {public_metrics?.reply_count === 0
                ? 0
                : getFormattedStat(public_metrics?.reply_count)}
            </Text>
          </View>
          <View style={localStyle.optionsView}>
            <TouchableOpacity
              onPress={() => {
                // TODO: add share feature
              }}>
              <Image source={ShareIcon} style={localStyle.shareIconStyle} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onBookmarkButtonPress}>
              <Image
                source={isBookmarkedState ? BookmarkedIcon : bookmarkIcon}
                style={localStyle.bookmarkIconStyle}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={onAddToListPress}>
              <Image source={ListIcon} style={localStyle.listIconStyle} />
            </TouchableOpacity>
          </View>
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
    fontFamily: fonts.InterRegular,
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
    fontFamily: fonts.InterRegular,
    flexGrow: 1,
    color: colors.BlackPearl50,
    fontSize: fontPtToPx(12),
    lineHeight: layoutPtToPx(16),
    marginTop: layoutPtToPx(8),
  },
  nameText: {
    fontFamily: fonts.InterSemiBold,
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
    fontFamily: fonts.InterRegular,
    fontSize: fontPtToPx(12),
    lineHeight: layoutPtToPx(15),
    color: colors.Black,
  },
  likeCommentStrip: {
    flexDirection: 'row',
    paddingTop: layoutPtToPx(10),
  },
  iconStyle: {
    height: layoutPtToPx(15),
    width: layoutPtToPx(17),
    marginRight: layoutPtToPx(4),
    marginTop: 1,
  },
  bookmarkIconStyle: {
    height: layoutPtToPx(20),
    width: layoutPtToPx(17),
    marginRight: layoutPtToPx(20),
  },
  shareIconStyle: {
    height: layoutPtToPx(20),
    width: layoutPtToPx(20),
    marginRight: layoutPtToPx(20),
  },
  listIconStyle: {
    height: layoutPtToPx(20),
    width: layoutPtToPx(15),
  },
  publicMetricText: {
    color: colors.Black,
    marginRight: layoutPtToPx(12),
  },
  optionsView: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
  },
};

export default React.memo(TweetCard);
