import {useNavigation} from '@react-navigation/native';
import {useCallback, useRef, useState} from 'react';
import AsyncStorage from '../../services/AsyncStorage';
import {StoreKeys} from '../../services/AsyncStorage/StoreConstants';
import Cache from '../../services/Cache';
import {CacheKey} from '../../services/Cache/CacheStoreConstants';
import PreferencesDataHelper from '../../services/PreferencesDataHelper';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';

const MINIMUM_TOPICS_COUNT = 3;

export function usePreferenceScreenData() {
  const navigation = useNavigation();

  const selectedItemsList = useRef(
    PreferencesDataHelper.getSelectedPreferencesListFromCache() || [],
  );

  const [isDoneButtonEnabled, setIsDoneButtonEnabled] = useState(
    selectedItemsList.current.length >= MINIMUM_TOPICS_COUNT,
  );

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
    const areInitialPrefsSet =
      PreferencesDataHelper.areInitialPreferencesSetInCache();

    Cache.setValue(CacheKey.PreferenceList, selectedItemsList.current);
    AsyncStorage.setItem(
      StoreKeys.PreferenceList,
      selectedItemsList.current,
    ).then(() => {
      if (areInitialPrefsSet) {
        LocalEvent.emit(EventTypes.UpdateTimeline);
        setTimeout(() => {
          navigation.goBack();
        }, 200);
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
