import settings from '../../settings.json';

import VueMatomo from 'vue-matomo';

const matomoEnabled = settings.matomo && settings.matomo.enabled;

function matomoOptions(router) {
    if (matomoEnabled)
        return {
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
        };

    return {};
}

export { matomoEnabled, VueMatomo, matomoOptions };
