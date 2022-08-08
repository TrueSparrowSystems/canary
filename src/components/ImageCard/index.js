import {useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {TouchableWithoutFeedback, View} from 'react-native';
import {PlayIcon} from '../../assets/common';
import ScreenName from '../../constants/ScreenName';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import Image from 'react-native-fast-image';
import TwitterAPI from '../../api/helpers/TwitterAPI';
import {layoutPtToPx} from '../../utils/responsiveUI';
import colors, {getColorWithOpacity} from '../../constants/colors';

function ImageCard({mediaArray, tweetId}) {
  const localStyle = useStyleProcessor(styles, 'ImageCard');
  const navigation = useNavigation();
  const onImagePress = useCallback(
    index => {
      navigation.navigate(ScreenName.ImageViewScreen, {
        mediaArray,
        imageIndex: index,
      });
    },
    [mediaArray, navigation],
  );

  var videoUrl = null;
  var aspectRatio = null;
  if (mediaArray[0].type === 'video') {
    TwitterAPI.getTweetStatusfromTweetId(tweetId)
      .then(res => {
        const videoInfo = res?.data?.extended_entities?.media?.[0]?.video_info;
        const videoVariantsArray = videoInfo?.variants;
        aspectRatio = videoInfo?.aspect_ratio;
        videoVariantsArray &&
          videoVariantsArray.map(videoVariant => {
            if (videoVariant?.content_type === 'video/mp4' && !videoUrl) {
              videoUrl = videoVariant.url;
            }
          });
      })
      .catch(() => {});
  }
  return mediaArray[0].type === 'photo' ? (
    <View style={localStyle.container}>
      <View style={localStyle.flexRow}>
        <TouchableWithoutFeedback
          onPress={() => {
            onImagePress(0);
          }}>
          <Image
            style={localStyle.showImage}
            source={mediaArray?.length >= 1 ? {uri: mediaArray[0]?.url} : null}
            resizeMode={'cover'}
          />
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback
          onPress={() => {
            onImagePress(1);
          }}>
          <Image
            style={
              mediaArray?.length >= 2
                ? localStyle.showImage
                : localStyle.hideImage
            }
            source={mediaArray?.length >= 2 ? {uri: mediaArray[1]?.url} : null}
            resizeMode={'cover'}
          />
        </TouchableWithoutFeedback>
      </View>
      <View
        style={
          mediaArray?.length >= 3 ? localStyle.flexRow : localStyle.hideImage
        }>
        <TouchableWithoutFeedback
          onPress={() => {
            onImagePress(2);
          }}>
          <Image
            style={
              mediaArray?.length >= 3
                ? localStyle.showImage
                : localStyle.hideImage
            }
            source={mediaArray?.length >= 3 ? {uri: mediaArray[2]?.url} : null}
            resizeMode={'cover'}
          />
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback
          onPress={() => {
            onImagePress(3);
          }}>
          <Image
            style={
              mediaArray?.length >= 4
                ? localStyle.showImage
                : localStyle.hideImage
            }
            source={mediaArray?.length >= 4 ? {uri: mediaArray[3]?.url} : null}
            resizeMode={'cover'}
          />
        </TouchableWithoutFeedback>
      </View>
    </View>
  ) : mediaArray[0].type === 'video' ? (
    <View style={localStyle.container}>
      <Image
        style={localStyle.showVideo}
        source={
          mediaArray?.length >= 1
            ? {uri: mediaArray[0]?.preview_image_url}
            : null
        }
        resizeMode={'cover'}
      />
      <TouchableWithoutFeedback
        onPress={() => {
          navigation.navigate(ScreenName.VideoPlayerScreen, {
            videoUrl: videoUrl,
            aspectRatio: aspectRatio,
          });
        }}>
        <View style={localStyle.iconBox}>
          <Image source={PlayIcon} style={localStyle.playIcon} />
        </View>
      </TouchableWithoutFeedback>
    </View>
  ) : null;
}
const styles = {
  container: {
    marginTop: layoutPtToPx(8),
    overflow: 'hidden',
    width: '100%',
    height: layoutPtToPx(234),
    borderRadius: layoutPtToPx(4),
    backgroundColor: getColorWithOpacity(colors.BlackPearl, 0.2),
  },
  defaultImage: {
    height: '100%',
    width: '100%',
  },
  flex1: {
    flex: 1,
  },
  showImage: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: 'white',
    borderRadius: 4,
  },
  showVideo: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: 'white',
    borderRadius: 4,
    aspectRatio: 1,
  },
  flexRow: {
    flex: 1,
    flexDirection: 'row',
  },
  hideImage: {
    flex: 0,
  },
  iconBox: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  playIcon: {
    height: 50,
    width: 50,
    tintColor: colors.GoldenTainoi,
  },
};
export default React.memo(ImageCard);
