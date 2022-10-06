import {Constants} from '../constants/Constants';
import ScreenName from '../constants/ScreenName';
import {EventTypes, LocalEvent} from '../utils/LocalEvent';
import NavigationService from './NavigationService';
import {getImportData} from './ShareHelper';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {firebase} from '@react-native-firebase/database';

export const handleDynamicUrl = url => {
  const importData = getImportData(url);
  if (importData?.error) {
    // TODO : handle
    return importData?.message;
  }
  const {pn: pageName, data} = importData;
  LocalEvent.emit(EventTypes.CloseAllModals);

  switch (pageName) {
    case Constants.PageName.Archive:
      NavigationService.navigate(ScreenName.ImportArchiveScreen, {data});

      break;
    case Constants.PageName.List:
      NavigationService.navigate(ScreenName.ImportListScreen, {data});
      break;
    case Constants.PageName.Restore:
      dynamicLinks()
        .buildShortLink(
          {
            link: url,
            domainUriPrefix: Constants.DeepLinkUrl,
            android: {
              // TODO: See if we can get this using some function?
              packageName: 'com.personalized_twitter',
            },
          },
          firebase.dynamicLinks.ShortLinkType.DEFAULT,
        )
        .then(backupUrl => {
          NavigationService.navigate(ScreenName.RestoreScreen, {
            data,
            backupUrl,
          });
        });
      break;
  }
};
