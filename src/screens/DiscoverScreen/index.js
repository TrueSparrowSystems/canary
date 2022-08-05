import React from 'react';
import {
  Pressable,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import SearchBar from '../../components/SearchBar';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import colors from '../../constants/colors';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import useDiscoverScreenData from './useDiscoverScreenData';
import fonts from '../../constants/fonts';
import * as Animatable from 'react-native-animatable';

function DiscoverScreen() {
  const localStyle = useStyleProcessor(styles, 'DiscoverScreen');
  const {
    aTrendingTopics,
    sSelectedCountryName,
    fnOnSearchPress,
    fnOnTopicClick,
    fnNavigateToLocationSelectionScreen,
  } = useDiscoverScreenData();
  return (
    <View style={localStyle.container}>
      <SearchBar onSearchPressCallback={fnOnSearchPress} />
      <View style={localStyle.trendingCountryContainer}>
        <Text style={localStyle.trendingCountryText}>
          Trending {sSelectedCountryName}
        </Text>
        <TouchableOpacity onPress={fnNavigateToLocationSelectionScreen}>
          <Text style={localStyle.changeLocationText}>Change location</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={localStyle.trendingTopicList}
        showsVerticalScrollIndicator={false}>
        {aTrendingTopics.map((text, i) => {
          return (
            <Animatable.View animation="fadeIn">
              <Pressable
                onPress={() => {
                  fnOnTopicClick(text);
                }}
                key={i}
                style={localStyle.trendingTopicBox}>
                <Text style={localStyle.topicText}>{text}</Text>
              </Pressable>
            </Animatable.View>
          );
        })}
      </ScrollView>
    </View>
  );
}
const styles = {
  container: {
    backgroundColor: colors.White,
    flex: 1,
  },
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
    paddingBottom: layoutPtToPx(100),
  },
  trendingCountryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: layoutPtToPx(20),
    marginTop: layoutPtToPx(20),
    marginBottom: layoutPtToPx(10),
  },
  trendingCountryText: {
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(18),
  },
  changeLocationText: {
    fontFamily: fonts.InterSemiBold,
    fontSize: fontPtToPx(14),
    color: colors.GoldenTainoi,
  },
};

export default React.memo(DiscoverScreen);
