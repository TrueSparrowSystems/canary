import {View} from 'react-native';
import React, {useMemo, useRef} from 'react';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import TweetCard from '../../components/TweetCard';
import TimelineList from '../../components/TimelineList';
import ThreadTweetListDataSource from './ThreadTweetList/ThreadTweetListDataSource';
import Header from '../../components/common/Header';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import {useOrientationState} from '../../hooks/useOrientation';
import {isTablet} from 'react-native-device-info';
import SearchScreenContent from '../../components/SearchScreenContent';

function ThreadScreen(props) {
  const {tweetData} = props?.route?.params;

  const localStyle = useStyleProcessor(styles, 'ThreadScreen');

  const {isPortrait} = useOrientationState();
  const isTabletLandscape = useMemo(
    () => isTablet() && !isPortrait,
    [isPortrait],
  );

  const listDataSource = useRef(null);
  if (listDataSource.current === null) {
    listDataSource.current = new ThreadTweetListDataSource({
      tweetId: tweetData.id,
      conversationId: tweetData.conversation_id,
      username: tweetData.user.username,
    });
  }

  //TODO: Implement pull to refresh.
  return (
    <View style={localStyle.container}>
      <View style={localStyle.listComponent}>
        <Header
          testID={'thread_screen'}
          enableBackButton={true}
          text={'Thread'}
        />
        <TimelineList
          testID="thread_screen"
          reloadData={false}
          refreshData={false}
          timelineListDataSource={listDataSource.current}
          listHeaderComponent={
            <TweetCard
              testID="thread_screen"
              dataSource={tweetData}
              isDisabled={true}
              style={localStyle.cardStyle}
              textStyle={localStyle.tweetText}
              linkTextStyle={localStyle.tweetLinkText}
            />
          }
        />
      </View>
      {isTabletLandscape ? <SearchScreenContent /> : null}
    </View>
  );
}

export default React.memo(ThreadScreen);

const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.White,
    flexDirection: 'row',
  },
  listComponent: {
    width: '100%',
    tablet: {
      landscape: {
        width: '70%',
        borderRightWidth: 1,
        borderRightColor: colors.BlackPearl20,
      },
    },
  },
  cardStyle: {
    borderBottomWidth: 1,
    borderBottomColor: colors.BlackPearl50,
    marginBottom: layoutPtToPx(12),
    padding: layoutPtToPx(12),
    flex: 1,
  },
  header: {
    marginHorizontal: layoutPtToPx(20),
    height: layoutPtToPx(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tweetText: {
    fontFamily: fonts.InterMedium,
    fontSize: fontPtToPx(16),
    lineHeight: layoutPtToPx(21),
    marginBottom: 10,
    color: colors.BlackPearl,
  },
  tweetLinkText: {
    fontFamily: fonts.InterSemiBold,
    fontSize: fontPtToPx(16),
    lineHeight: layoutPtToPx(21),
    color: colors.GoldenTainoi,
  },
};
