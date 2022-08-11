import {useCallback, useRef, useState} from 'react';
import {SortOrder} from '../../api/helpers/TwitterAPI';
import SearchResultListDataSource from './SearchResultListDataSource';

function useSearchResultScreenData({searchQuery = ''}) {
  const [query, setQuery] = useState(searchQuery);
  const [isLoading, setIsLoading] = useState(true);
  const [textInputError, setTextInputError] = useState('');
  const listDataSource = useRef(null);

  const sortOrder = useRef(SortOrder.Recency);

  if (listDataSource.current === null) {
    listDataSource.current = new SearchResultListDataSource(query);
  }
  const onSearchPress = useCallback(newQuery => {
    if (newQuery.trim() === '') {
      setTextInputError('Please Enter Something to Search');
    } else {
      setTextInputError('');
      listDataSource.current.onQueryChange(newQuery);
      setQuery(newQuery);
      setIsLoading(true);
    }
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
    bIsLoading: isLoading,
    bIsSortingPopular: sortOrder.current === SortOrder.Relevancy,
    sTextInputError: textInputError,
    searchResultListDataSource: listDataSource.current,
    fnOnSearchPress: onSearchPress,
    fnToggleSortOrder: toggleSortOrder,
    fnOnDataAvailable: onDataAvailable,
  };
}
export default useSearchResultScreenData;
