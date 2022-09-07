import {RefreshControl, TouchableOpacity} from '@plgworks/applogger';
import React from 'react';
import {ScrollView, ActivityIndicator, View, Text, Image} from 'react-native';
import {BinIcon, bookmarkIcon} from '../../assets/common';
import colors, {getColorWithOpacity} from '../../constants/colors';
import fonts from '../../constants/fonts';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import EmptyScreenComponent from '../common/EmptyScreenComponent';
import TweetCard from '../TweetCard';
import useCollectionTweetListData from './useCollectionTweetListData';

function CollectionTweetList(props) {
  const {
    emptyScreenComponent,
    contentContainerStyle,
    onTweetRemove,
    isImportMode = false,
    onTweetCardPress = null,
    collectionId,
  } = props;
  const {
    bIsLoading,
    fnOnRefresh,
    aDataSource,
    fnOnBookmarkFavouriteTweetPress,
  } = useCollectionTweetListData(props);
  const localStyle = useStyleProcessor(styles, 'CollectionTweetList');

  return bIsLoading ? (
    <ActivityIndicator animating={bIsLoading} color={colors.GoldenTainoi} />
  ) : aDataSource.length === 0 ? (
    emptyScreenComponent ? (
      emptyScreenComponent
    ) : (
      <EmptyScreenComponent
        descriptionText={'It’s pretty empty in here 🥲'}
        descriptionTextStyle={localStyle.descriptionTextStyle}
        buttonText={'Bookmark Your Favorite Tweets'}
        buttonImage={bookmarkIcon}
        buttonImageStyle={localStyle.emptyButtonImageStyle}
        onButtonPress={fnOnBookmarkFavouriteTweetPress}
        buttonStyle={localStyle.bookmarkButtonStyle}
      />
    )
  ) : (
    <ScrollView
      contentContainerStyle={contentContainerStyle}
      refreshControl={
        <RefreshControl
          testID={`collection_tweets_list_${collectionId}`}
          refreshing={bIsLoading}
          onRefresh={fnOnRefresh}
        />
      }>
      {aDataSource?.map(data => {
        return data?.isDeletedTweet ? (
          <View style={localStyle.cardContainer}>
            <View style={localStyle.flexRow}>
              <Text style={localStyle.deletedTweetTextStyle}>
                This Tweet is Deleted
              </Text>
              <TouchableOpacity
                testID={'deleted_tweet_card_delete_icon'}
                activeOpacity={0.8}
                style={localStyle.binContainer}
                onPress={() => {
                  onTweetRemove?.(data?.id);
                  fnOnRefresh();
                }}>
                <Image source={BinIcon} style={localStyle.binIconStyle} />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TweetCard
            testID="collection_tweet_list"
            key={data?.id}
            dataSource={data}
            showBookmarked={isImportMode}
            disablePointerEvents={isImportMode}
            onCardPress={onTweetCardPress}
            shouldShowRemoveOption={isImportMode}
            onRemoveOptionPress={id => {
              onTweetRemove?.(id);
              fnOnRefresh();
            }}
          />
        );
      })}
    </ScrollView>
  );
}

const styles = {
  cardContainer: {
    borderWidth: 1,
    borderColor: colors.BlackPearl20,
    marginHorizontal: layoutPtToPx(8),
    marginBottom: layoutPtToPx(12),
    borderRadius: layoutPtToPx(8),
    flex: 1,
  },

  descriptionTextStyle: {
    fontSize: fontPtToPx(16),
    lineHeight: layoutPtToPx(21),
    fontFamily: fonts.SoraRegular,
    color: getColorWithOpacity(colors.Black, 0.7),
  },
  emptyButtonImageStyle: {
    height: layoutPtToPx(18),
    width: layoutPtToPx(18),
  },
  bookmarkButtonStyle: {
    marginTop: layoutPtToPx(40),
    backgroundColor: colors.GoldenTainoi,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: layoutPtToPx(40),
    borderRadius: layoutPtToPx(25),
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deletedTweetTextStyle: {
    fontSize: fontPtToPx(16),
    lineHeight: layoutPtToPx(21),
    fontFamily: fonts.SoraRegular,
    color: getColorWithOpacity(colors.Black, 0.7),
  },
  binContainer: {
    margin: layoutPtToPx(10),
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  binIconStyle: {
    height: layoutPtToPx(20),
    width: layoutPtToPx(20),
  },
};

export default React.memo(CollectionTweetList);
