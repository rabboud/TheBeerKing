import Request from '../request';
import Settings from './settings';

const resourceList = Settings.URI_LIST;
const resourceChange = Settings.URI_CHANGE;
const uriReports = Settings.REPORTS;

class TagDataSource {
    static fetchAll (receiveParams) {
        const params = {
            set: {
                'Content-Type': 'text/plain'
            }
        };

        return Request.do(
            'GET',
            `${resourceList}?accountId=${receiveParams.accountId}&limit=20&page=${receiveParams.page || 0}${receiveParams.headerId ? `&column=${receiveParams.headerId}` : ''}${receiveParams.orderDirection ? `&direction=${receiveParams.orderDirection}` : ''}&search=${receiveParams.search || ''}&state=${receiveParams.state || ''}&agents=${receiveParams.agents || ''}&from=${receiveParams.from || ''}&to=${receiveParams.to || ''}`,
            params
        );
    }

    static activeTag (tagId, agentId) {
        const params = {
            set: {
                'Content-Type': 'application/json'
            },
            send: {
                'agentId': agentId
            }
        };

        return Request.do('PUT', `${resourceChange}/${tagId}/active`, params);
    }

    static inactiveTag (tagId, agentId) {
        const params = {
            set: {
                'Content-Type': 'application/json'
            },
            send: {
                'agentId': agentId
            }
        };

        return Request.do('PUT', `${resourceChange}/${tagId}/inactive`, params);
    }

    static deleteTags (tagId, agentId) {
        const params = {
            set: {
                'Content-Type': 'application/json'
            },
            send: {
                'agentId': agentId
            }
        };

        return Request.do('DELETE', `${resourceChange}/${tagId}`, params);
    }

    static createTag (agentId, accountId, tag) {
        const params = {
            set: {
                'Content-Type': 'application/json'
            },
            send: {
                'agentId': agentId,
                'name': tag.name,
                'baseColor': tag.color,
                'accountId': accountId,
                'state': 1
            }
        };

        return Request.do('POST', `${resourceChange}`, params);
    }

    static updateTag (agentId, tag) {
        const params = {
            set: {
                'Content-Type': 'application/json'
            },
            send: {
                'agentId': agentId,
                'name': tag.name,
                'baseColor': tag.color
            }
        };

        return Request.do('PUT', `${resourceChange}/${tag.id}`, params);
    }

    static fetchUseCount (accountId) {
        const uri = uriReports;

        return Request.do('GET', `${uri}?id=${accountId}&action=countTags`);
    }
}

export default TagDataSource;
