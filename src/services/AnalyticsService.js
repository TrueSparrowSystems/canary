import {PlgTracker} from 'tracker-react-native';

class AnalyticsService {
  init(appIdentifier, trackerEndpoint) {
    PlgTracker.initInstance({appIdentifier, trackerEndpoint});
  }

  track(eventEntity, eventAction, extraParams) {
    PlgTracker.dropPixel({eventEntity, eventAction, extraParams});
  }
}

export default new AnalyticsService();
