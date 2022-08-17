import {useIsFocused} from '@react-navigation/native';
import {useCallback, useState, useRef, useEffect} from 'react';
import {useOrientation} from '../../hooks/useOrientation';

export const PLACE_HOLDER_CELL = 'flat_list_place_holder_cell';
/**
 * PaginatedList component data hook.
 * @param {Object} The Object required for this hook.
 * - dataSource: Data source for the paginated list.
 * - onFlatListDataChange: A callback when the flat list data changes.
 * - refreshData: A boolean to indicate the refresh of the data, call API.
 * - reloadData: A boolean to indicate the refresh of UI data without API call.
 * - flatListProps: Props for the underlying flatlist.
 */
export function usePaginatedListData({
  dataSource,
  onFlatListDataChange,
  refreshData,
  reloadData,
  numColumns,
  flatListProps,
  useRecyclerView,
}) {
  const {isPortrait} = useOrientation();

  // Check if the component is mounted.
  const shouldUpdateState = useRef();
  const isFocused = useIsFocused();

  const contentSize = useRef();
  const layoutSize = useRef();

  // The default ref and state values.
  const defaultRefValues = {
    reloadIdentifier: 0,
    consumedData: {},
    allData: [],
    filteredData: [],
    rawData: [],
    isLoadingFirstPage: false,
    isLoadMoreInProgress: false,
    shouldTriggerNextPage: false,
    hasNextPageData: true,
    refreshRefValue: false,
    reloadRefValue: false,
    isFirstPageReceived: false,
    requestSessionId: null,
    nextPageIdentifier: null,
    nextPageLoadMoreViewRef: null,
    stateRef: {
      reloadIdentifier: 0,
      isLoading: true,
      isRefreshing: false,
      showErrorView: false,
      showLoaderErrorView: false,
      showEmptyView: false,
      listData: [],
      dataProvider: dataSource.dataProvider,
    },
  };

  useEffect(() => {
    shouldUpdateState.current = true;
    return () => {
      shouldUpdateState.current = false;
    };
  }, []);

  // Reference used in this hook
  const componentRef = useRef(null);
  if (componentRef.current === null) {
    componentRef.current = dataSource.getComponentData() || defaultRefValues;
  }

  // Initial index of the flat list.
  let initialIndex = useRef(-1);
  if (initialIndex.current === -1 || dataSource.resetInitialIndex) {
    const indexData = dataSource?.getInitialIndex();
    if (indexData) {
      initialIndex.current = isPortrait
        ? indexData.portrait || 0
        : indexData.landscape || 0;
    } else {
      initialIndex.current = 0;
    }
  }

  // States used in this hook
  const [componentState, setComponentState] = useState(
    componentRef.current.stateRef,
  );

  const updateComponentData = useCallback(
    newStates => {
      if (useRecyclerView) {
        newStates.dataProvider = newStates.dataProvider.cloneWithRows(
          newStates.listData,
        );
      }
      shouldUpdateState.current && setComponentState(newStates);
      dataSource &&
        dataSource.setComponentData &&
        dataSource.setComponentData(componentRef.current);
    },
    [dataSource, useRecyclerView],
  );

  const nextPageApiErrorReceived = useCallback(() => {
    const newStates = {...componentRef.current.stateRef};
    newStates.listData = [...componentRef.current.filteredData];
    newStates.showErrorView = false;
    newStates.showLoaderErrorView = false;
    newStates.showEmptyView = false;

    if (componentRef.current.isLoadingFirstPage === true) {
      newStates.showErrorView = true;
    } else {
      newStates.showLoaderErrorView = true;
    }
    componentRef.current.stateRef = newStates;
    updateComponentData(newStates);
  }, [updateComponentData]);

  const filterAllData = useCallback(
    ({allData}) => {
      return dataSource.filterAllData?.({allData});
    },
    [dataSource],
  );

  const nextPageDataReceived = useCallback(
    res => {
      // If the date is not received then its an error.
      // if (!res || !res.data || !res.data.success) {
      //   nextPageApiErrorReceived();
      //   return;
      // }

      const response = dataSource.onResponse ? dataSource.onResponse(res) : res;

      const {data} = response;
      // Update the next page identifier.
      componentRef.current.nextPageIdentifier = data.meta?.next_token || null;

      // Update the next page available data.
      componentRef.current.hasNextPageData =
        componentRef.current.nextPageIdentifier !== null;

      // If its the first page response or the refresh, then clear the ref data.
      if (
        componentRef.current.isLoadingFirstPage ||
        componentState.isRefreshing
      ) {
        componentRef.current.consumedData = {};
        componentRef.current.allData = [];
        componentRef.current.filteredData = [];
        componentRef.current.rawData = [];
      }

      // Get the received data from the response.
      let newData = data?.data;

      // [data?.result_type] || [];
      if (newData) {
        componentRef.current.allData = [
          ...componentRef.current.allData,
          ...newData,
        ];
        // Call process data so the custom filter could be applied.
        const processedData = processData(newData, response);
        if (
          processedData.length === 0 &&
          componentRef.current.hasNextPageData
        ) {
          componentRef.current.shouldTriggerNextPage = true;
        }
        componentRef.current.filteredData = [
          ...componentRef.current.filteredData,
          ...processedData,
        ];
        const placeHolderCells = [];
        if (
          numColumns > 1 &&
          componentRef.current.filteredData.length > 0 &&
          !useRecyclerView
        ) {
          const numberOfPlaceholderCells =
            numColumns -
            (componentRef.current.filteredData.length % numColumns);
          if (numberOfPlaceholderCells > 0) {
            placeHolderCells.push(PLACE_HOLDER_CELL);
          }
        }
        const allData = [
          ...componentRef.current.filteredData,
          ...placeHolderCells,
        ];
        const filteredData = filterAllData({allData});
        componentRef.current.filteredData = filteredData;
      }
    },
    [
      componentState.isRefreshing,
      dataSource,
      filterAllData,
      numColumns,
      processData,
      useRecyclerView,
    ],
  );

  /**
   * Function to process the data. If there is any external filter logic then
   * that logic will be applied in this function.
   * This function will also filter out duplicate data.
   */
  const processData = useCallback(
    (data, response) => {
      let newData = [...data];

      // Get the new view specific data from the received raw data.

      newData = dataSource.processData({data: newData, response}) || [];

      // Filter the duplicate data.
      const newFilteredData = [];
      if (newData.length > 0) {
        newData.forEach(element => {
          if (typeof element === 'object') {
            if (!componentRef.current.consumedData[element.id]) {
              componentRef.current.consumedData[element.id] = true;
              newFilteredData.push(element);
            }
          } else {
            if (!componentRef.current.consumedData[element]) {
              componentRef.current.consumedData[element] = true;
              newFilteredData.push(element);
            }
          }
        });
      }
      return newFilteredData;
    },
    [dataSource],
  );

  /**
   * Function to reload the data without API call.
   * This function will call the external filter logic with the existing data received.
   */
  const fnReloadData = useCallback(() => {
    if (componentRef.current.allData.length === 0) {
      return;
    }
    dataSource?.updateReloadIdentifier();
    componentRef.current.reloadIdentifier = dataSource.reloadId;

    // Clear the consumed data.
    componentRef.current.consumedData = {};

    // Call process data so that the external filter logic could be applied.
    componentRef.current.filteredData = processData(
      componentRef.current.allData,
    );

    // Create the new state variables.
    const newStates = {...componentRef.current.stateRef};
    newStates.reloadIdentifier = componentRef.current.reloadIdentifier;
    newStates.listData = [...componentRef.current.filteredData];
    newStates.showErrorView = false;
    newStates.showLoaderErrorView = false;
    newStates.showEmptyView =
      componentRef.current.filteredData.length === 0 &&
      !componentRef.current.hasNextPageData;
    updateComponentData(newStates);
    // Call the function to update the parent component about the flat list data.
    if (onFlatListDataChange) {
      onFlatListDataChange(newStates.listData);
    }
  }, [dataSource, onFlatListDataChange, processData, updateComponentData]);

  /**
   * Function to load the first page using API call.
   */
  const loadFirstPage = useCallback(() => {
    // Clear the ref variable.
    componentRef.current.nextPageIdentifier = null;
    componentRef.current.previousPageIdentifier = null;
    componentRef.current.isLoadingFirstPage = true;
    componentRef.current.isLoadMoreInProgress = false;
    componentRef.current.isLoadPreviousMoreInProgress = false;
    componentRef.current.shouldTriggerNextPage = false;
    componentRef.current.shouldTriggerPreviousPage = false;
    componentRef.current.isFirstPageReceived = false;
    componentRef.current.hasNextPageData = true;
    componentRef.current.hasPreviousPageData = true;
    componentRef.current.requestSessionId = Date.now();
    if (!componentState.isLoading) {
      const newStates = {...componentRef.current.stateRef};
      newStates.isLoading = true;
      newStates.showErrorView = false;
      newStates.showLoaderErrorView = false;
      newStates.showEmptyView = false;
      componentRef.current.stateRef = newStates;

      updateComponentData(newStates);
    }

    // Call API
    loadMore();
  }, [componentState, loadMore, updateComponentData]);

  useEffect(() => {
    if (
      isFocused &&
      !componentRef.current.isFirstPageReceived &&
      !componentRef.current.isLoadingFirstPage
    ) {
      loadFirstPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  /**
   * Handle refreshing of the component.
   */
  useEffect(() => {
    if (refreshData && !componentRef.current.refreshRefValue) {
      initialIndex.current = 0;
      dataSource.clearViewData?.();
      loadFirstPage();
    }
    componentRef.current.refreshRefValue = refreshData;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshData]);

  /**
   * Handle the reload of date.
   */
  useEffect(() => {
    if (reloadData && !componentRef.current.reloadRefValue) {
      fnReloadData();
    }
    componentRef.current.reloadRefValue = reloadData;
  }, [fnReloadData, reloadData]);

  const makeNextPageAPICall = useCallback(() => {
    return new Promise(resolve => {
      const sessionId = componentRef.current.requestSessionId;
      if (dataSource.apiCall) {
        componentRef.current.isLoadMoreInProgress = true;
        componentRef.current.nextPageLoadMoreViewRef?.resume?.();
        dataSource
          .apiCall(componentRef.current.nextPageIdentifier)
          .then(response => {
            if (sessionId !== componentRef.current.requestSessionId) {
              return resolve();
            }
            nextPageDataReceived(response);
          })
          .catch(error => {
            if (sessionId !== componentRef.current.requestSessionId) {
              return resolve();
            }
            nextPageApiErrorReceived(error);
          })
          .finally(() => {
            if (sessionId !== componentRef.current.requestSessionId) {
              return resolve();
            }
            componentRef.current.isLoadingFirstPage = false;
            componentRef.current.isLoadMoreInProgress = false;
            componentRef.current.isFirstPageReceived = true;
            componentRef.current.nextPageLoadMoreViewRef?.pause?.();

            const newStates = {...componentRef.current.stateRef};
            newStates.isLoading = false;
            newStates.isRefreshing = false;
            newStates.listData = [...componentRef.current.filteredData];
            newStates.showEmptyView =
              componentRef.current.filteredData.length === 0 &&
              !componentRef.current.hasNextPageData;
            componentRef.current.stateRef = newStates;
            updateComponentData(newStates);
            if (onFlatListDataChange) {
              onFlatListDataChange(newStates.listData);
            }
            if (
              componentRef.current.shouldTriggerNextPage &&
              componentRef.current.hasNextPageData
            ) {
              componentRef.current.shouldTriggerNextPage = false;
              setTimeout(() => {
                return makeNextPageAPICall();
              }, 100);
            }
            resolve();
          });
      } else {
        resolve();
      }
    });
  }, [
    dataSource,
    nextPageApiErrorReceived,
    nextPageDataReceived,
    onFlatListDataChange,
    updateComponentData,
  ]);

  /**
   * Function to handle load more data.
   */
  const loadMore = useCallback(() => {
    // If there is not next page data then do not do anything.

    if (componentRef.current.hasNextPageData === false) {
      return Promise.resolve();
    }
    /*
     * If the load more API is already in progress, just set shouldTriggerNextPage
     * variable. So that the next API call will be triggered once then response of on going API is received.
     */
    if (componentRef.current.isLoadMoreInProgress) {
      componentRef.current.shouldTriggerNextPage = true;
      return Promise.resolve();
    }
    // Call API
    return makeNextPageAPICall();
  }, [makeNextPageAPICall]);

  /**
   * Update the visible items in the data source object, if the landscape and portrait layout are different
   * then this will be used to display for the visible items.
   */
  const onVisibleItemsChanged = useCallback(
    params => {
      dataSource.updateVisibleData && dataSource.updateVisibleData(params);
    },
    [dataSource],
  );
  /**
   * Function which checks to content height and layout height.
   * Called because onEndReached is not called until the user scrolls.
   */
  const fillScreenContent = useCallback(() => {
    if (contentSize.current?.height < layoutSize.current?.height) {
      loadMore();
    }
  }, [loadMore]);

  const onContentSizeChange = useCallback(
    (width, height) => {
      flatListProps?.onContentSizeChange?.(width, height);
      contentSize.current = {width, height};
      fillScreenContent();
    },
    [fillScreenContent, flatListProps],
  );

  const onLayout = useCallback(
    event => {
      flatListProps?.onLayout?.(event);
      const {height, width} = event.nativeEvent.layout;
      layoutSize.current = {height, width};
      fillScreenContent();
    },
    [fillScreenContent, flatListProps],
  );

  const setNextPageLoadMoreViewRef = useCallback(ref => {
    ref?.pause?.();
    componentRef.current.nextPageLoadMoreViewRef = ref;
  }, []);

  /**
   * bShowEmptyView: A boolean to show the empty view.
   * bShowErrorView: A boolean to show the error view.
   * bIsLoading: A boolean to indicate the API call is in progress.
   * bHasNextPageData: A boolean to indicate that there is more pages that could be loaded.
   * bHasPreviousPageData: A boolean to indicate that there are more pages to load.
   * bIsFirstPageReceived: A boolean to indicate that first page data was received.
   * aListData: Array for the flat list.
   * fnLoadFirstPage: A function to load first page data.
   * fnLoadMore: A function to load more data.
   * fnLoadPrevious: A function to load previous page data.
   * fnVisibleItemsChanged: A function to store the visible item data.
   * nInitialIndex: Initial index to load.
   */
  return {
    oDataProvider: componentState.dataProvider,
    bShowEmptyView: componentState.showEmptyView,
    bShowErrorView: componentState.showErrorView,
    bIsLoading: componentState.isLoading,
    bHasNextPageData: componentRef.current.hasNextPageData,
    bIsFirstPageReceived: componentRef.current.isFirstPageReceived,
    aListData: componentState.listData,
    fnLoadFirstPage: loadFirstPage,
    fnOnLayout: onLayout,
    fnOnContentSizeChange: onContentSizeChange,
    fnLoadMore: loadMore,
    fnVisibleItemsChanged: onVisibleItemsChanged,
    nInitialIndex: initialIndex.current,
    nReloadIdentifier: componentState.reloadIdentifier,
    fnSetNextPageLoadMoreViewRef: setNextPageLoadMoreViewRef,
  };
}
