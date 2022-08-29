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
      NavigationService.navigate(ScreenName.ImportArchiveScreen, data);

      break;
    case Constants.PageName.List:
      NavigationService.navigate(ScreenName.ImportListScreen, data);
      break;
  }
};
