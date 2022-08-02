import EventEmitter from 'eventemitter3';

export const LocalEvent = new EventEmitter();
export const EventTypes = {
  SwitchToHomeStack: 'event_types_switch_to_home_stack',
  BottomSheets: {
    CloseBottomSheet: 'event_types_bottom_sheets_close_bottom_sheet',
  },
  Internet: {
    Connected: 'event_types_internet_connected',
    Disconnected: 'event_types_internet_disconnected',
  },
  ShowAddToCollectionModal: 'event_types_show_add_to_collection_modal',
  ShowAddToListModal: 'event_types_show_add_to_list_modal',
  ShowAddCollectionModal: 'event_types_show_add_collection_modal',
  ShowAddListModal: 'event_types_show_add_list_modal',
  UpdateTimeline: 'event_types_update_timeline',
  UpdateCollection: 'event_types_update_collection',
  UpdateList: 'event_types_update_list',
  OnTrendingTopicClick: 'on_trending_topic_click',
  LocationSelectionChanged: 'event_types_location_selection_changed',
};
