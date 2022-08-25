import {Constants} from '../constants/Constants';
import ScreenName from '../constants/ScreenName';
import NavigationService from './NavigationService';
import {getImportData} from './ShareHelper';

export const handleDynamicUrl = url => {
  const importData = getImportData(url);
  if (importData?.error) {
    // TODO : handle
    return importData?.message;
  }
  const {pn: pageName, data} = importData;
  switch (pageName) {
    case Constants.PageName.Archive:
      if (data.length === 1) {
        const navigationProps = {
          collectionName: data[0]?.name,
          isImport: true,
          tweetIds: data[0]?.tweetIds,
        };
        NavigationService.navigate(
          ScreenName.CollectionTweetScreen,
          navigationProps,
        );
      }
      break;
    case Constants.PageName.List:
      NavigationService.navigate(ScreenName.ImportListScreen, data);
      break;
  }
};
