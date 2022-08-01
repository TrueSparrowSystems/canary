import React, {useCallback, useMemo, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import {usePaginatedListData, PLACE_HOLDER_CELL} from './usePaginatedListData';
import {RecyclerListView} from 'recyclerlistview';
import colors from '../../constants/colors';

function PaginatedList(props) {
  // Component style
  const localStyle = useStyleProcessor(styles, 'PaginatedList');

  /**
   * Properties required for this components.
   * dataSource: Data source object for the flat list.
   * onFlatListDataChange: A callback when the flat list data changes.
   * refreshData: A boolean to indicate the refresh of the data, call API.
   * reloadData: A boolean to indicate the refresh of UI data without API call.
   */
  const {
    dataSource,
    onFlatListDataChange,
    refreshData,
    reloadData,
    useRecyclerView,
  } = props;

  /**
   * bShowErrorView: A boolean to show the error view.
   * bIsLoading: A boolean to indicate the API call is in progress.
   * bHasNextPageData: A boolean to indicate that there is more pages that could be loaded.
   * bIsFirstPageReceived: A boolean to indicate that first page data was received.
   * aListData: Array for the flat list.
   * fnLoadFirstPage: A function to load first page data.
   * fnLoadMore: A function to load more data.
   * fnVisibleItemsChanged: A function to store the visible item data.
   * nInitialIndex: Initial index to load.
   */
  let {
    oDataProvider,
    bShowErrorView,
    bShowEmptyView,
    bIsLoading,
    bHasNextPageData,
    bIsFirstPageReceived,
    aListData,
    fnLoadFirstPage,
    fnLoadMore,
    fnVisibleItemsChanged,
    nInitialIndex,
    nReloadIdentifier,
  } = usePaginatedListData({
    dataSource,
    onFlatListDataChange,
    refreshData,
    reloadData,
    numColumns:
      props.flatListProps?.numColumns ||
      props.recyclerListViewProps?.numColumns ||
      1,
    flatListProps: props.flatListProps,
    useRecyclerView,
  });

  const isHorizontal =
    props.flatListProps?.horizontal || props.recyclerListViewProps?.horizontal;

  /** Function returns error view */
  const errorView = useMemo(() => {
    return (
      props.errorView || (
        <TouchableOpacity
          onPress={fnLoadFirstPage}
          activeOpacity={0.7}
          style={localStyle.errorViewContainer}>
          <Text style={localStyle.heading}>Oops! Something went wrong</Text>
          <Text style={localStyle.subHeading}>Please tap to reload</Text>
          {/* <Image
            style={isHorizontal ? localStyle.fitHeight : localStyle.fitWidth}
            resizeMode={'contain'}
            source={SomethingWentWrongIcon}
          /> */}
        </TouchableOpacity>
      )
    );
  }, [
    fnLoadFirstPage,
    localStyle.errorViewContainer,
    localStyle.heading,
    localStyle.subHeading,
    props.errorView,
  ]);

  /** Function returns loader view */
  const loaderView = useMemo(() => {
    return (
      props.loaderView || (
        <View style={localStyle.loaderViewContainer}>
          <ActivityIndicator animating={bIsLoading} />
        </View>
      )
    );
  }, [props.loaderView, localStyle.loaderViewContainer, bIsLoading]);

  /**
   * Function that returns the loader view. Preference is given to the loader
   * view passed from the props.
   */
  const nextPageLoadMoreView = useCallback(() => {
    let loadMoreContainerStyle =
      props.loadMoreViewContainer || localStyle.loaderMoreViewContainer;
    if (isHorizontal) {
      loadMoreContainerStyle = {...loadMoreContainerStyle, height: '100%'};
    }
    return (
      <View style={loadMoreContainerStyle}>
        {bHasNextPageData && bIsFirstPageReceived ? (
          <ActivityIndicator
            animating={bHasNextPageData && bIsFirstPageReceived}
          />
        ) : null}
      </View>
    );
  }, [
    bHasNextPageData,
    bIsFirstPageReceived,
    isHorizontal,
    localStyle.loaderMoreViewContainer,
    props.loadMoreViewContainer,
  ]);

  const viewabilityConfigCallbackPairs = useRef([
    {
      viewabilityConfig: {
        minimumViewTime: 10,
        viewAreaCoveragePercentThreshold: 10,
        waitForInteraction: false,
      },
      onViewableItemsChanged: ({viewableItems}) => {
        fnVisibleItemsChanged && fnVisibleItemsChanged(viewableItems);
        props.onViewableItemsChanged &&
          props.onViewableItemsChanged(viewableItems);
      },
    },
    ...(props.viewabilityConfigCallbackPairs
      ? props.viewabilityConfigCallbackPairs
      : []),
  ]);

  const renderFlatListItem = useCallback(
    params => {
      const {item, index} = params;
      if (item === PLACE_HOLDER_CELL) {
        return <View key={`${PLACE_HOLDER_CELL}-${index}`} style={{flex: 1}} />;
      } else {
        return props.flatListProps.renderItem({item, index});
      }
    },
    [props],
  );

  const renderRecyclerItem = useCallback(
    (type, item, index, extendedState) => {
      if (item === PLACE_HOLDER_CELL) {
        // Ignore as it is handled by recycler list view.
        return null;
      } else {
        return props.recyclerListViewProps.rowRenderer({
          type,
          item,
          index,
          extendedState,
        });
      }
    },
    [props],
  );

  const keyExtractor = useCallback(
    params => {
      if (params === PLACE_HOLDER_CELL) {
        return PLACE_HOLDER_CELL;
      } else {
        return props.flatListProps?.keyExtractor?.(params);
      }
    },
    [props.flatListProps],
  );

  const onScrollBeginDrag = useCallback(
    params => {
      Keyboard.dismiss();
      props.recyclerListViewProps?.scrollViewProps?.onScrollBeginDrag?.(params);
      props.flatListProps &&
        props.flatListProps.onScrollBeginDrag &&
        props.flatListProps.onScrollBeginDrag(params);
    },
    [props.flatListProps, props.recyclerListViewProps?.scrollViewProps],
  );

  const onScrollToIndexFailed = useCallback(() => {
    /* Do nothing */
  }, []);

  const extendedState = useMemo(() => {
    return {nReloadIdentifier};
  }, [nReloadIdentifier]);

  /** Filer out flat list props, as they already has custom implementation */
  const flatListProps = useMemo(() => {
    const filteredProps = {...props.flatListProps};
    delete filteredProps.ref;
    delete filteredProps.onEndReached;
    delete filteredProps.onEndReachedThreshold;
    delete filteredProps.onStartReached;
    delete filteredProps.onStartReachedThreshold;
    delete filteredProps.showDefaultLoadingIndicators;
    delete filteredProps.HeaderLoadingIndicator;
    delete filteredProps.FooterLoadingIndicator;
    delete filteredProps.ListHeaderComponent;
    delete filteredProps.onLayout;
    delete filteredProps.onContentSizeChange;
    delete filteredProps.ListEmptyComponent;
    delete filteredProps.ListFooterComponent;
    delete filteredProps.ListFooterComponentStyle;
    delete filteredProps.style;
    delete filteredProps.viewabilityConfigCallbackPairs;
    delete filteredProps.renderItem;
    delete filteredProps.keyExtractor;
    delete filteredProps.onScrollBeginDrag;
    return filteredProps;
  }, [props.flatListProps]);

  const recyclerListViewProps = useMemo(() => {
    const filteredProps = {...props.recyclerListViewProps};
    delete filteredProps.layoutProvider;
    delete filteredProps.extendedState;
    delete filteredProps.rowRenderer;
    delete filteredProps.dataProvider;
    delete filteredProps.onEndReached;
    delete filteredProps.onEndReachedThreshold;
    delete filteredProps.onEndReachedThreshold;
    delete filteredProps.renderFooter;
    delete filteredProps.style;
    delete filteredProps.onScrollBeginDrag;
    return filteredProps;
  }, [props.recyclerListViewProps]);

  const ListEmptyComponent =
    props?.recyclerListViewProps?.scrollViewProps?.ListEmptyComponent;

  return (
    <View style={props.style}>
      {bShowErrorView ? (
        errorView
      ) : bIsLoading ? (
        loaderView
      ) : useRecyclerView ? (
        bShowEmptyView ? (
          ListEmptyComponent ? (
            <ListEmptyComponent />
          ) : null
        ) : (
          <RecyclerListView
            {...recyclerListViewProps}
            scrollThrottle={recyclerListViewProps?.scrollEventThrottle}
            isHorizontal={props.recyclerListViewProps?.horizontal}
            layoutProvider={dataSource.layoutProvider}
            extendedState={extendedState}
            rowRenderer={renderRecyclerItem}
            dataProvider={oDataProvider}
            onEndReached={fnLoadMore}
            initialRenderIndex={nInitialIndex}
            onEndReachedThreshold={
              props.recyclerListViewProps?.onEndReachedThreshold || 0.5
            }
            renderFooter={
              props.recyclerListViewProps?.renderFooter || nextPageLoadMoreView
            }
            style={props?.recyclerListViewProps?.style || localStyle.flatList}
            onScrollBeginDrag={onScrollBeginDrag}
          />
        )
      ) : (
        <FlatList
          ref={props?.flatListProps?.ref}
          keyExtractor={keyExtractor}
          renderItem={renderFlatListItem}
          initialScrollIndex={nInitialIndex}
          viewabilityConfigCallbackPairs={
            viewabilityConfigCallbackPairs.current
          }
          onScrollToIndexFailed={onScrollToIndexFailed}
          onLayout={props?.flatListProps?.onLayout}
          onContentSizeChange={props?.flatListProps?.onContentSizeChange}
          data={aListData}
          onEndReached={fnLoadMore}
          onEndReachedThreshold={
            props?.flatListProps?.onEndReachedThreshold || 0.5
          }
          onScrollBeginDrag={onScrollBeginDrag}
          ListHeaderComponent={
            props?.flatListProps?.ListHeaderComponent || null
          }
          ListEmptyComponent={props?.flatListProps?.ListEmptyComponent || null}
          ListFooterComponent={
            props?.flatListProps?.ListFooterComponent || nextPageLoadMoreView
          }
          ListFooterComponentStyle={
            (props?.flatListProps?.ListFooterComponent &&
              props?.flatListProps?.ListFooterComponentStyle) ||
            localStyle.loadMore
          }
          style={props?.flatListProps?.style || localStyle.flatList}
          {...flatListProps}
          extraData={nReloadIdentifier}
        />
      )}
    </View>
  );
}

const styles = {
  loaderMoreViewContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderMoreView: {
    width: layoutPtToPx(40),
    height: layoutPtToPx(40),
  },
  loaderViewContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderView: {
    width: layoutPtToPx(40),
    height: layoutPtToPx(40),
  },
  errorViewContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.WhiteSmoke,
  },
  emptyViewContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.WhiteSmoke,
  },
  fitHeight: {
    height: '60%',
    aspectRatio: 1,
  },
  fitWidth: {
    width: '60%',
    aspectRatio: 1,
  },
  heading: {
    fontSize: fontPtToPx(18),
    lineHeight: 22,
    textAlign: 'center',
    color: colors.SherpaBlue,
    tablet: {
      lineHeight: 29,
      fontSize: fontPtToPx(24),
    },
  },
  subHeading: {
    fontSize: fontPtToPx(12),
    lineHeight: 16,
    textAlign: 'center',
    color: colors.PaleSky,
    marginTop: layoutPtToPx(4),
    tablet: {
      lineHeight: 19,
      fontSize: fontPtToPx(14),
      marginTop: layoutPtToPx(7),
    },
  },
};

export default React.memo(PaginatedList);
