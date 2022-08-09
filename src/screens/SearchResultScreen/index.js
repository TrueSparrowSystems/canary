import React, {useMemo} from 'react';
import {ActivityIndicator, SafeAreaView, Text, View} from 'react-native';
import Header from '../../components/common/Header';
import SearchBar from '../../components/SearchBar';
import TimelineList from '../../components/TimelineList';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import colors, {getColorWithOpacity} from '../../constants/colors';
import useSearchResultScreenData from './useSearchResultScreenData';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import RoundedButton from '../../components/common/RoundedButton';
import {NewIcon, PopularIcon} from '../../assets/common';
import fonts from '../../constants/fonts';

function SearchResultScreen(props) {
  const {query} = props?.route?.params;
  const localStyle = useStyleProcessor(styles, 'SearchResultScreen');
  const {
    bIsLoading,
    searchResultListDataSource,
    bIsSortingPopular,
    fnToggleSortOrder,
    fnOnSearchPress,
    fnOnDataAvailable,
  } = useSearchResultScreenData({
    searchQuery: query,
  });

  const ListEmptyComponent = useMemo(() => {
    return (
      <View style={localStyle.emptyContainer}>
        <Text style={localStyle.emptyScreenTextStyle}>No results found</Text>
      </View>
    );
  }, [localStyle.emptyContainer, localStyle.emptyScreenTextStyle]);

  return (
    <SafeAreaView style={localStyle.flex1}>
      <Header enableBackButton={true} />
      <View style={localStyle.toggleButtonsContainer}>
        <RoundedButton
          text="Popular"
          leftImage={PopularIcon}
          style={[
            localStyle.toggleButton,
            bIsSortingPopular ? localStyle.selectedToggleButton : {},
          ]}
          disabled={bIsSortingPopular}
          shouldReduceOpacityWhenDisabled={false}
          textStyle={localStyle.toggleButtonText}
          leftImageStyle={localStyle.toggleButtonIcon}
          onPress={fnToggleSortOrder}
          underlayColor={colors.GoldenTainoi20}
        />
        <RoundedButton
          text="New"
          leftImage={NewIcon}
          onPress={fnToggleSortOrder}
          style={[
            localStyle.toggleButton,
            !bIsSortingPopular ? localStyle.selectedToggleButton : {},
          ]}
          shouldReduceOpacityWhenDisabled={false}
          disabled={!bIsSortingPopular}
          textStyle={localStyle.toggleButtonText}
          leftImageStyle={localStyle.toggleButtonIcon}
          underlayColor={colors.GoldenTainoi20}
        />
      </View>
      <SearchBar searchQuery={query} onSearchPressCallback={fnOnSearchPress} />
      {bIsLoading ? (
        <View style={localStyle.loaderView}>
          <ActivityIndicator animating={bIsLoading} />
        </View>
      ) : null}
      <TimelineList
        style={localStyle.listStyle}
        timelineListDataSource={searchResultListDataSource}
        refreshData={bIsLoading}
        onDataAvailable={fnOnDataAvailable}
        listEmptyComponent={ListEmptyComponent}
      />
    </SafeAreaView>
  );
}

const styles = {
  flex1: {
    flex: 1,
    backgroundColor: colors.White,
  },
  listStyle: {
    flex: 1,
    marginTop: 10,
  },
  loaderView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButtonsContainer: {
    position: 'absolute',
    width: '100%',
    height: layoutPtToPx(50),
    justifyContent: 'center',
    flexDirection: 'row',
  },
  toggleButtonText: {
    textTransform: 'capitalize',
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(12),
    marginLeft: layoutPtToPx(4),
    color: colors.BlackPearl,
  },
  toggleButtonIcon: {
    height: layoutPtToPx(12),
    width: layoutPtToPx(12),
  },
  selectedToggleButton: {
    backgroundColor: colors.GoldenTainoi,
    borderColor: colors.GoldenTainoi20,
  },
  toggleButton: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: 'auto',
    backgroundColor: colors.White,
    height: layoutPtToPx(30),
    borderRadius: layoutPtToPx(30),
    borderColor: colors.BlackPearl,
    borderWidth: layoutPtToPx(1),
    paddingHorizontal: layoutPtToPx(12),
    marginHorizontal: layoutPtToPx(5),
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyScreenTextStyle: {
    fontFamily: fonts.InterRegular,
    fontSize: fontPtToPx(14),
    lineHeight: layoutPtToPx(17),
    color: getColorWithOpacity(colors.BlackPearl, 0.7),
  },
};
export default React.memo(SearchResultScreen);
