import React, {useCallback, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {
  BookmarkedIcon,
  bookmarkIcon,
  commentIcon,
  likeIcon,
  retweetIcon,
  verifiedIcon,
} from '../../assets/common';
import {ToastPosition, ToastType} from '../../constants/ToastConstants';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {collectionService} from '../../services/CollectionService';
import colors from '../../utils/colors';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';
import Toast from 'react-native-toast-message';

function TweetCard({dataSource}) {
  const localStyle = useStyleProcessor(styles, 'TweetCard');
  const {collectionId, user, text, id} = dataSource;
  var {isBookmarked} = dataSource;
  const [isBookmarkedState, setIsBookmarkedState] = useState(isBookmarked);

  const onAddToCollectionSuccess = useCallback(() => {
    setIsBookmarkedState(true);
  }, []);

  const onBookmarkButtonPress = useCallback(() => {
    if (isBookmarkedState) {
      collectionService()
        .removeTweetFromCollection(collectionId, id)
        .then(() => {
          setIsBookmarkedState(false);
        })
        .catch(error => {
          Toast.show({
            text1: error,
            type: ToastType.error,
            position: ToastPosition.Top,
          });
        });
    } else {
      LocalEvent.emit(EventTypes.ShowAddToCollectionModal, {
        tweetId: id,
        onAddToCollectionSuccess: onAddToCollectionSuccess,
      });
    }
  }, [collectionId, id, isBookmarkedState, onAddToCollectionSuccess]);

  return (
    <View style={localStyle.cardContainer}>
      <Image
        source={{uri: user?.profile_image_url}}
        style={localStyle.userProfileImage}
      />
      <View style={localStyle.tweetDetailContainer}>
        <View style={localStyle.flexRow}>
          <Text style={localStyle.nameText} numberOfLines={1}>
            {user?.name}
          </Text>
          {user?.verified ? (
            <Image source={verifiedIcon} style={localStyle.verifiedIcon} />
          ) : null}
          <Text style={localStyle.userNameText} numberOfLines={1}>
            @{user?.username}
          </Text>
        </View>
        <Text>{text}</Text>
        <View style={localStyle.likeCommentStrip}>
          <Image source={commentIcon} style={localStyle.iconStyle} />
          <Text style={localStyle.flex1}>13</Text>
          <Image source={retweetIcon} style={localStyle.iconStyle} />
          <Text style={localStyle.flex1}>20</Text>
          <Image source={likeIcon} style={localStyle.iconStyle} />
          <Text style={localStyle.flex1}>123</Text>
          <TouchableOpacity onPress={onBookmarkButtonPress}>
            <Image
              source={isBookmarkedState ? BookmarkedIcon : bookmarkIcon}
              style={localStyle.iconStyle}
            />
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
