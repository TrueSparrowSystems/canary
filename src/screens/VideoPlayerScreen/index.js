import React, {useEffect, useMemo, useRef, useState} from 'react';
import {BackHandler, Modal, StatusBar, View} from 'react-native';
import Video from 'react-native-video';
import {
  VideoPlayer,
  DefaultMainControl,
  DefaultBottomControlsBar,
} from 'react-native-true-sight';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {CrossIcon} from '../../assets/common';
import colors from '../../constants/colors';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';

function VideoPlayerScreen(props) {
  const localStyle = useStyleProcessor(styles, 'VideoPlayerScreen');

  const [isVisible, setIsVisible] = useState(false);
  const videoUrl = useRef('');
  const aspectRatio = useRef(null);
  useEffect(() => {
    const launchModal = payload => {
      setIsVisible(true);
      videoUrl.current = payload?.videoUrl;
      aspectRatio.current = payload?.aspectRatio;
    };

    LocalEvent.on(EventTypes.OpenVideoPlayer, launchModal);
    return () => {
      LocalEvent.off(EventTypes.OpenVideoPlayer, launchModal);
    };
  }, []);

  const videoStyle = useMemo(
    () => [
      localStyle.video,
      {
        aspectRatio: aspectRatio.current
          ? aspectRatio.current?.[0] / aspectRatio.current?.[1]
          : 1,
      },
    ],
    [aspectRatio, localStyle.video],
  );

  /**
   * Subscribe to back button press.
   */
  useEffect(() => {
    if (isVisible) {
      const onBackPress = () => {
        setIsVisible(false);
        return true;
      };
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );
      return () => {
        subscription.remove();
      };
    }
  }, [isVisible]);

  return (
    <Modal visible={isVisible} animationType="slide" hardwareAccelerated={true}>
      <StatusBar hidden={true} />
      <View style={localStyle.container}>
        <VideoPlayer
          autoStart={true}
          mainControl={args => (
            <DefaultMainControl restartButton={true} {...args} />
          )}
          onClose={() => {
            setIsVisible(false);
          }}
          crossIcon={CrossIcon}
          bottomControl={args => (
            <DefaultBottomControlsBar
              {...args}
              barColor={colors.GoldenTainoi}
              joyStickColor={colors.White}
            />
          )}>
          {args => (
            <Video
              style={videoStyle}
              ref={args.playerRef}
              source={{uri: videoUrl.current}}
              paused={args.videoPaused}
              onLoad={args.onLoad}
              onProgress={args.onProgress}
              onEnd={args.onEnd}
            />
          )}
        </VideoPlayer>
      </View>
    </Modal>
  );
}
const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.Black,
  },
  video: {
    width: '100%',
  },
};
export default React.memo(VideoPlayerScreen);
