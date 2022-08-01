import React from 'react';
import {Pressable, Text, View, ScrollView} from 'react-native';
import SearchBar from '../../components/SearchBar';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import colors from '../../constants/colors';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import useDiscoverScreenData from './useDiscoverScreenData';

function DiscoverScreen() {
  const localStyle = useStyleProcessor(styles, 'DiscoverScreen');
  const {aTrendingTopics, fnOnSearchPress, fnOnTopicClick} =
    useDiscoverScreenData();
  return (
    <View>
      <SearchBar onSearchPressCallback={fnOnSearchPress} />
      <ScrollView
        contentContainerStyle={localStyle.trendingTopicList}
        showsVerticalScrollIndicator={false}>
        {aTrendingTopics.map((text, i) => {
          return (
            <Pressable
              onPress={() => {
                fnOnTopicClick(text);
              }}
              key={i}
              style={localStyle.trendingTopicBox}>
              <Text style={localStyle.topicText}>
                {i + 1}. {text}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
const styles = {
  trendingTopicBox: {
    borderBottomWidth: 1,
    borderColor: colors.LightGrey,
    padding: layoutPtToPx(10),
    margin: layoutPtToPx(10),
    marginBottom: 0,
  },
  topicText: {
    fontSize: fontPtToPx(14),
    color: colors.Black,
  },
  trendingTopicList: {
    paddingBottom: layoutPtToPx(50),
  },
};

export default React.memo(DiscoverScreen);
