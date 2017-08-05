import Request from '../request';
import Settings from './settings';

const resourceList = Settings.URI_LIST;
const resourceChange = Settings.URI_CHANGE;

class FacebookDataSource {
    static fetchAll (receiveParams) {
        const params = {
            set: {
                'Content-Type': 'text/plain'
            }
        };

        let uri = resourceList;

        // *
        uri = uri + `?accountId=${receiveParams.accountId}`;

        return Request.do('GET', uri, params);
    }

    static activeFacebook (facebookId, agentId) {
        const params = {
            set: {
                'Content-Type': 'application/json'
            },
            send: {
                'agentId': agentId
            }
        };

        return Request.do('PUT', `${resourceChange}/${facebookId}/active`, params);
    }

    static inactiveFacebook (facebookId, agentId) {
        const params = {
            set: {
                'Content-Type': 'application/json'
            },
            send: {
                'agentId': agentId
            }
        };

        return Request.do('PUT', `${resourceChange}/${facebookId}/inactive`, params);
    }

    static deletePages (pages, agentId) {
        const params = {
            set: {
                'Content-Type': 'application/json'
            },
            send: {
                'agentId': agentId
            }
        };

        return Request.do('DELETE', `${resourceChange}/${pages}`, params);
    }

    static create (accountId, facebookPage, facebookUser, departmentId) {
        const params = {
            set: {
                'Content-Type': 'application/json'
            },
            send: {
                accountId: accountId,
                departmentId: departmentId,
                id: facebookPage.page.id,
                name: facebookPage.page.name,
                accessToken: facebookPage.page.accessToken,
                about: facebookPage.page.about,
                pictureUrl: facebookPage.page.photo,
                adminName: facebookUser.name,
                adminEmail: facebookUser.email
            }
        };

        return Request.do('POST', `${resourceChange}`, params);
    }

    static edit (facebookPage, facebookUser, departmentId) {
        const params = {
            set: {
                'Content-Type': 'application/json'
            },
            send: {
                department: departmentId,
                name: facebookPage.page.name,
                accessToken: facebookUser.accessToken,
                about: facebookPage.page.about,
                pictureUrl: facebookPage.page.photo,
                adminName: facebookUser.name,
                adminEmail: facebookUser.email
            }
        };

        return Request.do('PUT', `${resourceChange}/${facebookPage.id}`, params);
    }
}

export default FacebookDataSource;
