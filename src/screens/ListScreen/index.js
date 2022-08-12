import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  View,
  Text,
} from 'react-native';
import {AddIcon, CrossIcon, ListIconBig} from '../../assets/common';
import ListCard from '../../components/ListCard';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {listService} from '../../services/ListService';
import colors from '../../constants/colors';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import EmptyScreenComponent from '../../components/common/EmptyScreenComponent';
import Header from '../../components/common/Header';
import fonts from '../../constants/fonts';
import {isEmpty} from 'lodash-es';
import useTabListener from '../../hooks/useTabListener';
import RoundedButton from '../../components/common/RoundedButton';
import AsyncStorage from '../../services/AsyncStorage';
import {StoreKeys} from '../../services/AsyncStorage/StoreConstants';
import * as Animatable from 'react-native-animatable';
import Cache from '../../services/Cache';
import {CacheKey} from '../../services/Cache/CacheStoreConstants';

function ListScreen(props) {
  const localStyle = useStyleProcessor(styles, 'ListScreen');
  const [isLoading, setIsLoading] = useState(true);
  const [swipeable, setSwipeable] = useState(false);
  const listDataRef = useRef({});
  const [showPromotionBanner, setShowPromotionBanner] = useState(false);
  const crossButtonRef = useRef(null);
  const screenName = props?.route?.name;
  const scrollRef = useRef(null);

  const scrollToTop = useCallback(() => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  }, []);
  useTabListener(screenName, scrollToTop);

  const fetchData = useCallback(() => {
    setIsLoading(true);
    const _listService = listService();
    _listService.getAllLists().then(list => {
      listDataRef.current = list;
      const showPromotion = Cache.getValue(CacheKey.ShowPromotionOnLists);
      if (showPromotion !== null) {
        setShowPromotionBanner(JSON.parse(showPromotion));
      } else {
        setShowPromotionBanner(true);
      }
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reloadList = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    LocalEvent.on(EventTypes.UpdateList, fetchData);
    return () => {
      LocalEvent.off(EventTypes.UpdateList, fetchData);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onListAddSuccess = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const onAddListPress = useCallback(() => {
    LocalEvent.emit(EventTypes.ShowAddListModal, {
      onListAddSuccess,
    });
  }, [onListAddSuccess]);

  const onCardLongPress = useCallback(() => {
    setSwipeable(true);
  }, []);

  const onDonePress = useCallback(() => {
    setSwipeable(false);
  }, []);

  const onRemovePromotionPress = useCallback(() => {
    crossButtonRef.current?.animate('fadeOutLeftBig').then(() => {
      setShowPromotionBanner(false);
      Cache.setValue(CacheKey.ShowPromotionOnLists, false);
      AsyncStorage.set(StoreKeys.ShowPromotionOnLists, false).then(() => {});
    });
  }, []);

  return (
    <SafeAreaView style={localStyle.container}>
      {!isEmpty(listDataRef.current) ? (
        <Header
          text="Lists"
          rightButtonImage={swipeable ? null : AddIcon}
          enableRightButton={true}
          rightButtonText={swipeable ? 'Done' : 'New'}
          textStyle={localStyle.headerText}
          rightButtonImageStyle={localStyle.headerRightButtonImage}
          rightButtonTextStyle={localStyle.headerRightButtonText}
          onRightButtonClick={swipeable ? onDonePress : onAddListPress}
        />
      ) : null}
      {showPromotionBanner && !isEmpty(listDataRef.current) ? (
        <Animatable.View ref={crossButtonRef} style={localStyle.banner}>
          <Text style={localStyle.flexShrink}>
            Show some text for lists some text for lists some text for lists
          </Text>
          <RoundedButton
            style={localStyle.crossButton}
            leftImage={CrossIcon}
            leftImageStyle={localStyle.crossIconStyle}
            onPress={onRemovePromotionPress}
            underlayColor={colors.GoldenTainoi80}
          />
        </Animatable.View>
      ) : null}
      {isLoading ? (
        <View style={localStyle.loaderStyle}>
          <ActivityIndicator
            animating={isLoading}
            color={colors.GoldenTainoi}
          />
        </View>
      ) : isEmpty(listDataRef.current) ? (
        <EmptyScreenComponent
          emptyImage={ListIconBig}
          buttonText={'Create a new List'}
          onButtonPress={onAddListPress}
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
            <RefreshControl refreshing={isLoading} onRefresh={reloadList} />
          }>
          {Object.keys(listDataRef.current).map(key => {
            const list = listDataRef.current[key];
            return (
              <ListCard
                key={list.id}
                data={list}
                onListRemoved={reloadList}
                onCardLongPress={onCardLongPress}
                enableSwipe={swipeable}
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
  banner: {
    height: 60,
    width: '100%',
    backgroundColor: colors.GoldenTainoi,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layoutPtToPx(20),
  },
  crossButton: {
    flexGrow: 1,
    backgroundColor: colors.GoldenTainoi,
    height: layoutPtToPx(40),
    width: 'auto',
    borderRadius: layoutPtToPx(25),
    paddingHorizontal: layoutPtToPx(10),
  },
  crossIconStyle: {
    height: layoutPtToPx(20),
    width: layoutPtToPx(20),
  },
  flexShrink: {
    flexShrink: 1,
  },
};

export default React.memo(ListScreen);
