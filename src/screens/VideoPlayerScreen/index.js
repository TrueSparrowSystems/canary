import React, {useMemo} from 'react';
import {View} from 'react-native';
import Video from 'react-native-video';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
// import VideoPlayer from 'react-native-video-player';

function VideoPlayerScreen(props) {
  const {videoUrl, aspectRatio} = props?.route?.params;
  const localStyle = useStyleProcessor(styles, 'VideoPlayerScreen');
  const videoStyle = useMemo(
    () => [localStyle.video, {aspectRatio: aspectRatio[0] / aspectRatio[1]}],
    [aspectRatio, localStyle.video],
  );
  return (
    <View style={localStyle.container}>
      <Video source={{uri: videoUrl}} style={videoStyle} />
    </View>
  );
}
const styles = {
  container: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  video: {width: '100%'},
};
export default React.memo(VideoPlayerScreen);
