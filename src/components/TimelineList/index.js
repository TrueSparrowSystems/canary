import React, {useCallback, useMemo, useRef} from 'react';
import {ActivityIndicator, RefreshControl, View} from 'react-native';
import PaginatedList from '../PaginatedList';
import colors from '../../constants/colors';
import TimelineListDataSource from './TimelineListDataSource';
import useTimelineListData from './useTimelineListData';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import {isTablet} from 'react-native-device-info';
import TweetCard from '../TweetCard';

const _isTablet = isTablet();
const ITEM_WIDTH = 276;

function TimelineList({
  listRef,
  style,
  reloadData,
  refreshData,
  onRefresh,
  onDataAvailable,
  timelineListDataSource = null,
  listHeaderComponent = null,
  disableTweetPress = false,
  listEmptyComponent = null,
}) {
  const {bIsLoading, fnOnRefresh, fnOnDataChange} = useTimelineListData({
    onDataAvailable,
    onRefresh,
  });

  const listDataSource = useRef(timelineListDataSource);
  if (listDataSource.current === null) {
    listDataSource.current = new TimelineListDataSource();
  }

  const localStyle = useStyleProcessor(styles, 'TimelineList');

  const renderItem = useCallback(
    ({item}) => {
      return <TweetCard dataSource={item} isDisabled={disableTweetPress} />;
    },
    [disableTweetPress],
  );

  const keyExtractor = useCallback(item => {
    return item.id;
  }, []);

  const loaderView = useMemo(() => {
    return (
      <View style={localStyle.loaderViewContainer}>
        <ActivityIndicator animating={bIsLoading} color={colors.GoldenTainoi} />
      </View>
    );
  }, [bIsLoading, localStyle.loaderViewContainer]);

  const flatListProps = useMemo(() => {
    return {
      ref: listRef,
      style: localStyle.flatListPropsStyle,
      horizontal: false,
      showsVerticalScrollIndicator: false,
      renderItem: renderItem,
      keyExtractor: keyExtractor,
      windowSize: _isTablet ? 14 : 12,
      maxToRenderPerBatch: _isTablet ? 30 : 20,
      scrollEnabled: true,
      contentContainerStyle: localStyle.contentContainerStyle,
      ListHeaderComponent: listHeaderComponent,
      ListEmptyComponent: (
        <View style={localStyle.emptyViewContainer}>{listEmptyComponent}</View>
      ),
      refreshControl: (
        <RefreshControl
          refreshing={bIsLoading}
          onRefresh={fnOnRefresh}
          tintColor="transparent"
        />
      ),
    };
  }, [
    bIsLoading,
    fnOnRefresh,
    keyExtractor,
    listEmptyComponent,
    listHeaderComponent,
    listRef,
    localStyle.contentContainerStyle,
    localStyle.emptyViewContainer,
    localStyle.flatListPropsStyle,
    renderItem,
  ]);

  return (
    <View style={style || localStyle.container}>
      <PaginatedList
        useRecyclerView={false}
        flatListProps={flatListProps}
        dataSource={listDataSource.current}
        onFlatListDataChange={fnOnDataChange}
        reloadData={reloadData}
        refreshData={refreshData || bIsLoading}
        style={localStyle.listStyle}
        loaderView={loaderView}
      />
    </View>
  );
}

const styles = {
  flatListPropsStyle: {flex: 1},
  contentContainerStyle: {
    width: '100%',
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    overflow: 'hidden',
    backgroundColor: colors.Transparent,
  },
  headerText: {
    color: colors.SherpaBlue,
    fontSize: fontPtToPx(21),
    fontWeight: 'normal',
    paddingHorizontal: layoutPtToPx(20),
  },
  loaderViewContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderView: {
    width: layoutPtToPx(40),
    height: layoutPtToPx(40),
  },
  listStyle: {
    flex: 1,
    width: '100%',
  },
  verticalCardStyle: {
    width: ITEM_WIDTH,
  },
  emptyViewContainer: {
    width: '100%',
    height: '100%',
  },
};

export default React.memo(TimelineList);
