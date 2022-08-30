import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Text, View} from 'react-native';
import {PlayIcon} from '../../assets/common';
import ScreenName from '../../constants/ScreenName';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import Image from 'react-native-fast-image';
import TwitterAPI from '../../api/helpers/TwitterAPI';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import colors, {getColorWithOpacity} from '../../constants/colors';
import Video from 'react-native-video';
import * as Animatable from 'react-native-animatable';
import fonts from '../../constants/fonts';
import {useOrientationState} from '../../hooks/useOrientation';
import {TouchableWithoutFeedback} from '@plgworks/applogger';

function ImageCard({mediaArray, tweetId}) {
  const localStyle = useStyleProcessor(styles, 'ImageCard');
  const navigation = useNavigation();
  const onImagePress = useCallback(
    index => {
      LocalEvent.emit(EventTypes.OpenImageViewer, {
        media: mediaArray,
        imageIndex: index,
      });
    },
    [mediaArray],
  );

  const [shouldPlayGif, setShouldPlayGif] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const aspectRatio = useRef(null);

  useEffect(() => {
    if (
      mediaArray[0].type === 'video' ||
      mediaArray[0].type === 'animated_gif'
    ) {
      TwitterAPI.getTweetStatusfromTweetId(tweetId)
        .then(res => {
          const videoInfo =
            res?.data?.extended_entities?.media?.[0]?.video_info;
          const videoVariantsArray = videoInfo?.variants;
          aspectRatio.current = videoInfo?.aspect_ratio;
          videoVariantsArray &&
            videoVariantsArray.map(videoVariant => {
              if (videoVariant?.content_type === 'video/mp4' && !videoUrl) {
                setVideoUrl(videoVariant.url);
              }
            });
        })
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaArray, tweetId]);
  const {isPortrait} = useOrientationState();

  const imageStyle = useMemo(() => {
    const style = [localStyle.showImage];
    switch (mediaArray.length) {
      case 1: {
        const {height, width} = mediaArray[0];

        style.push({aspectRatio: width / height});
        break;
      }
      case 2: {
        style.push({aspectRatio: 1});
        break;
      }
      case 4: {
        style.push({aspectRatio: 1.8});
        break;
      }
    }
    return style;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStyle.showImage, mediaArray, isPortrait]);

  const containerStyle = useMemo(() => {
    const style = [localStyle.flexRow];

    switch (mediaArray.length) {
      case 3: {
        style.push({aspectRatio: 2});
        break;
      }
    }

    return style;
  }, [localStyle.flexRow, mediaArray.length]);

  const gifAspectRatio = useMemo(
    () =>
      aspectRatio.current ? aspectRatio.current[0] / aspectRatio.current[1] : 1,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [videoUrl],
  );

  return mediaArray[0].type === 'photo' ? (
    <Animatable.View animation={'fadeIn'} style={localStyle.container}>
      <View style={containerStyle}>
        <TouchableWithoutFeedback
          testID={`${tweetId}_tweet_image_card_1st_index_image`}
          onPress={() => {
            onImagePress(0);
          }}>
          <Image
            style={imageStyle}
            source={mediaArray?.length >= 1 ? {uri: mediaArray[0]?.url} : null}
            resizeMode={'cover'}
          />
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback
          testID={`${tweetId}_tweet_image_card_2nd_index_image`}
          onPress={() => {
            onImagePress(1);
          }}>
          <Image
            style={mediaArray?.length >= 2 ? imageStyle : localStyle.hideImage}
            source={mediaArray?.length >= 2 ? {uri: mediaArray[1]?.url} : null}
            resizeMode={'cover'}
          />
        </TouchableWithoutFeedback>
      </View>
      <View
        style={mediaArray?.length >= 3 ? containerStyle : localStyle.hideImage}>
        <TouchableWithoutFeedback
          testID={`${tweetId}_tweet_image_card_3rd_index_image`}
          onPress={() => {
            onImagePress(2);
          }}>
          <Image
            style={mediaArray?.length >= 3 ? imageStyle : localStyle.hideImage}
            source={mediaArray?.length >= 3 ? {uri: mediaArray[2]?.url} : null}
            resizeMode={'cover'}
          />
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback
          testID={`${tweetId}_tweet_image_card_4th_index_image`}
          onPress={() => {
            onImagePress(3);
          }}>
          <Image
            style={mediaArray?.length >= 4 ? imageStyle : localStyle.hideImage}
            source={mediaArray?.length >= 4 ? {uri: mediaArray[3]?.url} : null}
            resizeMode={'cover'}
          />
        </TouchableWithoutFeedback>
      </View>
    </Animatable.View>
  ) : mediaArray[0].type === 'video' ? (
    <Animatable.View animation={'fadeIn'} style={localStyle.container}>
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
        testID={`${tweetId}_tweet_video_card_play`}
        onPress={() => {
          navigation.navigate(ScreenName.VideoPlayerScreen, {
            videoUrl: videoUrl,
            aspectRatio: aspectRatio.current,
          });
        }}>
        <View style={localStyle.iconBox}>
          <Image source={PlayIcon} style={localStyle.playIcon} />
        </View>
      </TouchableWithoutFeedback>
    </Animatable.View>
  ) : mediaArray[0].type === 'animated_gif' && videoUrl ? (
    <Animatable.View animation={'fadeIn'} style={localStyle.container}>
      {shouldPlayGif ? (
        <Video
          source={{uri: videoUrl}}
          style={[
            localStyle.showGif,
            {
              aspectRatio: gifAspectRatio,
            },
          ]}
          repeat={true}
        />
      ) : (
        <Image
          style={[
            localStyle.showGif,
            {
              aspectRatio: gifAspectRatio,
            },
          ]}
          source={
            mediaArray?.length >= 1
              ? {uri: mediaArray[0]?.preview_image_url}
              : null
          }
          resizeMode={'cover'}
        />
      )}

      {shouldPlayGif ? null : (
        <TouchableWithoutFeedback
          testID={`${tweetId}_tweet_image_card_GIF`}
          onPress={() => {
            setShouldPlayGif(true);
          }}>
          <View style={localStyle.iconBox}>
            <View style={localStyle.gifIconContainer}>
              <Text style={localStyle.gifText}>GIF</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </Animatable.View>
  ) : null;
}
const styles = {
  container: {
    marginTop: layoutPtToPx(8),
    overflow: 'hidden',
    width: '100%',
    height: 'auto',
    borderRadius: layoutPtToPx(4),
    backgroundColor: colors.EarlyDawn,
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
    tablet: {
      borderWidth: 1,
      landscape: {
        borderWidth: 2,
      },
    },
  },
  showVideo: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: 'white',
    borderRadius: 4,
    aspectRatio: 1,
  },
  showGif: {
    borderWidth: 0.5,
    borderColor: 'white',
    borderRadius: 4,
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
  gifIconContainer: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: getColorWithOpacity(colors.White, 0.6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  gifText: {
    fontFamily: fonts.SoraBold,
    fontSize: fontPtToPx(14),
    color: colors.OxfordBlue,
    letterSpacing: 1.2,
  },
};
export default React.memo(ImageCard);
