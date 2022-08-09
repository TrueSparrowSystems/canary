import React from 'react';
import {
  Pressable,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import SearchBar from '../../components/SearchBar';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import colors from '../../constants/colors';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import useDiscoverScreenData from './useDiscoverScreenData';
import fonts from '../../constants/fonts';
import * as Animatable from 'react-native-animatable';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

function DiscoverScreen() {
  const localStyle = useStyleProcessor(styles, 'DiscoverScreen');
  const {
    aTrendingTopics,
    bIsLoading,
    sTextInputError,
    sSelectedCountryName,
    fnOnSearchPress,
    fnOnTopicClick,
    fnOnRefresh,
    fnNavigateToLocationSelectionScreen,
  } = useDiscoverScreenData();
  return (
    <KeyboardAwareScrollView style={localStyle.container}>
      <SearchBar onSearchPressCallback={fnOnSearchPress} />
      <Text style={localStyle.errorText}>{sTextInputError}</Text>
      {sSelectedCountryName ? (
        <View style={localStyle.trendingCountryContainer}>
          <Text style={localStyle.trendingCountryText}>
            Trending {sSelectedCountryName}
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={fnNavigateToLocationSelectionScreen}>
            <Text style={localStyle.changeLocationText}>Change location</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      <ScrollView
        contentContainerStyle={localStyle.trendingTopicList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={bIsLoading} onRefresh={fnOnRefresh} />
        }>
        {aTrendingTopics.map((text, i) => {
          return (
            <Animatable.View key={i} animation="fadeIn">
              <Pressable
                onPress={() => {
                  fnOnTopicClick(text);
                }}
                style={localStyle.trendingTopicBox}>
                <Text style={localStyle.topicText}>{text}</Text>
              </Pressable>
            </Animatable.View>
          );
        })}
      </ScrollView>
    </KeyboardAwareScrollView>
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
    paddingVertical: layoutPtToPx(16),
    marginHorizontal: layoutPtToPx(20),
  },
  topicText: {
    fontSize: fontPtToPx(14),
    color: colors.BlackPearl,
    fontFamily: fonts.InterRegular,
    lineHeight: layoutPtToPx(17),
  },
  trendingTopicList: {
    paddingBottom: '1%',
  },
  trendingCountryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: layoutPtToPx(20),
    marginTop: layoutPtToPx(20),
    marginBottom: layoutPtToPx(10),
  },
  trendingCountryText: {
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(18),
    lineHeight: layoutPtToPx(22),
    flexShrink: 1,
    color: colors.BlackPearl,
  },
  changeLocationText: {
    flexGrow: 1,
    fontFamily: fonts.InterSemiBold,
    fontSize: fontPtToPx(14),
    lineHeight: layoutPtToPx(22),
    color: colors.GoldenTainoi,
    paddingLeft: layoutPtToPx(5),
  },
  errorText: {
    fontFamily: fonts.InterRegular,
    color: colors.BitterSweet,
    fontSize: fontPtToPx(14),
    alignSelf: 'center',
    marginTop: layoutPtToPx(2),
  },
};

export default React.memo(DiscoverScreen);
