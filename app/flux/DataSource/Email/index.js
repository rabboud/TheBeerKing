import Request from '../request';
import Settings from './settings';

const paginationSize = Settings.PAGINATION_SIZE;
const resourceList = Settings.URI_LIST;
const resourceChange = Settings.URI_CHANGE;

class EmailDataSource {
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

        // Filter
        uri = uri + `${receiveParams.search ? `&search=${receiveParams.search}` : ''}`;
        uri = uri + `${receiveParams.state ? `&state=${receiveParams.state}` : ''}`;

        return Request.do('GET', uri, params);
    }

    static active (emailId, agentId) {
        const params = {
            set: {
                'Content-Type': 'application/json'
            },
            send: {
                'agentId': agentId
            }
        };

        return Request.do('PUT', `${resourceChange}/${emailId}/active`, params);
    }

    static inactive (emailId, agentId) {
        const params = {
            set: {
                'Content-Type': 'application/json'
            },
            send: {
                'agentId': agentId
            }
        };

        return Request.do('PUT', `${resourceChange}/${emailId}/inactive`, params);
    }

    static create (receiveParams) {
        const params = {
            set: {
                'Content-Type': 'application/json'
            },
            send: {
                email: receiveParams.email,
                accountId: receiveParams.accountId,
                departmentId: receiveParams.department,
                agentId: receiveParams.agentId,
                state: 1
            }
        };

        return Request.do('POST', `${resourceChange}`, params);
    }

    static edit (receiveParams) {
        const params = {
            set: {
                'Content-Type': 'application/json'
            },
            send: {
                email: receiveParams.email,
                departmentId: receiveParams.department
            }
        };

        return Request.do('PUT', `${resourceChange}/${receiveParams.emailId}`, params);
    }
}

export default EmailDataSource;
