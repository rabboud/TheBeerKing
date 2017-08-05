import Request from '../request';
import Settings from './settings';

const resourceList = Settings.URI_LIST;
const resourceChange = Settings.URI_CHANGE;
const telegramApiBot = Settings.TELEGRAM_API_BOT;
const telegramApiGw = Settings.TELEGRAM_API_GW;

class TelegramDataSource {
    static fetchAll (receiveParams) {
        const params = {
            set: {
                'Content-Type': 'text/plain'
            }
        };

        let uri = resourceList;

        // *
        uri = uri + `?accountId=${receiveParams.accountId}`;

        // Ordenation
        uri = uri + `${receiveParams.headerId ? `&column=${receiveParams.headerId}` : ''}`;
        uri = uri + `${receiveParams.orderDirection ? `&direction=${receiveParams.orderDirection}` : ''}`;

        // Filter
        uri = uri + `${receiveParams.state ? `&state=${receiveParams.state}` : ''}`;

        return Request.do('GET', uri, params);
    }

    static activeTelegram (telegramId, agentId) {
        const params = {
            set: {
                'Content-Type': 'application/json'
            },
            send: {
                'agentId': agentId
            }
        };

        return Request.do('PUT', `${resourceChange}/${telegramId}/active`, params);
    }

    static inactiveTelegram (telegramId, agentId) {
        const params = {
            set: {
                'Content-Type': 'application/json'
            },
            send: {
                'agentId': agentId
            }
        };

        return Request.do('PUT', `${resourceChange}/${telegramId}/inactive`, params);
    }

    static deleteBots (telegramId, agentId) {
        const params = {
            set: {
                'Content-Type': 'application/json'
            },
            send: {
                'agentId': agentId
            }
        };

        return Request.do('DELETE', `${resourceChange}/${telegramId}`, params);
    }

    static create (accountId, telegramBot, departments) {
        const params = {
            set: {
                'Content-Type': 'application/json'
            },
            send: {
                accountId: accountId,
                departments: departments,
                phone: telegramBot.phone.replace(/\-/g, ''),
                country: telegramBot.country,
                botId: telegramBot.id,
                botAlias: telegramBot.botUsername,
                botUsername: telegramBot.botUsername + 'Bot',
                botToken: telegramBot.hashcode
            }
        };


        return Request.do('POST', `${resourceChange}`, params);
    }

    static edit (telegramBot, departments) {
        const params = {
            set: {
                'Content-Type': 'application/json'
            },
            send: {
                botAlias: telegramBot.botUsername,
                departments: departments
            }
        };

        return Request.do('PUT', `${resourceChange}/${telegramBot.id}`, params);
    }

    static setWebhook (telegramBot) {
        const params = {
            set: {
                'Content-Type': 'application/json'
            },
            send: {
                url: `${telegramApiGw}?token=${telegramBot.id}`
            }
        };

        return Request.do('POST', `${telegramApiBot}/bot${telegramBot.hashcode}/setWebhook`, params);
    }
}

export default TelegramDataSource;
