import React, {useMemo} from 'react';
import {StatusBar, View} from 'react-native';
import Video from 'react-native-video';
import {
  VideoPlayer,
  DefaultMainControl,
  DefaultBottomControlsBar,
} from 'react-native-true-sight';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {useNavigation} from '@react-navigation/native';
import {CrossIcon} from '../../assets/common';
import colors from '../../constants/colors';

function VideoPlayerScreen(props) {
  const {videoUrl, aspectRatio} = props?.route?.params;
  const localStyle = useStyleProcessor(styles, 'VideoPlayerScreen');
  const videoStyle = useMemo(
    () => [localStyle.video, {aspectRatio: aspectRatio[0] / aspectRatio[1]}],
    [aspectRatio, localStyle.video],
  );

  const navigation = useNavigation();

  return (
    <View style={localStyle.container}>
      <StatusBar hidden={true} />

      <VideoPlayer
        autoStart={true}
        mainControl={args => (
          <DefaultMainControl restartButton={true} {...args} />
        )}
        onClose={() => {
          navigation.goBack();
        }}
        crossIcon={CrossIcon}
        bottomControl={args => (
          <DefaultBottomControlsBar {...args} barColor={colors.GoldenTainoi} />
        )}>
        {args => (
          <Video
            style={videoStyle}
            ref={args.playerRef}
            source={{uri: videoUrl}}
            paused={args.videoPaused}
            onLoad={args.onLoad}
            onProgress={args.onProgress}
            onEnd={args.onEnd}
          />
        )}
      </VideoPlayer>
    </View>
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
