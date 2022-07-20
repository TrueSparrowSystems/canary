import EventEmitter from 'eventemitter3';

export const LocalEvent = new EventEmitter();
export const EventTypes = {
  ShowAddCollectionModal: 'show_add_collection_modal',
};
