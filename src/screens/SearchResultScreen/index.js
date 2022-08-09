import React, {useMemo} from 'react';
import {ActivityIndicator, SafeAreaView, Text, View} from 'react-native';
import Header from '../../components/common/Header';
import SearchBar from '../../components/SearchBar';
import TimelineList from '../../components/TimelineList';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import colors, {getColorWithOpacity} from '../../constants/colors';
import useSearchResultScreenData from './useSearchResultScreenData';
import fonts from '../../constants/fonts';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';

function SearchResultScreen(props) {
  const {query} = props?.route?.params;
  const localStyle = useStyleProcessor(styles, 'SearchResultScreen');
  const {
    bIsLoading,
    fnOnSearchPress,
    searchResultListDataSource,
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
      <Header enableBackButton={true} text={'Tweet Screen'} />
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
