import {isEmpty} from 'lodash';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {isTablet} from 'react-native-device-info';
import {showPromotion} from '../../components/utils/ViewData';
import {useOrientationState} from '../../hooks/useOrientation';
import AsyncStorage from '../../services/AsyncStorage';
import {StoreKeys} from '../../services/AsyncStorage/StoreConstants';
import Cache from '../../services/Cache';
import {CacheKey} from '../../services/Cache/CacheStoreConstants';
import {collectionService} from '../../services/CollectionService';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';
import {ToastType} from '../../constants/ToastConstants';
import Toast from 'react-native-toast-message';
import {Share} from 'react-native';
import {Constants} from '../../constants/Constants';

const useCollectionScreenData = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [showPromotionBanner, setShowPromotionBanner] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const collectionDataRef = useRef({});
  const selectedCollectionIds = useRef([]);
  const crossButtonRef = useRef(false);

  const _collectionService = collectionService();

  const {isPortrait} = useOrientationState();

  const numOfColumns = useMemo(() => {
    return isTablet() ? (isPortrait ? 3 : 4) : 2;
  }, [isPortrait]);

  const fetchData = useCallback(() => {
    setIsLoading(true);
    _collectionService.getAllCollections().then(jsonObj => {
      let dataArray = [];
      Object.keys(jsonObj).map(key => {
        const collectionData = jsonObj[key];
        dataArray.push(collectionData);
      });
      for (let i = 0; i < dataArray.length % numOfColumns; i++) {
        dataArray.push({});
      }
      collectionDataRef.current = dataArray;
      const shouldShowPromotion = showPromotion(
        CacheKey.ShowPromotionOnArchives,
      );
      if (!shouldShowPromotion && !isEmpty(collectionDataRef.current)) {
        const oldCacheVal = Cache.getValue(CacheKey.ShowPromotionOnArchives);
        AsyncStorage.set(StoreKeys.ShowPromotionOnArchives, oldCacheVal);
      }
      setShowPromotionBanner(shouldShowPromotion);
      setIsLoading(false);
    });
  }, [_collectionService, numOfColumns]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPortrait]);

  const reloadList = useCallback(() => {
    selectedCollectionIds.current = [];
    setIsEditMode(false);
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    LocalEvent.on(EventTypes.UpdateCollection, reloadList);
    return () => {
      LocalEvent.off(EventTypes.UpdateCollection, reloadList);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCollectionAddSuccess = useCallback(() => {
    setIsEditMode(false);
    fetchData();
  }, [fetchData]);

  const onAddCollectionPress = useCallback(() => {
    LocalEvent.emit(EventTypes.ShowAddCollectionModal, {
      onCollectionAddSuccess,
    });
  }, [onCollectionAddSuccess]);

  const enableCollectionDeleteOption = useCallback(() => {
    selectedCollectionIds.current = [];
    setIsEditMode(true);
  }, []);

  const onDonePress = useCallback(() => {
    selectedCollectionIds.current = [];
    setIsEditMode(false);
  }, []);

  const onRemovePromotionPress = useCallback(() => {
    crossButtonRef.current?.animate('fadeOutLeftBig').then(() => {
      setShowPromotionBanner(false);
      const oldCacheVal = Cache.getValue(CacheKey.ShowPromotionOnArchives);
      AsyncStorage.set(StoreKeys.ShowPromotionOnArchives, oldCacheVal);
      Cache.setValue(CacheKey.ShowPromotionOnArchives, false);
    });
  }, []);

  const onSharePress = useCallback(() => {
    if (selectedCollectionIds.current.length > 0) {
      _collectionService
        .exportCollection(selectedCollectionIds.current)
        .then(url => {
          Share.share({message: `Checkout these archives from Canary ${url}`});
        });
    } else {
      Toast.show({
        type: ToastType.Error,
        text1: 'Select at least one archive to share',
      });
    }
  }, [_collectionService]);

  const onRemoveCollectionsPress = useCallback(() => {
    if (selectedCollectionIds.current.length > 0) {
      LocalEvent.emit(EventTypes.ShowDeleteConfirmationModal, {
        id: selectedCollectionIds.current,
        text:
          selectedCollectionIds.current.length > 1
            ? `Are you sure you want to remove these ${selectedCollectionIds.current.length} selected archives?`
            : 'Are you sure you want to remove this selected archive?',
        onCollectionRemoved: reloadList,
        type: Constants.ConfirmDeleteModalType.Archive,
        testID: 'remove_multiple_collection',
      });
    } else {
      Toast.show({
        type: ToastType.Error,
        text1: 'Select at least one archive to delete',
      });
    }
  }, [reloadList]);

  return {
    aSelectedCollectionIdsRef: selectedCollectionIds,
    bIsPortrait: isPortrait,
    nColumnsCount: numOfColumns,
    bIsLoading: isLoading,
    bShowPromotionBanner: showPromotionBanner,
    bIsEditMode: isEditMode,
    oCollectionDataRef: collectionDataRef,
    oCrossButtonRef: crossButtonRef,
    fnFetchData: fetchData,
    fnReloadList: reloadList,
    fnOnAddCollectionPress: onAddCollectionPress,
    fnEnableCollectionDeleteOption: enableCollectionDeleteOption,
    fnOnDonePress: onDonePress,
    fnOnRemovePromotionPress: onRemovePromotionPress,
    fnOnSharePress: onSharePress,
    fnOnRemoveCollectionsPress: onRemoveCollectionsPress,
  };
};

export default useCollectionScreenData;
