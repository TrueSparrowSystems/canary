import React, {useCallback, useRef} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  View,
  Text,
} from 'react-native';
import {
  AddIcon,
  DeleteIcon,
  ListGolden,
  ListIconBig,
  ShareAppIcon,
} from '../../assets/common';
import ListCard from '../../components/ListCard';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import colors from '../../constants/colors';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import EmptyScreenComponent from '../../components/common/EmptyScreenComponent';
import Header from '../../components/common/Header';
import fonts from '../../constants/fonts';
import {isEmpty} from 'lodash-es';
import useTabListener from '../../hooks/useTabListener';
import * as Animatable from 'react-native-animatable';
import Banner from '../../components/common/Banner';
import {RefreshControl} from '@plgworks/applogger';
import useListScreenData from './useListScreenData';

function ListScreen(props) {
  const localStyle = useStyleProcessor(styles, 'ListScreen');

  const screenName = props?.route?.name;
  const scrollRef = useRef(null);

  const scrollToTop = useCallback(() => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  }, []);

  useTabListener(screenName, scrollToTop);

  const {
    bIsEditMode,
    bIsLoading,
    bShowPromotionBanner,
    oListDataRef,
    oCrossButtonRef,
    aSelectedListIds,
    fnOnAddListPress,
    fnOnCardLongPress,
    fnOnDonePress,
    fnOnRemoveListsPress,
    fnOnRemovePromotionPress,
    fnOnSharePress,
    fnReloadList,
  } = useListScreenData();

  return (
    <SafeAreaView style={localStyle.container}>
      {!isEmpty(oListDataRef.current) ? (
        <Header
          testID={'list_screen'}
          text="Lists"
          rightButtonImage={bIsEditMode ? ShareAppIcon : AddIcon}
          enableRightButton={true}
          rightButtonText={bIsEditMode ? null : 'New'}
          textStyle={localStyle.headerText}
          rightButtonImageStyle={
            bIsEditMode
              ? localStyle.shareButtonImageStyle
              : localStyle.headerRightButtonImage
          }
          rightButtonTextStyle={localStyle.headerRightButtonText}
          onRightButtonClick={bIsEditMode ? fnOnSharePress : fnOnAddListPress}
          enableLeftButton={true}
          leftButtonText={bIsEditMode ? 'Done' : 'Select'}
          leftButtonTextStyle={localStyle.headerRightButtonText}
          onLeftButtonClick={bIsEditMode ? fnOnDonePress : fnOnCardLongPress}
          enableSecondaryRightButton={bIsEditMode}
          secondaryRightButtonImage={DeleteIcon}
          secondaryRightButtonImageStyle={localStyle.shareButtonImageStyle}
          onSecondaryRightButtonClick={fnOnRemoveListsPress}
        />
      ) : null}
      {bIsEditMode ? (
        <Text style={localStyle.selectInfoTextStyle}>
          Tap on cards to select them
        </Text>
      ) : bShowPromotionBanner && !isEmpty(oListDataRef.current) ? (
        <Animatable.View ref={oCrossButtonRef}>
          <Banner
            testID="list_screen"
            headerImage={ListGolden}
            headerImageStyle={localStyle.headerImageStyle}
            headerText={'How is our Lists different from Twitter’s?'}
            descriptionText={
              'This is a version of Lists which doesn’t track any of your data, and keeps your information to yourself'
            }
            onRemovePromotionPress={fnOnRemovePromotionPress}
            crossButtonRef={oCrossButtonRef}
          />
        </Animatable.View>
      ) : null}
      {bIsLoading ? (
        <View style={localStyle.loaderStyle}>
          <ActivityIndicator
            animating={bIsLoading}
            color={colors.GoldenTainoi}
          />
        </View>
      ) : isEmpty(oListDataRef.current) ? (
        <EmptyScreenComponent
          emptyImage={ListIconBig}
          buttonImage={AddIcon}
          buttonText={'Create a new List'}
          onButtonPress={fnOnAddListPress}
          descriptionText={
            'Stay up-to-date on the favorite topics by users you love, without being tracked 😉'
          }
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={localStyle.scrollViewContainer}
          style={localStyle.scrollViewStyle}
          ref={scrollRef}
          refreshControl={
            bIsEditMode ? null : (
              <RefreshControl
                testID="list_screen_list"
                refreshing={bIsLoading}
                onRefresh={fnReloadList}
              />
            )
          }>
          {Object.keys(oListDataRef.current).map(key => {
            const list = oListDataRef.current[key];
            return (
              <ListCard
                key={list.id}
                data={list}
                onListRemoved={fnReloadList}
                onCardLongPress={fnOnCardLongPress}
                enableSwipe={bIsEditMode}
                selectedListIds={aSelectedListIds.current}
              />
            );
          })}
          <View />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = {
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  selectInfoTextStyle: {
    fontFamily: fonts.SoraRegular,
    fontSize: fontPtToPx(14),
    lineHeight: layoutPtToPx(20),
    color: colors.BlackPearl,
    alignSelf: 'center',
  },
  headerView: {
    backgroundColor: 'white',
    flexDirection: 'row',
    borderBottomWidth: 0.8,
    borderColor: colors.SherpaBlue,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(16),
    lineHeight: layoutPtToPx(20),
    color: colors.BlackPearl,
  },
  headerRightButtonImage: {
    tintColor: colors.GoldenTainoi,
    height: layoutPtToPx(14),
    width: layoutPtToPx(14),
    marginRight: layoutPtToPx(6),
  },
  headerRightButtonText: {
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(14),
    color: colors.GoldenTainoi,
  },
  scrollViewStyle: {},
  add: {
    paddingVertical: layoutPtToPx(10),
    paddingHorizontal: layoutPtToPx(20),
    position: 'absolute',
    right: layoutPtToPx(20),
  },
  loaderStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollViewContainer: {
    paddingBottom: layoutPtToPx(20),
  },
  headerImageStyle: {
    height: layoutPtToPx(18),
    width: layoutPtToPx(18),
    marginRight: layoutPtToPx(8),
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
};

export default React.memo(ListScreen);
