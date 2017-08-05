import Request from '../request';
import Settings from './settings';
import {Session} from 'app/services';

const paginationSize = Settings.PAGINATION_SIZE;
const uriInteractions = Settings.INTERACTIONS_URI;
const uriMessages = Settings.MESSAGES_URI;
const uriReplyOffContact = Settings.REPLY_OFFCONTACT_URI;
const uriSendChatViaEmail = Settings.SEND_CHAT_VIA_EMAIL;
const uriCustomerHistory = Settings.CUSTOMER_HISTORY_URI;
const uriTransfer = Settings.TRANSFER_URI;
const uriWebhook = Settings.WEBHOOK_URI;
const uriRdstation = Settings.RDSTATION_URI;
const uriDiscard = Settings.DISCARD_OFFCONTACT_URI;
const uriInteractionsCount = Settings.INTERACTION_COUNT_URI;
const uriAgentHistory = Settings.AGENT_HISTORY_URI;
const uriReports = Settings.REPORTS;

class InteractionDataSource {
    static getInboxCount (accountId, agentId, profile) {
        const uri = uriInteractionsCount;
        const params = {
            set: {
                'Content-Type': 'text/plain'
            }
        };
        const time = new Date().getTime();

        return Request.do('GET', `${uri}?accountId=${accountId}&agentId=${agentId}&version=2&profile=${profile}&time=${time}`, params);
    }

    static getInteractions (accountId, agentId, profile) {
        const uri = uriInteractions;
        const params = {
            set: {
                'Content-Type': 'text/plain'
            }
        };
        const time = new Date().getTime();

        return Request.do('GET', `${uri}?accountId=${accountId}&agentId=${agentId}&version=2&profile=${profile}&time=${time}`, params);
    }

    static getMessages (sessionId, page = 0) {
        const uri = uriMessages;
        const params = {
            send: {
                'interactionHash': sessionId, // interactionHash
                'initialDate': '',
                'index': page
            },
            set: {
                'Content-Type': 'application/json'
            }
        };

        return Request.do('POST', uri, params);
    }

    static sendOffContactMessage (sessionId, userData, message, toEmail, interactionType) {
        const uri = uriReplyOffContact; // 'http://52.91.218.120:8082/offcontact';
        const params = {
            send: {
                interactionHash: sessionId,
                username: userData.subscriber.username,
                agentId: userData.id,
                info: `${userData.subscriber.username}@${userData.subscriber.domain}`,
                message: message,
                mail: {
                    Source: 'no-reply@mail.omnize.com',
                    ReplyToAddresses: [userData.email],
                    Destination: {
                        ToAddresses: [toEmail]
                    },
                    Message: {
                        Subject: {
                            Data: 'Resposta de Recado - Omnize'
                        },
                        Body: {
                            Html: {
                                Data: ''
                            }
                        }
                    }
                }
            },
            set: {
                'Content-Type': 'application/json'
            }
        };

        if (interactionType === 'email') {
            params.send.isRaw = true;
            params.send.attachments = [];
        }

        return Request.do('POST', uri, params);
    }

    static sendChatContentViaEmail (data) {
        const uri = uriSendChatViaEmail;
        const params = {
            send: {
                type: 'EMAIL_CHATMAIL',
                origin: 9, // ADMIN_WEB = 1, WIDGET = 2
                'account_id': data.accountId,
                'department_id': data.departmentId,
                params: {
                    'interaction_hash': data.sessionId
                },
                mail: {
                    Source: 'no-reply@mail.omnize.com',
                    ReplyToAddresses: [data.agentEmail],
                    Destination: {
                        ToAddresses: data.toEmail
                    },
                    Message: {
                        Subject: {
                            Data: 'Omnize - Chat'
                        },
                        Body: {
                            Html: {
                                Data: ''
                            }
                        }
                    }
                }
            },
            set: {
                'Content-Type': 'application/json'
            }
        };

        return Request.do('POST', uri, params);
    }

