import Request from '../request';
import Settings from './settings';

const paginationSize = Settings.PAGINATION_SIZE;
const resourceList = Settings.URI_LIST;
const resourceChange = Settings.URI_CHANGE;

class DepartmentDataSource {
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
        uri = uri + `${receiveParams.agents ? `&agents=${receiveParams.agents}` : ''}`;
        uri = uri + `${receiveParams.state ? `&state=${receiveParams.state}` : ''}`;

        return Request.do('GET', uri, params);
    }

    static activeDepartment (departmentId, agentId) {
        const params = {
            set: {
                'Content-Type': 'application/json'
            },
            send: {
                'agentId': agentId
            }
        };

        return Request.do('PUT', `${resourceChange}/${departmentId}/active`, params);
    }

    static inactiveDepartment (departmentId, agentId) {
        const params = {
            set: {
                'Content-Type': 'application/json'
            },
            send: {
                'agentId': agentId
            }
        };

        return Request.do('PUT', `${resourceChange}/${departmentId}/inactive`, params);
    }

    static create (accountId, name, channels, agents) {
        const params = {
            set: {
                'Content-Type': 'application/json'
            },
            send: {
                accountId: accountId,
                name: name,
                channels: channels,
                agents: agents
            }
        };

        return Request.do('POST', `${resourceChange}`, params);
    }

    static edit (departmentId, departmentName, channels, agents) {
        const params = {
            set: {
                'Content-Type': 'application/json'
            },
            send: {
                name: departmentName,
                channels: channels,
                agents: agents
            }
        };

        return Request.do('PUT', `${resourceChange}/${departmentId}`, params);
    }
}

export default DepartmentDataSource;
