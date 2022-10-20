import {useCallback, useRef, useState} from 'react';
import {Constants} from '../../constants/Constants';
import AnalyticsService from '../../services/AnalyticsService';

import SearchResultListDataSource from './SearchResultListDataSource';

function useSearchResultScreenData({searchQuery = '', sortOrder}) {
  const [query, setQuery] = useState(searchQuery);
  const [isLoading, setIsLoading] = useState(true);
  const [textInputError, setTextInputError] = useState('');
  const listDataSource = useRef(null);

  const _sortOrder = useRef(sortOrder);

  if (listDataSource.current === null) {
    listDataSource.current = new SearchResultListDataSource(
      query,
      _sortOrder.current,
    );
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
    AnalyticsService.track(
      Constants.TrackerConstants.EventEntities.Button +
        '_' +
        'toggle_sort_order',
      Constants.TrackerConstants.EventActions.Press,
      {
        sort_order:
          _sortOrder.current === Constants.SortOrder.Recency
            ? 'popular'
            : 'new',
      },
    );

    _sortOrder.current =
      _sortOrder.current === Constants.SortOrder.Recency
        ? Constants.SortOrder.Relevancy
        : Constants.SortOrder.Recency;

    listDataSource.current.onSortOrderChange?.(_sortOrder.current);

    setIsLoading(true);
  }, []);

  const onDataAvailable = useCallback(() => {
    setIsLoading(false);
  }, []);

  return {
    bIsLoading: isLoading,
    bIsSortingPopular: _sortOrder.current === Constants.SortOrder.Relevancy,
    sTextInputError: textInputError,
    searchResultListDataSource: listDataSource.current,
    fnOnSearchPress: onSearchPress,
    fnToggleSortOrder: toggleSortOrder,
    fnOnDataAvailable: onDataAvailable,
  };
}
export default useSearchResultScreenData;
