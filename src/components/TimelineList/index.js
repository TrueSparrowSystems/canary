import React, {useCallback, useMemo, useRef} from 'react';
import {Image, RefreshControl, Text, View} from 'react-native';
import PaginatedList from '../PaginatedList';
import colors from '../../utils/colors';
import TimelineListDataSource from './TimelineListDataSource';
import useTimelineListData from './useTimelineListData';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
// import PaginationLoader from '../common/PaginationLoader';
import {GridLayoutProvider} from 'recyclerlistview-gridlayoutprovider';
import {isTablet} from 'react-native-device-info';
import {
  commentIcon,
  likeIcon,
  retweetIcon,
  verifiedIcon,
} from '../../assets/common';

const _isTablet = isTablet();
const ITEM_WIDTH = 276;
const NUM_OF_COLUMNS = 1;

function TimelineList({reloadData, refreshData, onDataAvailable}) {
  const {bIsLoading, fnOnRefresh, fnOnDataChange} = useTimelineListData({
    onDataAvailable,
  });

  const listDataSource = useRef(null);
  if (listDataSource.current === null) {
    const layoutProvider = new GridLayoutProvider(
      1,
      index => 'CARD',
      index => 1 / NUM_OF_COLUMNS,
      index => layoutPtToPx(ITEM_WIDTH),
    );
    listDataSource.current = new TimelineListDataSource(layoutProvider);
  }

  const localStyle = useStyleProcessor(styles, 'ClassList');

  const renderItem = useCallback(({item}) => {
    return (
      <View
        style={{
          borderTopWidth: 1,
          borderColor: '#D1D1D1',
          marginBottom: 10,
          borderRadius: 5,
          paddingHorizontal: 10,
          paddingTop: 10,
          paddingBottom: 5,
          flexDirection: 'row',
          flex: 1,
        }}>
        <Image
          source={{uri: item.user.profile_image_url}}
          style={{height: 50, width: 50, borderRadius: 25}}
        />
        <View style={{flex: 1, marginHorizontal: 10, justifyContent: 'center'}}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{fontWeight: '600', fontSize: 15, flexShrink: 1}}
              numberOfLines={1}>
              {item.user.name}
            </Text>
            {item.user.verified ? (
              <Image source={verifiedIcon} style={{height: 20, width: 20}} />
            ) : null}
            <Text
              style={{fontSize: 12, padding: 2, flexShrink: 1}}
              numberOfLines={1}>
              @{item.user.username}
            </Text>
          </View>
          <Text>{item.text}</Text>
          <View style={{flexDirection: 'row', paddingTop: 10}}>
            <Image
              source={commentIcon}
              style={{height: 15, width: 15, marginHorizontal: 10}}
            />
            <Text style={{flex: 1}}>13</Text>
            <Image
              source={retweetIcon}
              style={{height: 15, width: 15, marginHorizontal: 10}}
            />
            <Text style={{flex: 1}}>20</Text>
            <Image
              source={likeIcon}
              style={{height: 15, width: 15, marginHorizontal: 10}}
            />
            <Text style={{paddingRight: 20}}>123</Text>
          </View>
        </View>
      </View>
    );
  }, []);

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
    localStyle.contentContainerStyle,
    localStyle.flatListPropsStyle,
    renderItem,
  ]);
  console.log({bIsLoading});

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
    paddingTop: layoutPtToPx(20),
    backgroundColor: colors.White,
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
