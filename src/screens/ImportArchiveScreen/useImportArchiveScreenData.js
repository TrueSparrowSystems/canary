import {isArray} from 'lodash';
import {useCallback, useRef, useState} from 'react';
import ScreenName from '../../constants/ScreenName';
import {ToastPosition, ToastType} from '../../constants/ToastConstants';
import {collectionService} from '../../services/CollectionService';
import NavigationService from '../../services/NavigationService';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';
import Toast from 'react-native-toast-message';

const useImportArchiveScreenData = data => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const isImportingInProgressRef = useRef(false);
  const archivesDataRef = useRef([...data]);
  const [archiveDataState, setArchiveDataState] = useState(
    archivesDataRef.current,
  );

  const onArchiveTweetRemove = useCallback(
    tweetId => {
      const currentArchiveTweetIdsData =
        archivesDataRef.current[selectedIndex]?.tweetIds;
      if (isArray(currentArchiveTweetIdsData)) {
        const selectedUserIndex = currentArchiveTweetIdsData?.indexOf(tweetId);
        currentArchiveTweetIdsData?.splice(selectedUserIndex, 1);
        setArchiveDataState([...archivesDataRef.current]);
      }
    },
    [selectedIndex],
  );
  const onArchiveRemove = useCallback(index => {
    if (index < archivesDataRef.current.length && index >= 0) {
      archivesDataRef.current.splice(index, 1);
      if (
        index === archivesDataRef.current.length &&
        archivesDataRef.current.length !== 0
      ) {
        setSelectedIndex(archivesDataRef.current.length - 1);
      }
      setArchiveDataState([...archivesDataRef.current]);
    }
  }, []);

  const navigateToHomescreen = useCallback(() => {
    NavigationService.navigate(ScreenName.TimelineScreen);
  }, []);

  const onImportPress = useCallback(() => {
    if (isImportingInProgressRef.current) {
      return;
    }
    isImportingInProgressRef.current = true;
    LocalEvent.emit(EventTypes.CommonLoader.Show);
    collectionService()
      .importMultipleCollections(archivesDataRef.current)
      .then(() => {
        LocalEvent.emit(EventTypes.CommonLoader.Hide);
        LocalEvent.emit(EventTypes.UpdateCollection);
        Toast.show({
          type: ToastType.Success,
          text1: 'Archive import successful.',
          position: ToastPosition.Top,
        });
      })
      .catch(err => {
        LocalEvent.emit(EventTypes.CommonLoader.Hide);
        Toast.show({
          type: ToastType.Error,
          text1: err,
          position: ToastPosition.Top,
        });
      })
      .finally(() => {
        LocalEvent.emit(EventTypes.CommonLoader.Hide);
        NavigationService.navigate(ScreenName.CollectionScreen);
        isImportingInProgressRef.current = false;
      });
  }, []);

  const onTweetCardPress = useCallback(() => {
    Toast.show({
      type: ToastType.Info,
      text1: 'Import archive to interact with this tweet.',
      position: ToastPosition.Top,
    });
  }, []);

  return {
    aData: archivesDataRef.current,
    nSelectedIndex: selectedIndex,
    fnUpdateSelectedIndex: setSelectedIndex,
    fnOnArchiveTweetRemove: onArchiveTweetRemove,
    fnOnArchiveRemove: onArchiveRemove,
    fnNavigateToHomescreen: navigateToHomescreen,
    fnOnImportPress: onImportPress,
    fnOnTweetCardPress: onTweetCardPress,
  };
};

export default useImportArchiveScreenData;
