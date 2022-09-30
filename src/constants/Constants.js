import {StoreKeys} from '../services/AsyncStorage/StoreConstants';
import ScreenName from './ScreenName';

export const Constants = {
  PlgWorksLink: 'https://www.plgworks.com',
  GoogleDriveLink:
    'https://drive.google.com/drive/folders/1OCA8czAIVEaGfU-F6EUL8fMwdnRerKdP?usp=sharing',
  DeepLinkUrl: 'https://plgworkscanary.page.link',
  FirebaseDatabaseUrl:
    'https://canary-8ff4c-default-rtdb.us-central1.firebasedatabase.app',
  FirebaseDatabasePath: '/users/',
  ApiModes: {
    //Verified with relevency with context
    VerifiedRelevent: 'verified_relevent',
    //Verified with recency with context
    VerifiedRecent: 'verified_recent',
    //All user with relevency with context
    AllUsersRelevent: 'all_users_relevent',
    //All Tweets with relevency without context
    AllResults: 'all_results',
  },
  CardTypes: {
    ShareCard: 'share_card',
    TweetCard: 'tweet_card',
  },
  SortOrder: {
    Relevancy: 'relevancy',
    Recency: 'recency',
  },
  PageName: {
    Archive: 'archive',
    List: 'list',
    Restore: 'restore',
  },
  ConfirmDeleteModalType: {
    Archive: 'confirm_delete_modal_type_archive',
    List: 'confirm_delete_modal_type_list',
  },
  WorldWideWoeidData: {
    country: '',
    countryCode: null,
    name: 'Worldwide',
    parentid: 0,
    placeType: {code: 19, name: 'Supername'},
    url: 'http://where.yahooapis.com/v1/place/1',
    woeid: 1,
  },
  Encryption: {salt: 'plg_canary', cost: 5000, length: 256},
  KeysForBackup: [
    StoreKeys.PreferenceList,
    StoreKeys.AreInitialPreferencesSet,
    StoreKeys.CollectionsList,
    StoreKeys.Lists,
    StoreKeys.BookmarkedTweetsList,
    StoreKeys.UserToListMap,
    StoreKeys.ShouldShowTimelineFromVerifiedUsersOnly,
  ],
  KeysForClear: [
    StoreKeys.PreferenceList,
    StoreKeys.AreInitialPreferencesSet,
    StoreKeys.CollectionsList,
    StoreKeys.Lists,
    StoreKeys.BookmarkedTweetsList,
    StoreKeys.UserToListMap,
    StoreKeys.ShouldShowTimelineFromVerifiedUsersOnly,
    StoreKeys.IsRedirectModalHidden,
    StoreKeys.ShowPromotionOnArchives,
    StoreKeys.ShowPromotionOnLists,
  ],
  ScreensToIgnoreForTabBarVisibility: {
    Tablet: [
      ScreenName.LandingScreen,
      ScreenName.InAppPdfViewerScreen,
      ScreenName.ImportListScreen,
      ScreenName.ImportArchiveScreen,
    ],
    Mobile: [
      ScreenName.PreferenceScreen,
      ScreenName.ThreadScreen,
      ScreenName.ImageViewScreen,
      ScreenName.VideoPlayerScreen,
      ScreenName.LandingScreen,
      ScreenName.ImportListScreen,
      ScreenName.ImportArchiveScreen,
      ScreenName.SettingScreen,
      ScreenName.BackupIntroductionScreen,
      ScreenName.BackupScreen,
      ScreenName.RestoreScreen,
      ScreenName.InAppPdfViewerScreen,
    ],
  },
  //Todo: update pdf link when available
  Pdf: 'https://www.wto.org/english/thewto_e/procurement_e/terms_conditions_e.pdf',
};
