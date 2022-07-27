import React from 'react';
import {Pressable, Text, View} from 'react-native';
import SearchBar from '../../components/SearchBar';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import colors from '../../utils/colors';
import {fontPtToPx} from '../../utils/responsiveUI';
import useDiscoverScreenData from './useDiscoverScreenData';

function DiscoverScreen() {
  const localStyle = useStyleProcessor(styles, 'DiscoverScreen');
  const {aTrendingTopics, fnOnSearchPress, fnOnTopicClick} =
    useDiscoverScreenData();
  return (
    <View>
      <SearchBar onSearchPressCallback={fnOnSearchPress} />
      {aTrendingTopics.map((text, i) => {
        return (
          <Pressable
            onPress={() => {
              fnOnTopicClick(text);
            }}
            key={i}
            style={localStyle.trendingTopicBox}>
            <Text style={localStyle.topicText}>{text}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
const styles = {
  trendingTopicBox: {
    borderBottomWidth: 1,
    borderColor: colors.LightGrey,
    padding: 10,
    margin: 10,
    marginBottom: 0,
  },
  topicText: {
    fontSize: fontPtToPx(14),
    color: colors.Black,
  },
};

export default React.memo(DiscoverScreen);
