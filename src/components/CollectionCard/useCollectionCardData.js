import {useNavigation} from '@react-navigation/native';
import {useCallback, useEffect, useRef, useState} from 'react';
import {Share} from 'react-native';
import {Constants} from '../../constants/Constants';
import ScreenName from '../../constants/ScreenName';
import AnalyticsService from '../../services/AnalyticsService';
import {collectionService} from '../../services/CollectionService';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';

const useCollectionCardData = props => {
  const {data, onCollectionRemoved, enableDelete, selectedCollectionIds} =
    props;

  const {name: collectionName, id: collectionId} = data;

  const viewRef = useRef(null);

  const _collectionService = collectionService();

  const [isCollectionSelected, setIsCollectionSelected] = useState(false);
  const [isPopOverVisible, setIsPopOverVisible] = useState(false);

  const navigation = useNavigation();

  const onCollectionRemove = useCallback(() => {
    hidePopover();
    LocalEvent.emit(EventTypes.ShowDeleteConfirmationModal, {
      id: collectionId,
      name: collectionName,
      onCollectionRemoved: () => {
        viewRef.current.animate('bounceOut').then(() => {
          onCollectionRemoved();
        });
      },
      type: Constants.ConfirmDeleteModalType.Archive,
      testID: 'remove_archive',
    });
  }, [collectionId, collectionName, hidePopover, onCollectionRemoved]);

  const onCollectionSelect = useCallback(() => {
    setIsCollectionSelected(prevVal => {
      if (prevVal) {
        selectedCollectionIds.splice(
          selectedCollectionIds.indexOf(collectionId),
          1,
        );
      } else {
        selectedCollectionIds.push(collectionId);
      }
      return !prevVal;
    });
  }, [collectionId, selectedCollectionIds]);

  const onShareCollectionPress = useCallback(() => {
    AnalyticsService.track(
      Constants.TrackerConstants.EventEntities.Button + '_' + 'archive_share',
      Constants.TrackerConstants.EventActions.Press,
    );

    hidePopover();
    _collectionService
      .exportCollection([collectionId])
      .then(res => {
        Share.share({message: res});
      })
      .catch(() => {});
  }, [_collectionService, collectionId, hidePopover]);

  const onCollectionPress = useCallback(() => {
    navigation.navigate(ScreenName.CollectionTweetScreen, {
      collectionId,
      collectionName,
    });
  }, [collectionId, collectionName, navigation]);

  const onEditCollectionPress = useCallback(() => {
    hidePopover();
    LocalEvent.emit(EventTypes.ShowAddCollectionModal, {
      name: collectionName,
      id: collectionId,
    });
  }, [collectionId, collectionName, hidePopover]);

  const showPopover = useCallback(() => {
    setIsPopOverVisible(true);
  }, []);

  const hidePopover = useCallback(() => {
    setIsPopOverVisible(false);
  }, []);

  const fnOnLongPress = useCallback(() => {
    showPopover();
  }, [showPopover]);

  useEffect(() => {
    if (enableDelete) {
      setIsCollectionSelected(false);
    }
  }, [enableDelete]);

  return {
    oViewRef: viewRef,
    bIsCollectionSelected: isCollectionSelected,
    bIsPopOverVisible: isPopOverVisible,
    fnHidePopover: hidePopover,
    fnOnCollectionRemove: onCollectionRemove,
    fnOnCollectionSelect: onCollectionSelect,
    fnOnCollectionPress: onCollectionPress,
    fnOnEditCollectionPress: onEditCollectionPress,
    fnOnShareCollectionPress: onShareCollectionPress,
    fnOnLongPress,
  };
};

export default useCollectionCardData;
