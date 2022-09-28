import React, {useCallback, useRef} from 'react';
import {View, ActivityIndicator, FlatList, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import CollectionCard from '../../components/CollectionCard';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import colors from '../../constants/colors';
import {
  AddIcon,
  ArchiveIconBig,
  bookmarkedIcon,
  DeleteIcon,
  ShareAppIcon,
} from '../../assets/common';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import EmptyScreenComponent from '../../components/common/EmptyScreenComponent';
import {isEmpty} from 'lodash';
import Header from '../../components/common/Header';
import fonts from '../../constants/fonts';
import useTabListener from '../../hooks/useTabListener';
import * as Animatable from 'react-native-animatable';
import Banner from '../../components/common/Banner';
import {RefreshControl} from '@plgworks/applogger';
import useCollectionScreenData from './useCollectionScreenData';

function CollectionScreen(props) {
  const localStyle = useStyleProcessor(styles, 'CollectionScreen');

  const screenName = props?.route?.name;
  const scrollRef = useRef(null);
  const scrollToTop = useCallback(() => {
    scrollRef.current?.scrollToOffset({
      animated: true,
      offset: 0,
    });
  }, []);

  useTabListener(screenName, scrollToTop);

  const {
    aSelectedCollectionIdsRef,
    bIsEditMode,
    bIsLoading,
    bShowPromotionBanner,
    nColumnsCount,
    oCollectionDataRef,
    oCrossButtonRef,
    fnReloadList,
    fnOnAddCollectionPress,
    fnOnSharePress,
    fnOnDonePress,
    fnOnRemoveCollectionsPress,
    fnOnRemovePromotionPress,
    fnEnableCollectionDeleteOption,
    fnFetchData,
  } = useCollectionScreenData();

  const renderItem = useCallback(
    ({item, index}) => {
      return (
        <CollectionCard
          key={item.id}
          data={item}
          animationDelay={index * 20}
          onCollectionRemoved={fnReloadList}
          onLongPress={fnEnableCollectionDeleteOption}
          enableDelete={bIsEditMode}
          disabled={isEmpty(item) ? true : false}
          selectedCollectionIds={aSelectedCollectionIdsRef.current}
        />
      );
    },
    [
      aSelectedCollectionIdsRef,
      bIsEditMode,
      fnEnableCollectionDeleteOption,
      fnReloadList,
    ],
  );

  return (
    <SafeAreaView style={localStyle.container}>
      {isEmpty(oCollectionDataRef.current) ? null : (
        <Header
          testID={'collection_screen'}
          text={'Archives'}
          textStyle={localStyle.headerTextStyle}
          enableRightButton={true}
          rightButtonImage={!bIsEditMode ? AddIcon : ShareAppIcon}
          onRightButtonClick={
            !bIsEditMode ? fnOnAddCollectionPress : fnOnSharePress
          }
          rightButtonText={!bIsEditMode ? 'New' : null}
          rightButtonTextStyle={localStyle.newButtonTextStyle}
          rightButtonImageStyle={
            !bIsEditMode
              ? localStyle.newButtonImageStyle
              : localStyle.shareButtonImageStyle
          }
          enableLeftButton={true}
          leftButtonText={!bIsEditMode ? 'Select' : 'Done'}
          leftButtonTextStyle={localStyle.newButtonTextStyle}
          onLeftButtonClick={
            !bIsEditMode ? fnEnableCollectionDeleteOption : fnOnDonePress
          }
          enableSecondaryRightButton={bIsEditMode}
          secondaryRightButtonImage={DeleteIcon}
          secondaryRightButtonImageStyle={localStyle.shareButtonImageStyle}
          onSecondaryRightButtonClick={fnOnRemoveCollectionsPress}
        />
      )}
      {!bIsEditMode ? (
        bShowPromotionBanner && !isEmpty(oCollectionDataRef.current) ? (
          <Animatable.View ref={oCrossButtonRef}>
            <Banner
              testID="collection_screen"
              headerImage={bookmarkedIcon}
              headerImageStyle={localStyle.headerImageStyle}
              headerText={'Archives lets you save your tweets privately'}
              descriptionText={
                'Make the archives your own by saving unlimited number of tweets in multiple groups — we won’t know anything'
              }
              onRemovePromotionPress={fnOnRemovePromotionPress}
              crossButtonRef={oCrossButtonRef}
            />
          </Animatable.View>
        ) : null
      ) : (
        <Text style={localStyle.selectInfoTextStyle}>
          Tap on cards to select them
        </Text>
      )}
      {bIsLoading ? (
        <View style={localStyle.loaderStyle}>
          <ActivityIndicator
            animating={bIsLoading}
            color={colors.GoldenTainoi}
          />
        </View>
      ) : isEmpty(oCollectionDataRef.current) ? (
        <EmptyScreenComponent
          buttonImage={AddIcon}
          emptyImage={ArchiveIconBig}
          buttonText={'Add a new Archive'}
          onButtonPress={fnOnAddCollectionPress}
          descriptionText={
            'Save your favorite tweets in the archive and access it later anytime - with full privacy 💯'
          }
        />
      ) : (
        <View style={localStyle.flatListStyle}>
          <FlatList
            key={`flatList_${nColumnsCount}`}
            showsVerticalScrollIndicator={false}
            data={oCollectionDataRef.current}
            renderItem={renderItem}
            numColumns={nColumnsCount}
            ref={scrollRef}
            refreshControl={
              bIsEditMode ? null : (
                <RefreshControl
                  testID="archive_screen_list"
                  refreshing={bIsLoading}
                  onRefresh={fnFetchData}
                />
              )
            }
            contentContainerStyle={localStyle.contentContainerStyle}
            keyExtractor={item => {
              return item.id;
            }}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = {
  container: {
    backgroundColor: colors.White,
    flex: 1,
  },
  loaderStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextStyle: {
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(16),
    lineHeight: layoutPtToPx(20),
    color: colors.BlackPearl,
    alignSelf: 'center',
  },
  selectInfoTextStyle: {
    fontFamily: fonts.SoraRegular,
    fontSize: fontPtToPx(14),
    lineHeight: layoutPtToPx(20),
    color: colors.BlackPearl,
    alignSelf: 'center',
  },
  newButtonImageStyle: {
    tintColor: colors.GoldenTainoi,
    height: layoutPtToPx(14),
    width: layoutPtToPx(14),
  },
  shareButtonImageStyle: {
    tintColor: colors.GoldenTainoi,
    height: layoutPtToPx(20),
    width: layoutPtToPx(20),
    marginLeft: layoutPtToPx(10),
    tablet: {
      height: layoutPtToPx(25),
      width: layoutPtToPx(25),
    },
  },
  newButtonTextStyle: {
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(14),
    lineHeight: layoutPtToPx(18),
    color: colors.GoldenTainoi,
    paddingLeft: layoutPtToPx(2),
  },
  flatListStyle: {
    paddingHorizontal: layoutPtToPx(10),
    flex: 1,
  },
  contentContainerStyle: {
    marginTop: layoutPtToPx(10),
    paddingTop: layoutPtToPx(10),
    overflow: 'visible',
  },
  headerImageStyle: {
    height: layoutPtToPx(20),
    width: layoutPtToPx(15),
    marginRight: layoutPtToPx(8),
  },
};

export default React.memo(CollectionScreen);
