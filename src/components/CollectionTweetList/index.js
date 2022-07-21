import React from 'react';
import {ScrollView, ActivityIndicator} from 'react-native';
import TweetCard from '../TweetCard';
import useCollectionTweetListData from './useCollectionTweetListData';

function CollectionTweetList(props) {
  const {bIsLoading, aDataSource} = useCollectionTweetListData(props);

  return bIsLoading ? (
    <ActivityIndicator animating={bIsLoading} />
  ) : (
    <ScrollView>
      {aDataSource?.map(data => {
        return <TweetCard dataSource={data} />;
      })}
    </ScrollView>
  );
}

export default React.memo(CollectionTweetList);
