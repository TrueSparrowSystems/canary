import EventEmitter from 'eventemitter3';

export const LocalEvent = new EventEmitter();
export const EventTypes = {
  Internet: {
    Connected: 'INTERNET_CONNECTED',
    Disconnected: 'INTERNET_DISCONNECTED',
  },
};
