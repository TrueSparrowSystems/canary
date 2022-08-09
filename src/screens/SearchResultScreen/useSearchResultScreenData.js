import {useCallback, useRef, useState} from 'react';
import {SortOrder} from '../../api/helpers/TwitterAPI';
import SearchResultListDataSource from './SearchResultListDataSource';

function useSearchResultScreenData({searchQuery = ''}) {
  const [query, setQuery] = useState(searchQuery);
  const [isLoading, setIsLoading] = useState(true);
  const listDataSource = useRef(null);

  const sortOrder = useRef(SortOrder.Recency);

  if (listDataSource.current === null) {
    listDataSource.current = new SearchResultListDataSource(query);
  }
  const onSearchPress = useCallback(newQuery => {
    listDataSource.current.onQueryChange(newQuery);
    setQuery(newQuery);
    setIsLoading(true);
  }, []);

  const toggleSortOrder = useCallback(() => {
    sortOrder.current =
      sortOrder.current === SortOrder.Recency
        ? SortOrder.Relevancy
        : SortOrder.Recency;

    listDataSource.current.onSortOrderChange?.(sortOrder.current);

    setIsLoading(true);
  }, []);

  const onDataAvailable = useCallback(() => {
    setIsLoading(false);
  }, []);

  return {
    searchResultListDataSource: listDataSource.current,
    bIsLoading: isLoading,
    bIsSortingPopular: sortOrder.current === SortOrder.Relevancy,
    fnOnSearchPress: onSearchPress,
    fnToggleSortOrder: toggleSortOrder,
    fnOnDataAvailable: onDataAvailable,
  };
}
export default useSearchResultScreenData;
