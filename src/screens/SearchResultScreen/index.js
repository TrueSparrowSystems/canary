import React from 'react';
import {SafeAreaView} from 'react-native';
import Header from '../../components/common/Header';
import SearchBar from '../../components/SearchBar';
import TimelineList from '../../components/TimelineList';
import useSearchResultScreenData from './useSearchResultScreenData';

function SearchResultScreen(props) {
  const {query} = props?.route?.params;
  const {
    bIsLoading,
    fnOnSearchPress,
    searchResultListDataSource,
    fnOnDataAvailable,
  } = useSearchResultScreenData({
    searchQuery: query,
  });
  return (
    <SafeAreaView style={{flex: 1}}>
      <Header enableBackButton={true} text={'Search Result Screen'} />
      <SearchBar searchQuery={query} onSearchPressCallback={fnOnSearchPress} />
      <TimelineList
        timelineListDataSource={searchResultListDataSource}
        refreshData={bIsLoading}
        onDataAvailable={fnOnDataAvailable}
      />
    </SafeAreaView>
  );
}
export default React.memo(SearchResultScreen);
