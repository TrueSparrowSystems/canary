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
        NavigationService.navigate(ScreenName.CollectionScreen, data);
      }
      break;
    case Constants.PageName.List:
      if (data.length === 1) {
        NavigationService.navigate(ScreenName.ListScreen, data);
      }
      break;
  }
};
