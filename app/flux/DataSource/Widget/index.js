import Request from '../request';
import Settings from './settings';

const resourceAppearance = Settings.URI_APPEARANCE;

class WidgetDataSource {
    static fetchAppearance (accountId) {
        const params = {
            set: {
                'Content-Type': 'text/plain'
            }
        };

        return Request.do('GET', `${resourceAppearance}?accountId=${accountId}`, params);
    }

    static updateAppearance (receivedParams) {
        const params = {
            set: {
                'Content-Type': 'application/json'
            },
            send: receivedParams.send
        };

        return Request.do('PUT', `${resourceAppearance}/${receivedParams.id}`, params);
    }
}

export default WidgetDataSource;
