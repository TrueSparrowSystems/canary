import NetInfo from '@react-native-community/netinfo';
import {LocalEvent, EventTypes} from '../utils/LocalEvent';

class NetworkConnection {
  constructor() {
    this.isConnected = null;
    this.isInternetReachable = null;
    this.connectionType = null;

    this.getStatus.bind(this);
    this.isInternetAvailable.bind(this);
    this._updateInternetConnection.bind(this);

    this.unsubscribe = NetInfo.addEventListener(state => {
      this._updateInternetConnection(state);
    });
    this.getStatus();
  }

  async getStatus() {
    const state = await NetInfo.fetch();
    this._updateInternetConnection(state);
  }

  isInternetAvailable() {
    return this.isConnected && this.isInternetReachable;
  }

  _updateInternetConnection(state) {
    this.connectionType = state.type;

    if (
      this.isConnected !== state.isConnected ||
      this.isInternetReachable !== state.isInternetReachable
    ) {
      this.isConnected = state.isConnected;
      this.isInternetReachable = state.isInternetReachable || 1;
      if (this.isConnected && this.isInternetReachable) {
        LocalEvent.emit(EventTypes.Internet.Connected, state);
      } else {
        LocalEvent.emit(EventTypes.Internet.Disconnected, state);
      }
    }
  }
}

let _networkConnection = null;
const networkConnection = () => {
  if (_networkConnection === null) {
    _networkConnection = new NetworkConnection();
  }
  return _networkConnection;
};

const clearNetworkConnection = () => {
  _networkConnection.unsubscribe();
  _networkConnection = null;
};

export {networkConnection, clearNetworkConnection};
