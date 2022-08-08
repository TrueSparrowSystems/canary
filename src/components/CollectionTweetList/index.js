import React from 'react';
import {ScrollView, ActivityIndicator, RefreshControl} from 'react-native';
import {bookmarkIcon} from '../../assets/common';
import colors, {getColorWithOpacity} from '../../constants/colors';
import fonts from '../../constants/fonts';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import EmptyScreenComponent from '../common/EmptyScreenComponent';
import TweetCard from '../TweetCard';
import useCollectionTweetListData from './useCollectionTweetListData';

function CollectionTweetList(props) {
  const {
    bIsLoading,
    fnOnRefresh,
    aDataSource,
    fnOnBookmarkFavouriteTweetScreen,
  } = useCollectionTweetListData(props);
  const localStyle = useStyleProcessor(styles, 'CollectionTweetList');

  return bIsLoading ? (
    <ActivityIndicator animating={bIsLoading} />
  ) : aDataSource.length === 0 ? (
    <EmptyScreenComponent
      descriptionText={'It’s pretty empty in here 🥲'}
      descriptionTextStyle={localStyle.descriptionTextStyle}
      buttonText={'Bookmark Your Favorite Tweets'}
      buttonImage={bookmarkIcon}
      buttonImageStyle={localStyle.emptyButtonImageStyle}
      onButtonPress={fnOnBookmarkFavouriteTweetScreen}
    />
  ) : (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={bIsLoading} onRefresh={fnOnRefresh} />
      }>
      {aDataSource?.map(data => {
        return <TweetCard key={data?.id} dataSource={data} />;
      })}
    </ScrollView>
  );
}

const styles = {
  descriptionTextStyle: {
    fontSize: fontPtToPx(16),
    lineHeight: layoutPtToPx(20),
    fontFamily: fonts.SoraRegular,
    color: getColorWithOpacity(colors.Black, 0.7),
  },
  emptyButtonImageStyle: {
    height: layoutPtToPx(18),
    width: layoutPtToPx(18),
  },
};

export default React.memo(CollectionTweetList);
