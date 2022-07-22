import {View} from 'react-native';
import React, {useRef} from 'react';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import TweetCard from '../../components/TweetCard';
import TimelineList from '../../components/TimelineList';
import ThreadTweetListDataSource from './ThreadTweetList/ThreadTweetListDataSource';
import Header from '../../components/common/Header';
import {layoutPtToPx} from '../../utils/responsiveUI';

function ThreadScreen(props) {
  const {tweetData} = props?.route?.params;

  const localStyle = useStyleProcessor(styles, 'ThreadScreen');

  const listDataSource = useRef(null);
  if (listDataSource.current === null) {
    listDataSource.current = new ThreadTweetListDataSource({
      tweetId: tweetData.id,
      conversationId: tweetData.conversation_id,
    });
  }

  //TODO: Implement pull to refresh.
  return (
    <View style={localStyle.container}>
      <Header enableBackButton={true} />
      <TimelineList
        reloadData={false}
        refreshData={false}
        timelineListDataSource={listDataSource.current}
        disableTweetPress={true}
        listHeaderComponent={
          <TweetCard dataSource={tweetData} isDisabled={true} />
        }
      />
    </View>
  );
}

export default React.memo(ThreadScreen);

const styles = {
  container: {
    flex: 1,
  },
  header: {
    marginHorizontal: layoutPtToPx(20),
    height: layoutPtToPx(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
};
