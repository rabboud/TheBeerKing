import Request from '../request';
import Settings from './settings';

const resourceList = Settings.URI_LIST;
const uriReports = Settings.REPORTS;

class AccountDataSource {
    static fetchInfo (receiveParams) {
        const params = {
            set: {
                'Content-Type': 'text/plain'
            }
        };

        return Request.do('GET', `${resourceList}/${receiveParams.accountId}`, params);
    }

    static save (receiveParams) {
        const params = {
            set: {
                'Content-Type': 'application/json'
            },
            send: {
                name: receiveParams.accountInfo.name ? receiveParams.accountInfo.name : '',
                companyName: receiveParams.accountInfo.companyName ? receiveParams.accountInfo.companyName : '',
                cpfcnpj: receiveParams.accountInfo.cpfCnpj ? receiveParams.accountInfo.cpfCnpj : '',
                stateRegistration: receiveParams.accountInfo.stateRegistration ? receiveParams.accountInfo.stateRegistration : '',
                mainContact: receiveParams.accountInfo.mainContact ? receiveParams.accountInfo.mainContact : '',

                address: receiveParams.accountInfo.address ? receiveParams.accountInfo.address : '',
                addressNumber: receiveParams.accountInfo.addressNumber ? receiveParams.accountInfo.addressNumber : '',
                neighbourhood: receiveParams.accountInfo.neighbourhood ? receiveParams.accountInfo.neighbourhood : '',
                city: receiveParams.accountInfo.city ? receiveParams.accountInfo.city : '',
                addressState: receiveParams.accountInfo.addressState ? receiveParams.accountInfo.addressState : '',
                zipCode: receiveParams.accountInfo.zipCode ? receiveParams.accountInfo.zipCode : '',
                phone: receiveParams.accountInfo.primaryPhone ? receiveParams.accountInfo.primaryPhone : '',
                secondaryPhone: receiveParams.accountInfo.secondaryPhone ? receiveParams.accountInfo.secondaryPhone : '',
                email: receiveParams.accountInfo.email ? receiveParams.accountInfo.email : '',
                webhookUrl: receiveParams.accountInfo.webhookUrl ? receiveParams.accountInfo.webhookUrl : ''
            }
        };

        return Request.do('PUT', `${resourceList}/${receiveParams.accountId}`, params);
    }

    static fetchScore (accountId) {
        const uri = uriReports;

        return Request.do('GET', `${uri}?id=${accountId}&action=scorePercent`);
    }

    static generateToken (accountId) {
        const params = {
            set: {
                'Content-Type': 'text/plain'
            }
        };

        return Request.do('GET', `${resourceList}/${accountId}/token`, params);
    }

    static deleteToken (accountId) {
        const params = {
            set: {
                'Content-Type': 'text/plain'
            }
        };

        return Request.do('DELETE', `${resourceList}/${accountId}/token`, params);
    }
}

export default AccountDataSource;
