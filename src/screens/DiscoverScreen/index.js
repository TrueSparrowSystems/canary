import React from 'react';
import {Text, View} from 'react-native';
import SearchBar from '../../components/SearchBar';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {fontPtToPx} from '../../utils/responsiveUI';
import useDiscoverScreenData from './useDiscoverScreenData';

function DiscoverScreen() {
  const localStyle = useStyleProcessor(styles, 'DiscoverScreen');
  const {aTrendingTopics, fnOnSearchPress, fnOnTopicClick} =
    useDiscoverScreenData();
  return (
    <View>
      <SearchBar onSearchPressCallback={fnOnSearchPress} />
      {aTrendingTopics.map(text => {
        return (
          <Text
            onPress={() => {
              fnOnTopicClick(text);
            }}
            style={localStyle.topicTextBox}>
            {text}
          </Text>
        );
      })}
    </View>
  );
}
const styles = {
  topicTextBox: {
    borderWidth: 1,
    fontSize: fontPtToPx(14),
    padding: 10,
    margin: 10,
  },
};

export default React.memo(DiscoverScreen);
