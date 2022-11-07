import settings from '../../settings.json';

import { router } from '../router';
import VueMatomo from 'vue-matomo';

const matomoEnabled = settings.matomo && settings.matomo.enabled;

const matomoOptions = matomoEnabled
  ? {
      host: settings.matomo.host,
      siteId: settings.matomo.siteId,
      trackerFileName: 'matomo',
      router: router,
      enableLinkTracking: true,
      requireConsent: false, // todo true
      trackInitialView: true,
      disableCookies: true,
      enableHeartBeatTimer: false,
      heartBeatTimerInterval: 15,
      debug: false,
      userId: undefined,
      cookieDomain: undefined,
      domains: undefined,
      preInitActions: [],
    }
  : {};

export { matomoEnabled, VueMatomo, matomoOptions };
