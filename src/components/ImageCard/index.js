import {useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {TouchableWithoutFeedback, View} from 'react-native';
import Toast from 'react-native-toast-message';
import {PlayIcon} from '../../assets/common';
import ScreenName from '../../constants/ScreenName';
import {ToastPosition, ToastType} from '../../constants/ToastConstants';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import Image from 'react-native-fast-image';

function ImageCard({mediaArray}) {
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
        style={localStyle.showImage}
        source={
          mediaArray?.length >= 1
            ? {uri: mediaArray[0]?.preview_image_url}
            : null
        }
        resizeMode={'cover'}
      />
      <TouchableWithoutFeedback
        onPress={() => {
          Toast.show({
            type: ToastType.Info,
            text1: 'This video is not playable',
            position: ToastPosition.Top,
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
    overflow: 'hidden',
    width: '100%',
    height: 250,
    borderRadius: 6,
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
  },
};
export default React.memo(ImageCard);
