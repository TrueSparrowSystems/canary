import {useCallback, useState} from 'react';

/**
 * @param {Function} onDataAvailable Callback function which is called when the flat list data is changed.
 */
export default function useClassListData({onDataAvailable}) {
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
  const onRefresh = useCallback(() => {
    setIsLoading(true);
  }, []);

  /*
   * bIsVisible: Boolean variable which indicates if the list is visible or not.
   * fnOnDataChange: Function which is called when the flat list data is changed.
   */
  return {
    bIsLoading: isLoading,
    fnOnRefresh: onRefresh,
    fnOnDataChange: onDataChange,
  };
}