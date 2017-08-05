import Request from '../request';
import Settings from './settings';

const paginationSize = Settings.PAGINATION_SIZE;
const resourceList = Settings.URI_LIST;
const resourceChange = Settings.URI_CHANGE;

class WebhookDataSource {
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
        uri = uri + `&limit=${paginationSize ? paginationSize : ''}`;
        uri = uri + `&page=${receiveParams.page || 0}`;

        // Ordenation
        uri = uri + `${receiveParams.headerId ? `&column=${receiveParams.headerId}` : ''}`;
        uri = uri + `${receiveParams.orderDirection ? `&direction=${receiveParams.orderDirection}` : ''}`;

        // Filter
        uri = uri + `${receiveParams.search ? `&search=${receiveParams.search}` : ''}`;
        uri = uri + `${receiveParams.state ? `&state=${receiveParams.state}` : ''}`;

        return Request.do('GET', uri, params);
    }

    static activeWebhook (webhookId, agentId) {
        const params = {
            set: {
                'Content-Type': 'application/json'
            },
            send: {
                'agentId': agentId
            }
        };

        return Request.do('PUT', `${resourceChange}/${webhookId}/active`, params);
    }

    static inactiveWebhook (webhookId, agentId) {
        const params = {
            set: {
                'Content-Type': 'application/json'
            },
            send: {
                'agentId': agentId
            }
        };

        return Request.do('PUT', `${resourceChange}/${webhookId}/inactive`, params);
    }

    static deleteWebhooks (webhookId, agentId) {
        const params = {
            set: {
                'Content-Type': 'application/json'
            },
            send: {
                'agentId': agentId
            }
        };

        return Request.do('DELETE', `${resourceChange}/${webhookId}`, params);
    }

    static create (agentId, webhook, departments, fields) {
        const params = {
            set: {
                'Content-Type': 'application/json'
            },
            send: {
                name: webhook.name,
                url: webhook.url,
                type: webhook.type.id,
                accountId: agentId,
                fields: fields,
                departments: departments,
                state: 1
            }
        };

        return Request.do('POST', `${resourceChange}`, params);
    }

    static edit (webhook, departments, fields) {
        const params = {
            set: {
                'Content-Type': 'application/json'
            },
            send: {
                name: webhook.name,
                url: webhook.url,
                type: webhook.type.id,
                fields: fields,
                departments: departments,
                state: 1
            }
        };

        return Request.do('PUT', `${resourceChange}/${webhook.id}`, params);
    }
}

export default WebhookDataSource;
