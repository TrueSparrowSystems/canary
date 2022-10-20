import {useFocusEffect} from '@react-navigation/native';
import {isEmpty} from 'lodash';
import {useCallback, useEffect, useRef, useState} from 'react';
import {Share} from 'react-native';
import Toast from 'react-native-toast-message';
import {PlgTracker} from 'tracker-react-native';
import {showPromotion} from '../../components/utils/ViewData';
import {Constants} from '../../constants/Constants';
import ScreenName from '../../constants/ScreenName';
import {ToastType} from '../../constants/ToastConstants';
import AnalyticsService from '../../services/AnalyticsService';
import AsyncStorage from '../../services/AsyncStorage';
import {StoreKeys} from '../../services/AsyncStorage/StoreConstants';
import Cache from '../../services/Cache';
import {CacheKey} from '../../services/Cache/CacheStoreConstants';
import {listService} from '../../services/ListService';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';

const useListScreenData = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPromotionBanner, setShowPromotionBanner] = useState(false);

  const listDataRef = useRef({});
  const crossButtonRef = useRef(null);
  const selectedListIds = useRef([]);
  const disableSharePress = useRef(false);

  const _listService = listService();

  const fetchData = useCallback(() => {
    setIsEditMode(false);
    setIsLoading(true);
    _listService.getAllLists().then(list => {
      listDataRef.current = list;
      const shouldShowPromotion = showPromotion(CacheKey.ShowPromotionOnLists);
      if (!shouldShowPromotion && !isEmpty(listDataRef.current)) {
        const oldCacheVal = Cache.getValue(CacheKey.ShowPromotionOnLists);
        AsyncStorage.set(StoreKeys.ShowPromotionOnLists, oldCacheVal);
      }
      setShowPromotionBanner(shouldShowPromotion);
      setIsLoading(false);
    });
  }, [_listService]);

  useFocusEffect(() => {
    PlgTracker.dropPixel({
      eventEntity:
        Constants.TrackerConstants.EventEntities.Screen +
        '_' +
        ScreenName.ListScreen,
      eventAction: Constants.TrackerConstants.EventActions.Mount,
    });
  });

  useEffect(() => {
    LocalEvent.on(EventTypes.UpdateList, fetchData);
    return () => {
      LocalEvent.off(EventTypes.UpdateList, fetchData);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reloadList = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const onListAddSuccess = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const onAddListPress = useCallback(() => {
    LocalEvent.emit(EventTypes.ShowAddListModal, {
      onListAddSuccess,
    });
  }, [onListAddSuccess]);

  const onCardLongPress = useCallback(() => {
    selectedListIds.current = [];
    setIsEditMode(true);
  }, []);

  const onDonePress = useCallback(() => {
    selectedListIds.current = [];
    setIsEditMode(false);
  }, []);

  const onSharePress = useCallback(() => {
    AnalyticsService.track(
      Constants.TrackerConstants.EventEntities.Button + '_' + 'list_share',
      Constants.TrackerConstants.EventActions.Press,
    );

    if (!disableSharePress.current) {
      disableSharePress.current = true;
      if (selectedListIds.current?.length > 0) {
        _listService
          .exportList(selectedListIds.current)
          .then(url => {
            Share.share({message: `Checkout these lists from Canary ${url}`});
          })
          .finally(() => {
            disableSharePress.current = false;
          });
      } else {
        disableSharePress.current = false;
        Toast.show({
          type: ToastType.Error,
          text1: 'Select at least one list to share',
        });
      }
    }
  }, [_listService]);

  const onRemoveListsPress = useCallback(() => {
    if (selectedListIds.current?.length > 0) {
      LocalEvent.emit(EventTypes.ShowDeleteConfirmationModal, {
        id: selectedListIds.current,
        text:
          selectedListIds.current.length > 1
            ? `Are you sure you want to remove these ${selectedListIds.current.length} selected lists?`
            : 'Are you sure you want to remove this selected list?',
        onListRemoved: reloadList,
        type: Constants.ConfirmDeleteModalType.List,
        testID: 'remove_multiple_lists',
      });
    } else {
      Toast.show({
        type: ToastType.Error,
        text1: 'Select at least one list to delete',
      });
    }
  }, [reloadList]);

  const onRemovePromotionPress = useCallback(() => {
    crossButtonRef.current?.animate('fadeOutLeftBig').then(() => {
      setShowPromotionBanner(false);
      const oldCacheVal = Cache.getValue(CacheKey.ShowPromotionOnLists);
      AsyncStorage.set(StoreKeys.ShowPromotionOnLists, oldCacheVal);
      Cache.setValue(CacheKey.ShowPromotionOnLists, false);
    });
  }, []);

  return {
    bIsLoading: isLoading,
    bIsEditMode: isEditMode,
    bShowPromotionBanner: showPromotionBanner,
    oListDataRef: listDataRef,
    oCrossButtonRef: crossButtonRef,
    aSelectedListIds: selectedListIds,
    fnReloadList: reloadList,
    fnOnAddListPress: onAddListPress,
    fnOnCardLongPress: onCardLongPress,
    fnOnDonePress: onDonePress,
    fnOnRemovePromotionPress: onRemovePromotionPress,
    fnOnRemoveListsPress: onRemoveListsPress,
    fnOnSharePress: onSharePress,
  };
};

export default useListScreenData;
