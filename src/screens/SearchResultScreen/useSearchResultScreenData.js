import {useCallback, useRef, useState} from 'react';
import SearchResultListDataSource from './SearchResultListDataSource';

function useSearchResultScreenData({searchQuery = ''}) {
  const [query, setQuery] = useState(searchQuery);
  const [isLoading, setIsLoading] = useState(false);
  const listDataSource = useRef(null);
  if (listDataSource.current === null) {
    listDataSource.current = new SearchResultListDataSource(query);
  }
  const onSearchPress = useCallback(newQuery => {
    listDataSource.current.onQueryChange(newQuery);
    setQuery(newQuery);
    setIsLoading(true);
  }, []);

  const onDataAvailable = useCallback(() => {
    setIsLoading(false);
  }, []);

  return {
    fnOnSearchPress: onSearchPress,
    searchResultListDataSource: listDataSource.current,
    bIsLoading: isLoading,
    fnOnDataAvailable: onDataAvailable,
  };
}
export default useSearchResultScreenData;
