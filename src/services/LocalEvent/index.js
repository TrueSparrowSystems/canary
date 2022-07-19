import EventEmitter from 'eventemitter3';

/**
 * Instance of the event emitter.
 */
export const LocalEvent = new EventEmitter();

/**
 * Map of all the event keys used in the project.
 */
export const EventTypes = {
  UI: {
    Loader: {
      Show: 'event_type_ui_loader_show',
      Hide: 'event_type_ui_loader_hide',
    },
    Toast: {
      Show: 'event_type_ui_toast_show',
      Hide: 'event_type_ui_toast_hide',
    },
  },
};

/**
 * @function triggerEvent Function to trigger an event of type `eventType` with data `data`.
 * @public
 * @param eventType Type of event to be triggered.
 * @param data Data to be send to the subscriber of the event.
 * @returns {void}
 */
export function triggerEvent(eventType, ...data) {
  LocalEvent.emit(eventType, data);
}
