import EventEmitter from 'eventemitter3';

export const LocalEvent = new EventEmitter();
export const EventTypes = {
  SwitchToHomeStack: 'event_types_switch_to_home_stack',
  BottomSheets: {
    CloseBottomSheet: 'event_types_bottom_sheets_close_bottom_sheet',
  },
  CommonLoader: {
    Show: 'show',
    Hide: 'hide',
  },
  Internet: {
    Connected: 'event_types_internet_connected',
    Disconnected: 'event_types_internet_disconnected',
  },
  ShowAddToCollectionModal: 'event_types_show_add_to_collection_modal',
  ShowAddToListModal: 'event_types_show_add_to_list_modal',
  ShowAddCollectionModal: 'event_types_show_add_collection_modal',
  ShowDeleteConfirmationModal: 'show_delete_confirmation_modal',
  ShowRedirectConfirmationModal: 'show_redirect_confirmation_modal',
  ShowCommonConfirmationModal: 'show_common_confirmation_modal',
  ShowAddListModal: 'event_types_show_add_list_modal',
  ShowSearchUserModal: 'event_types_show_search_user_modal',
  UpdateTimeline: 'event_types_update_timeline',
  UpdateCollection: 'event_types_update_collection',
  UpdateList: 'event_types_update_list',
  LocationSelectionChanged: 'event_types_location_selection_changed',
  OpenImageViewer: 'open_image_viewer',
  AppState: {
    Active: 'app_state_active',
    InActive: 'app_state_inactive',
    Background: 'app_state_background',
  },
};
