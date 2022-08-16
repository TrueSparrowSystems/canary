import {useCallback, useRef, useState} from 'react';
import {Share} from 'react-native';
import {Constants} from '../../constants/Constants';

/**
 * @param {Function} onDataAvailable Callback function which is called when the flat list data is changed.
 */
export default function useTimelineListData({
  listDataSource,
  onDataAvailable,
  onRefresh,
}) {
  const viewRef = useRef();
  const [showCard, setShowCard] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const onDataChange = useCallback(
    listData => {
      setIsLoading(false);
      if (listData.length > 0) {
        onDataAvailable &&
          onDataAvailable({data: listData, isDataAvailable: true});
        !isVisible && setIsVisible(true);
      } else {
        onDataAvailable &&
          onDataAvailable({data: listData, isDataAvailable: false});
        isVisible && setIsVisible(false);
      }
    },
    [isVisible, onDataAvailable],
  );
  const _onRefresh = useCallback(() => {
    setIsLoading(true);
    listDataSource?.switchApiModeToDefault?.();
    onRefresh?.();
  }, [listDataSource, onRefresh]);

  const onShareAppPress = useCallback(() => {
    Share.share({
      message: `Check out Canary app - The incognito mode of Twitter.\n${Constants.GoogleDriveLink}`,
    });
  }, []);

  const onCloseShareCardPress = useCallback(() => {
    viewRef.current.animate('fadeOutLeftBig').then(() => {
      setShowCard(false);
    });
  }, []);

  /*
   * bIsVisible: Boolean variable which indicates if the list is visible or not.
   * fnOnDataChange: Function which is called when the flat list data is changed.
   */
  return {
    bIsLoading: isLoading,
    bShowCard: showCard,
    crossButtonRef: viewRef,
    fnOnDataChange: onDataChange,
    fnOnRefresh: _onRefresh,
    fnOnShareAppPress: onShareAppPress,
    fnOnCloseShareCardPress: onCloseShareCardPress,
  };
}
