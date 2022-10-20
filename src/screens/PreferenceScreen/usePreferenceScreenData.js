import {useNavigation} from '@react-navigation/native';
import {useCallback, useRef, useState} from 'react';
import {Constants} from '../../constants/Constants';
import AnalyticsService from '../../services/AnalyticsService';
import AsyncStorage from '../../services/AsyncStorage';
import {StoreKeys} from '../../services/AsyncStorage/StoreConstants';
import Cache from '../../services/Cache';
import {CacheKey} from '../../services/Cache/CacheStoreConstants';
import PreferencesDataHelper from '../../services/PreferencesDataHelper';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';

const MINIMUM_TOPICS_COUNT = 3;

export function usePreferenceScreenData() {
  const navigation = useNavigation();

  const isVerifiedUsersSelectedRef = useRef(
    PreferencesDataHelper.getVerifiedUsersPreferenceFromCache(),
  );
  const [isVerifiedUsersSelected, setIsVerifiedUsersSelected] = useState(
    isVerifiedUsersSelectedRef.current,
  );

  const selectedItemsList = useRef(
    PreferencesDataHelper.getSelectedPreferencesListFromCache() || [],
  );

  const [isDoneButtonEnabled, setIsDoneButtonEnabled] = useState(
    selectedItemsList.current.length >= MINIMUM_TOPICS_COUNT,
  );

  const toggleUserPrefSelection = useCallback(() => {
    isVerifiedUsersSelectedRef.current = !isVerifiedUsersSelectedRef.current;
    setIsVerifiedUsersSelected(prevVal => !prevVal);
  }, []);

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
    AnalyticsService.track(
      Constants.TrackerConstants.EventEntities.Button +
        '_' +
        'save_preferences',
      Constants.TrackerConstants.EventActions.Press,
      {
        selected_topic_list: selectedItemsList.current,
        verified_user_preference: isVerifiedUsersSelectedRef.current
          ? 'Verified Users Only'
          : 'All Users',
      },
    );
    const areInitialPrefsSet =
      PreferencesDataHelper.areInitialPreferencesSetInCache();

    Cache.setValue(CacheKey.PreferenceList, selectedItemsList.current);
    Cache.setValue(
      CacheKey.ShouldShowTimelineFromVerifiedUsersOnly,
      isVerifiedUsersSelectedRef.current,
    );
    AsyncStorage.setItem(
      StoreKeys.PreferenceList,
      selectedItemsList.current,
    ).then(() => {
      AsyncStorage.setItem(
        StoreKeys.ShouldShowTimelineFromVerifiedUsersOnly,
        isVerifiedUsersSelectedRef.current,
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
    });
  }, [navigation]);

  return {
    bIsDoneButtonEnabled: isDoneButtonEnabled,
    bIsVerifiedUsersSelected: isVerifiedUsersSelected,
    fnToggleUserPrefSelection: toggleUserPrefSelection,
    fnOnSelectedItemsUpdate: onSelectedItemsUpdate,
    fnOnDonePress: onDonePress,
  };
}
