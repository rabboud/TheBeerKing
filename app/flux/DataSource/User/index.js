import Request from '../request';
import Settings from './settings';

const paginationSize = Settings.PAGINATION_SIZE;
const resourceList = Settings.URI_LIST;
const resourceChange = Settings.URI_CHANGE;
const uriReports = Settings.REPORTS;

class UserDataSource {
    static fetchAll (receiveParams) {
        const params = {
            set: {
                'Content-Type': 'text/plain'
            }
        };
        let uri = resourceList;

        // *
        uri = uri + `?accountId=${receiveParams.accountId}`;

        // *Pagination
        uri = uri + `&limit=${paginationSize}`;
        uri = uri + `&page=${receiveParams.page || 0}`;

        // Ordenation
        uri = uri + `${receiveParams.headerId ? `&column=${receiveParams.headerId}` : ''}`;
        uri = uri + `${receiveParams.orderDirection ? `&direction=${receiveParams.orderDirection}` : ''}`;

        // Filter
        uri = uri + `${receiveParams.search ? `&search=${receiveParams.search}` : ''}`;
        uri = uri + `${receiveParams.state ? `&state=${receiveParams.state}` : ''}`;
        uri = uri + `${receiveParams.from && receiveParams.to ? `&from=${receiveParams.from}&to=${receiveParams.to}` : ''}`;

        return Request.do('GET', uri, params);
    }

    static activeUser (userID, agentId) {
        const params = {
            set: {
                'Content-Type': 'application/json'
            },
            send: {
                'agentId': agentId
            }
        };

        return Request.do('PUT', `${resourceChange}/${userID}/active`, params);
    }

    static inactiveUser (userID, agentId) {
        const params = {
            set: {
                'Content-Type': 'application/json'
            },
            send: {
                'agentId': agentId
            }
        };

        return Request.do('PUT', `${resourceChange}/${userID}/inactive`, params);
    }

    static createUser (accountId, user, departments, profiles) {
        const params = {
            set: {
                'Content-Type': 'application/json'
            },
            send: {
                accountId: accountId,
                name: user.name,
                email: user.email,
                password: user.password,
                profiles: profiles,
                departments: departments
            }
        };

        return Request.do('POST', `${resourceChange}`, params);
    }

    static editUser (accountId, user, departments, profiles) {
        const params = {
            set: {
                'Content-Type': 'application/json'
            },
            send: {
                accountId: accountId,
                name: user.name,
                email: user.email,
                photo: user.photo,
                profiles: profiles,
                departments: departments
            }
        };

        if (user.password) {
            params.send.password = user.password;
        }

        return Request.do('PUT', `${resourceChange}/${user.id}`, params);
    }

    static fetchOnline (accountId) {
        const uri = uriReports;

        return Request.do('GET', `${uri}?id=${accountId}&action=usersLogged`);
    }
}

export default UserDataSource;
