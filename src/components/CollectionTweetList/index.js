import React from 'react';
import {ScrollView, ActivityIndicator} from 'react-native';
import useCollectionTweetListData from './useCollectionTweetListData';

function CollectionTweetList(props) {
  const {bIsLoading, aDataSource} = useCollectionTweetListData(props);

  return bIsLoading ? (
    <ActivityIndicator animating={bIsLoading} />
  ) : (
    <ScrollView>
      {aDataSource?.map(data => {
        // Show Tweet card with this data
      })}
    </ScrollView>
  );
}

export default React.memo(CollectionTweetList);
