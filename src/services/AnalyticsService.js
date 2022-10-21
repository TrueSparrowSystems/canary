import {PlgTracker} from 'tracker-react-native';
import {AppVersion} from '../../AppVersion';

class AnalyticsService {
  init(appIdentifier, trackerEndpoint) {
    const headerParams = {
      headers: {'User-Agent': `canary/${AppVersion}`},
    };
    PlgTracker.initInstance({appIdentifier, trackerEndpoint, headerParams});
  }

  track(eventEntity, eventAction, extraParams) {
    PlgTracker.dropPixel({eventEntity, eventAction, extraParams});
  }
}

export default new AnalyticsService();