    static getRemoteMessages (uri) {
        const params = {
            set: {
                'Content-Type': 'text/plain'
            }
        };

        return Request.do('GET', uri, params);
    }

    static fetchCustomerHistory (customerKey, accountFree) {
        const uri = uriCustomerHistory;
        const params = {
            set: {
                'Content-Type': 'text/plain'
            }
        };

        return Request.do('GET', `${uri}?customerKey=${customerKey}&accountFree=${accountFree}`, params);
    }

    static fetchCustomerHistoryDetail (interactionId) {
        const uri = uriCustomerHistory;
        const params = {
            set: {
                'Content-Type': 'text/plain'
            }
        };

        return Request.do('GET', `${uri}/show/${interactionId}`, params);
    }

    static getTransferAgents () {
        const token = Session.get('omz_token');
        const params = {
            set: {
                'Content-Type': 'text/plain'
            }
        };

        return Request.do('GET', `${uriTransfer}?token=${token}`, params);
    }

    static sendWebhook (data) {
        const uri = uriWebhook;
        const params = {
            send: data,
            set: {
                'Content-Type': 'application/json'
            }
        };

        return Request.do('POST', uri, params);
    }

    static sendRdstation (data) {
        const uri = uriRdstation;
        const params = {
            send: {
                accountId: data.accountId,
                interactionHash: data.interactionHash
            },
            set: {
                'Content-Type': 'application/json'
            }
        };

        return Request.do('POST', uri, params);
    }

    static discardOffcontact (sessionId, agentId) {
        const uri = uriDiscard;
        const params = {
            send: {
                interactionHash: sessionId,
                agentId: agentId
            },
            set: {
                'Content-Type': 'application/json'
            }
        };

        return Request.do('PUT', uri, params);
    }

    static fetchAgentHistory (receiveParams) {
        const params = {
            set: {
                'Content-Type': 'text/plain'
            }
        };
        let uri = uriAgentHistory;

        // *
        uri = uri + `?accountId=${receiveParams.accountId}`;
        uri = uri + `&agentId=${receiveParams.agentId}`;

        // *Pagination
        uri = uri + `&limit=${paginationSize}`;
        uri = uri + `&page=${receiveParams.page || 0}`;

        // Ordenation
        uri = uri + `${receiveParams.headerId ? `&column=${receiveParams.headerId}` : ''}`;
        uri = uri + `${receiveParams.orderDirection ? `&direction=${receiveParams.orderDirection}` : ''}`;

        // Filter
        uri = uri + `${receiveParams.search ? `&search=${receiveParams.search}` : ''}`;
        uri = uri + `${receiveParams.departments ? `&departments=${receiveParams.departments}` : ''}`;
        uri = uri + `${receiveParams.types ? `&types=${receiveParams.types}` : ''}`;
        uri = uri + `${receiveParams.from && receiveParams.from ? `&from=${receiveParams.from}&to=${receiveParams.to}` : ''}`;

        return Request.do('GET', uri, params);
    }

    static fetchLastWeek (accountId) {
        const uri = uriReports;

        return Request.do('GET', `${uri}?id=${accountId}&action=lastweekInteractions`);
    }

    static fetchTalking (accountId) {
        const uri = uriReports;

        return Request.do('GET', `${uri}?id=${accountId}&action=talking`);
    }

    static fetchPending (accountId) {
        const uri = uriReports;

        return Request.do('GET', `${uri}?id=${accountId}&action=pendings`);
    }

    static fetchAnswered (accountId) {
        const uri = uriReports;

        return Request.do('GET', `${uri}?id=${accountId}&action=answered`);
    }

    static fetchNotAnswered (accountId) {
        const uri = uriReports;

        return Request.do('GET', `${uri}?id=${accountId}&action=notAnswered`);
    }
}

export default InteractionDataSource;
