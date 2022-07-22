import React, {useCallback, useMemo, useRef} from 'react';
import {RefreshControl, Text, View} from 'react-native';
import PaginatedList from '../PaginatedList';
import colors from '../../utils/colors';
import TimelineListDataSource from './TimelineListDataSource';
import useTimelineListData from './useTimelineListData';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
// import PaginationLoader from '../common/PaginationLoader';
import {isTablet} from 'react-native-device-info';
import TweetCard from '../TweetCard';

const _isTablet = isTablet();
const ITEM_WIDTH = 276;

function TimelineList({
  reloadData,
  refreshData,
  onDataAvailable,
  timelineListDataSource = null,
  listHeaderComponent = null,
  disableTweetPress = false,
}) {
  const {bIsLoading, fnOnRefresh, fnOnDataChange} = useTimelineListData({
    onDataAvailable,
  });

  const listDataSource = useRef(timelineListDataSource);
  if (listDataSource.current === null) {
    listDataSource.current = new TimelineListDataSource();
  }

  const localStyle = useStyleProcessor(styles, 'ClassList');

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
        <Text>Loading</Text>
        {/* <PaginationLoader style={localStyle.loaderView} /> */}
      </View>
    );
  }, [localStyle.loaderViewContainer]);

  const flatListProps = useMemo(() => {
    return {
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
    listHeaderComponent,
    localStyle.contentContainerStyle,
    localStyle.flatListPropsStyle,
    renderItem,
  ]);

  return (
    <View style={localStyle.container}>
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
    // paddingRight: layoutPtToPx(20),
    // paddingLeft: layoutPtToPx(10),
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
    letterSpacing: 0.32,
    paddingHorizontal: layoutPtToPx(20),
    tablet: {
      letterSpacing: 0.4,
    },
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
};

export default React.memo(TimelineList);
