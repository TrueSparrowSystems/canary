import EventEmitter from 'eventemitter3';

export const LocalEvent = new EventEmitter();

export const EventTypes = {
  SwitchToHomeStack: 'event_types_switch_to_home_stack',
};
