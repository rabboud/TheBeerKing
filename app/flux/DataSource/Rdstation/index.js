import Request from '../request';
import Settings from './settings';

const resourceList = Settings.URI_LIST;
const resourceChange = Settings.URI_CHANGE;

class RdstationDataSource {
    static fetchInfo (accountId) {
        const params = {
            set: {
                'Content-Type': 'text/plain'
            }
        };

        return Request.do('GET', `${resourceList}?accountId=${accountId}`, params);
    }

    static active (id) {
        const params = {
            set: {
                'Content-Type': 'application/json'
            }
        };

        return Request.do('PUT', `${resourceChange}/${id}/active`, params);
    }

    static inactive (id) {
        const params = {
            set: {
                'Content-Type': 'application/json'
            }
        };

        return Request.do('PUT', `${resourceChange}/${id}/inactive`, params);
    }

    static create (accountId, token) {
        const params = {
            set: {
                'Content-Type': 'application/json'
            },
            send: {
                token: token,
                accountId: accountId,
                active: 1
            }
        };

        return Request.do('POST', `${resourceChange}`, params);
    }

    static update (id, token) {
        const params = {
            set: {
                'Content-Type': 'application/json'
            },
            send: {
                token: token
            }
        };

        return Request.do('PUT', `${resourceChange}/${id}`, params);
    }
}

export default RdstationDataSource;
