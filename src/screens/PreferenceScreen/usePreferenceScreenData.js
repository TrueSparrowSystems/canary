import {useNavigation} from '@react-navigation/native';
import {useCallback, useRef, useState} from 'react';
import AsyncStorage from '../../services/AsyncStorage';
import {StoreKeys} from '../../services/AsyncStorage/StoreConstants';
import Cache from '../../services/Cache';
import {CacheKey} from '../../services/Cache/CacheStoreConstants';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';

const MINIMUM_TOPICS_COUNT = 3;

export function usePreferenceScreenData() {
  const [isDoneButtonEnabled, setIsDoneButtonEnabled] = useState(false);

  const navigation = useNavigation();

  const selectedItemsList = useRef([]);

  const onSelectedItemsUpdate = useCallback(
    (list = []) => {
      if (list.length >= MINIMUM_TOPICS_COUNT) {
        selectedItemsList.current = list;

        if (isDoneButtonEnabled === false) {
          setIsDoneButtonEnabled(true);
        }
      } else {
        if (isDoneButtonEnabled === true) {
          setIsDoneButtonEnabled(false);
        }
      }
    },
    [isDoneButtonEnabled],
  );

  const onDonePress = useCallback(() => {
    const areInitialPrefsSet = Cache.getValue(
      CacheKey.AreInitialPreferencesSet,
    );

    Cache.setValue(CacheKey.PreferenceList, selectedItemsList.current);
    AsyncStorage.setItem(
      StoreKeys.PreferenceList,
      selectedItemsList.current,
    ).then(() => {
      if (areInitialPrefsSet) {
        navigation.goBack();
      } else {
        AsyncStorage.setItem(StoreKeys.AreInitialPreferencesSet, true).then(
          () => {
            Cache.setValue(CacheKey.AreInitialPreferencesSet, true);
            //Change Stack
            LocalEvent.emit(EventTypes.SwitchToHomeStack);
          },
        );
      }
    });
  }, [navigation]);

  return {
    bIsDoneButtonEnabled: isDoneButtonEnabled,
    fnOnSelectedItemsUpdate: onSelectedItemsUpdate,
    fnOnDonePress: onDonePress,
  };
}
