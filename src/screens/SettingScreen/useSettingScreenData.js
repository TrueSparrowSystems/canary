import {useNavigation} from '@react-navigation/native';
import {useCallback} from 'react';
import {Constants} from '../../constants/Constants';
import ScreenName from '../../constants/ScreenName';
import Share from 'react-native-share';
import {Platform} from 'react-native';
import {Canary} from '../../assets/common';

function useSettingScreenData() {
  const navigation = useNavigation();

  const onInfoPress = useCallback(() => {
    navigation.navigate(ScreenName.LandingScreen, {enableBackButton: true});
  }, [navigation]);

  const onShareAppPress = useCallback(() => {
    // Share.share({
    //   message: `Check out Canary app - The incognito mode of Twitter.\n${Constants.GoogleDriveLink}`,
    // });
    const message = 'Canary App Share';
    const options = Platform.select({
      ios: {
        activityItemSources: [
          {
            placeholderItem: {type: 'text', content: message},
            item: {
              default: {
                type: 'text',
                content: `Check out Canary app - The incognito mode of Twitter.\n${Constants.GoogleDriveLink}`,
              },
              message: null,
            },
            linkMetadata: {
              title: message,
              icon: Canary,
            },
          },
        ],
      },
      default: {
        title: 'Canary App Share',
        subject: 'Canary App Share',
        message: `Check out Canary app - The incognito mode of Twitter.\n${Constants.GoogleDriveLink}`,
      },
    });

    Share.open(options).catch(() => {});
  }, []);

  const onPersonalizeFeedPress = useCallback(() => {
    navigation.navigate(ScreenName.PreferenceScreen, {
      isNotOnboardingScreen: true,
    });
  }, [navigation]);

  return {
    fnOnInfoPress: onInfoPress,
    fnOnShareAppPress: onShareAppPress,
    fnOnPersonalizeFeedPress: onPersonalizeFeedPress,
  };
}
export default useSettingScreenData;
