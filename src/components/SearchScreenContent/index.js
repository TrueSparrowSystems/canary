import React from 'react';
import {Text, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import SearchBar from '../SearchBar';
import useSearchScreenContentData from './useSearchScreenContentData';
import * as Animatable from 'react-native-animatable';
import {RefreshControl, TouchableOpacity, Pressable} from '@plgworks/applogger';

function SearchScreenContent(props) {
  const {style} = props;
  const localStyle = useStyleProcessor(styles, 'SearchScreenContent');
  const {
    aTrendingTopics,
    bIsLoading,
    sTextInputError,
    sSelectedCountryName,
    fnOnSearchPress,
    fnOnTopicClick,
    fnOnRefresh,
    fnNavigateToLocationSelectionScreen,
  } = useSearchScreenContentData();
  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      style={style || localStyle.container}
      refreshControl={
        <RefreshControl
          testID="search_screen"
          refreshing={bIsLoading}
          onRefresh={fnOnRefresh}
        />
      }>
      <SearchBar
        testID="search_screen"
        onSearchPressCallback={fnOnSearchPress}
      />
      <Text style={localStyle.errorText}>{sTextInputError}</Text>
      {sSelectedCountryName ? (
        <View style={localStyle.trendingCountryContainer}>
          <Text style={localStyle.trendingCountryText}>
            Trending {sSelectedCountryName}
          </Text>

          <TouchableOpacity
            testID="search_screen_change_location"
            activeOpacity={0.8}
            onPress={fnNavigateToLocationSelectionScreen}>
            <Text style={localStyle.changeLocationText}>Change Location</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      <View style={localStyle.trendingTopicList}>
        {aTrendingTopics.map((text, i) => {
          return (
            <Animatable.View key={i} animation="fadeIn">
              <Pressable
                testID={`trending_topic_${text}`}
                onPress={() => {
                  fnOnTopicClick(text);
                }}
                style={localStyle.trendingTopicBox}>
                <Text style={localStyle.topicText}>{text}</Text>
              </Pressable>
            </Animatable.View>
          );
        })}
      </View>
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

export default React.memo(SearchScreenContent);
