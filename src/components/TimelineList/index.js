import React, {useCallback, useMemo, useRef} from 'react';
import {ActivityIndicator, Image, Text, View} from 'react-native';
import PaginatedList from '../PaginatedList';
import colors, {getColorWithOpacity} from '../../constants/colors';
import TimelineListDataSource from './TimelineListDataSource';
import useTimelineListData from './useTimelineListData';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import {isTablet} from 'react-native-device-info';
import TweetCard from '../TweetCard';
import RoundedButton from '../common/RoundedButton';
import {Canary, CrossIcon} from '../../assets/common';
import fonts from '../../constants/fonts';
import * as Animatable from 'react-native-animatable';
import {Constants} from '../../constants/Constants';
import {RefreshControl, TouchableOpacity} from '@plgworks/applogger';
import {useOrientationState} from '../../hooks/useOrientation';

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
  testID = '',
  shouldShowSearchContent = false,
}) {
  const listDataSource = useRef(timelineListDataSource);
  if (listDataSource.current === null) {
    listDataSource.current = new TimelineListDataSource();
  }

  const {
    bShowCard,
    bIsLoading,
    crossButtonRef,
    fnOnRefresh,
    fnOnDataChange,
    fnOnShareAppPress,
    fnOnCloseShareCardPress,
  } = useTimelineListData({
    listDataSource: listDataSource.current,
    onDataAvailable,
    onRefresh,
  });

  const localStyle = useStyleProcessor(styles, 'TimelineList');

  const {isPortrait} = useOrientationState();

  const ShareCard = useMemo(() => {
    return bShowCard ? (
      <Animatable.View
        style={localStyle.shareCardContainer}
        ref={crossButtonRef}>
        <View>
          <View style={localStyle.flexRow}>
            <Image source={Canary} style={localStyle.canaryIconStyle} />
            <Text style={localStyle.enjoyingPrivacyText}>
              Enjoying the privacy?
            </Text>
          </View>
          <Text style={localStyle.shareTheAppText}>
            Share the app with your friends and support data privacy! 💯
          </Text>
          <RoundedButton
            testID={'timeline_list_share_app'}
            underlayColor={getColorWithOpacity(colors.Black, 0.2)}
            style={localStyle.shareAppButton}
            text={'Share App'}
            onPress={fnOnShareAppPress}
            textStyle={localStyle.shareAppButtonText}
          />
        </View>
        <TouchableOpacity
          testID="share_tweet_card_cross"
          hitSlop={{left: 10, right: 10, top: 10, bottom: 10}}
          onPress={fnOnCloseShareCardPress}>
          <Image source={CrossIcon} style={localStyle.crossIconStyle} />
        </TouchableOpacity>
      </Animatable.View>
    ) : null;
  }, [
    bShowCard,
    localStyle.shareCardContainer,
    localStyle.flexRow,
    localStyle.canaryIconStyle,
    localStyle.enjoyingPrivacyText,
    localStyle.shareTheAppText,
    localStyle.shareAppButton,
    localStyle.shareAppButtonText,
    localStyle.crossIconStyle,
    crossButtonRef,
    fnOnShareAppPress,
    fnOnCloseShareCardPress,
  ]);

  const renderItem = useCallback(
    ({item}) => {
      if (item.card_type === Constants.CardTypes.TweetCard) {
        return (
          <TweetCard
            testID={`${testID}_list`}
            dataSource={item}
            isDisabled={disableTweetPress}
            shouldShowSearchContent={shouldShowSearchContent}
          />
        );
      } else if (item.card_type === Constants.CardTypes.ShareCard) {
        return ShareCard;
      }
    },
    [ShareCard, disableTweetPress, shouldShowSearchContent, testID],
  );

  const keyExtractor = useCallback(
    item => {
      return item.id + isPortrait;
    },
    [isPortrait],
  );

  const loaderView = useMemo(() => {
    return (
      <View style={localStyle.loaderViewContainer}>
        <ActivityIndicator animating={true} color={colors.GoldenTainoi} />
      </View>
    );
  }, [localStyle.loaderViewContainer]);

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
          testID={`${testID}_paginated_list`}
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
    testID,
  ]);

  return (
    <View style={style || localStyle.container}>
      <PaginatedList
        testID={testID}
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
    flexGrow: 1,
    paddingTop: layoutPtToPx(10),
    tablet: {
      paddingLeft: layoutPtToPx(10),
      paddingRight: layoutPtToPx(20),
    },
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
    flex: 1,
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
  shareCardContainer: {
    flexDirection: 'row',
    padding: layoutPtToPx(20),
  },
  flexRow: {
    flexDirection: 'row',
  },
  canaryIconStyle: {
    height: layoutPtToPx(24),
    width: layoutPtToPx(24),
  },
  enjoyingPrivacyText: {
    color: colors.Black,
    fontSize: fontPtToPx(16),
    lineHeight: layoutPtToPx(20),
    fontFamily: fonts.SoraSemiBold,
    marginLeft: layoutPtToPx(4),
    alignSelf: 'center',
  },
  shareTheAppText: {
    color: colors.Black,
    fontSize: fontPtToPx(14),
    lineHeight: layoutPtToPx(19),
    fontFamily: fonts.InterRegular,
    marginTop: layoutPtToPx(8),
  },
  shareAppButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.White,
    width: layoutPtToPx(128),
    height: layoutPtToPx(30),
    borderRadius: layoutPtToPx(15),
    borderColor: colors.Black,
    borderWidth: layoutPtToPx(1),
    marginTop: layoutPtToPx(12),
  },
  shareAppButtonText: {
    color: colors.BlackPearl,
    fontSize: fontPtToPx(12),
    lineHeight: layoutPtToPx(15),
    fontFamily: fonts.SoraSemiBold,
  },
  crossIconStyle: {
    height: layoutPtToPx(15),
    width: layoutPtToPx(15),
    padding: layoutPtToPx(5),
  },
};

export default React.memo(TimelineList);
