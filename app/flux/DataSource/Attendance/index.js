import Request from '../request';
import Settings from './settings';
import {MaskHelper} from 'app/helpers';

const uriCustomers = Settings.CUSTOMERS_URI;
const uriCustomerKey = Settings.PROCESSKEY_URI;
const uriTags = Settings.TAGS_URI;
const uriNotes = Settings.NOTES_URI;
const uriMediaUpload = Settings.MEDIA_UPLOAD_URI;
const uriMeliMsg = Settings.MELI_MSG_URI;
const uriFinishMeliMsg = Settings.FINISH_MELIMSG;

class AttendanceDataSource {
    static saveCustomerInfo (customerInfo) {
        const params = {
            send: {
                customerInfo: {
                    customerId: customerInfo.customerKey,
                    name: customerInfo.name,
                    email: customerInfo.email,
                    phone: customerInfo.phone,
                    cpf: customerInfo.cpf,
                    accountId: customerInfo.accountId,
                    interactionHash: customerInfo.interactionHash
                },
                interactionInfo: {
                    interactionHash: customerInfo.interactionHash,
                    os: customerInfo.so,
                    ip: customerInfo.ip,
                    browser: customerInfo.browser,
                    source: customerInfo.pageSource,
                    accountId: customerInfo.accountId
                }
            }
        };

        return Request.do('POST', uriCustomers, params);
    }

    static searchCustomerInfo (name, accountId) {
        const params = {
            set: {
                'Content-Type': 'text/plain'
            }
        };

        return Request.do('GET', `${uriCustomers}?search=${name}&accountId=${accountId}`, params);
    }

    static processKey (customerInfo) {
        const params = {
            send: {
                action: 'processKey',
                customerKey: customerInfo.customerKey,
                accountId: customerInfo.accountId,
                keys: []
            }
        };

        params.send.keys.push({idType: 'cpf', idValue: customerInfo.cpf});
        params.send.keys.push({idType: 'email', idValue: customerInfo.email});
        params.send.keys.push({idType: 'phone', idValue: customerInfo.phone});


        if (customerInfo.customerId) {
            const customerId = customerInfo.customerId.replace(/["\{\}]/g, '');

            if (customerId !== '' && customerId.indexOf('key') < 0 && customerId.split(':').length > 1) {
                params.send.keys.push({idType: customerId.split(':')[0], idValue: customerId.split(':')[1]});
            }
            if (!params.send.customerKey && customerId !== '' && customerId.indexOf('key') > -1 && customerId.split(':').length > 1) {
                if (customerId.split(':')[1].length > 5) {
                    params.send.customerKey = customerId.split(':')[1];
                }
            }
        } else {
            params.send.customerKey = customerInfo.customerKey;
        }

        return Request.do('POST', uriCustomerKey, params);
    }

    static findCustomer (customerInfo, accountId) {
        const params = {
            send: {
                action: 'findCustomer',
                accountId: accountId,
                keys: []
            }
        };

        params.send.keys.push(`cpf:${MaskHelper.unMaskCpf(customerInfo.cpf)}`);
        params.send.keys.push(`email:${customerInfo.email}`);
        params.send.keys.push(`phone:${MaskHelper.unMaskPhone(customerInfo.phone)}`);

        return Request.do('POST', uriCustomerKey, params);
    }

    static getTags (accountId) {
        const params = {
            set: {
                'Content-Type': 'text/plain'
            }
        };

        return Request.do('GET', `${uriTags}?accountId=${accountId}`, params);
    }

    static getNotes (interactionHash) {
        const params = {
            set: {
                'Content-Type': 'text/plain'
            }
        };

        return Request.do('GET', `${uriNotes}?interactionHash=${interactionHash}`, params);
    }

    static createNote (interactionHash, body, tags, agentId) {
        const params = {
            set: {
                'Content-Type': 'application/json'
            },
            send: {
                interactionHash: interactionHash,
                body: body,
                tagIds: tags,
                agentId: agentId
            }
        };

        return Request.do('POST', uriNotes, params);
    }

    static updateNote (interactionHash, body, tags, agentId, id) {
        const params = {
            set: {
                'Content-Type': 'application/json'
            },
            send: {
                interactionHash: interactionHash,
                body: body,
                tagIds: tags,
                agentId: agentId
            }
        };

        return Request.do('PUT', `${uriNotes}/${id}`, params);
    }

    static uploadFile (buffer, info) {
        const uri = uriMediaUpload;
        const params = {
            send: {
                buffer: buffer,
                fileName: info.name,
                contentType: info.type
            },
            set: {
                'Content-Type': 'application/json'
            }
        };

        return Request.do('POST', uri, params);
    }

    static sendMeliMessage (message, interactionHash, agentId) {
        const uri = uriMeliMsg;
        const params = {
            set: {
                'Content-Type': 'application/json'
            },
            send: {
                interactionHash: interactionHash,
                message: message,
                agentId: agentId
            }
        };

        return Request.do('POST', uri, params);
    }

    static finishMeliMessage (sessionId) {
        const uri = uriFinishMeliMsg;
        const params = {
            set: {
                'Content-Type': 'application/json'
            },
            send: {
                state: 'ENDED'
            }
        };

        return Request.do('PUT', `${uri}/${sessionId}`, params);
    }
}

export default AttendanceDataSource;
