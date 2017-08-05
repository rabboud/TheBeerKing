import alt from 'app/flux/Alt';
import {accountActions} from 'app/flux/Actions';

class AccountStore {
    constructor () {
        this.state = {
            status: '',
            account: {
                id: null,
                name: '',
                email: '',
                domainId: null,
                socialReason: '',
                cpfCnpj: '',
                stateRegistration: '',
                address: '',
                addressNumber: '',
                neighbourhood: '',
                city: '',
                addressState: '',
                mainContact: '',
                zipCode: '',
                primaryPhone: '',
                secondaryPhone: '',
                token: '',
                webhookUrl: ''
            },
            score: {
                status: '',
                data: 0
            }
        };

        this.bindActions(accountActions);
    }

    onFetchingInfo (params) {
        this.state.status = params.status;
    }

    onFetchedInfo (params) {
        if (params.status === 'TIMEOUT' || params.status === 'ERROR') {
            return;
        }

        if (!params.results) {
            this.state.status = 'ENDED';
            return;
        }

        this.state.status = params.status;
        this.state.account.id = params.accountId;
        this.state.account.domainId = params.results.domain_id;

        this.state.account.mainContact = params.results.mainContact;
        this.state.account.email = params.results.email;

        this.state.account.name = params.results.name;
        this.state.account.companyName = params.results.companyName;
        this.state.account.stateRegistration = params.results.stateRegistration;
        this.state.account.cpfCnpj = params.results.cpfcnpj;

        this.state.account.address = params.results.address;
        this.state.account.addressNumber = params.results.addressNumber;
        this.state.account.neighbourhood = params.results.neighbourhood;
        this.state.account.city = params.results.city;
        this.state.account.addressState = params.results.addressState;
        this.state.account.zipCode = params.results.zipCode;
        this.state.account.secondaryPhone = params.results.secondaryPhone;
        this.state.account.primaryPhone = params.results.phone;

        this.state.account.token = params.results.token;
        this.state.account.webhookUrl = params.results.webhookUrl || '';

        this.setState({
            account: this.state.account
        });
    }

    onUpdatingAccountForm (form) {
        this.state.account.mainContact = form.mainContact;
        this.state.account.email = form.email;

        this.state.account.name = form.name;
        this.state.account.companyName = form.companyName;
        this.state.account.stateRegistration = form.stateRegistration;
        this.state.account.cpfCnpj = form.cpfCnpj;

        this.state.account.address = form.address;
        this.state.account.addressNumber = form.addressNumber;
        this.state.account.neighbourhood = form.neighbourhood;
        this.state.account.city = form.city;
        this.state.account.addressState = form.addressState;
        this.state.account.zipCode = form.zipCode;
        this.state.account.secondaryPhone = form.secondaryPhone;
        this.state.account.primaryPhone = form.primaryPhone;

        this.setState({
            account: this.state.account
        });
    }

    onSaving (params) {
        this.state.status = params.status;

        this.setState({
            status: this.state.status
        });
    }

    onSaved (params) {
        this.state.status = params.status;

        this.setState({
            status: this.state.status
        });
    }

    onFetchingScore (params) {
        this.state.score.status = params.status;
    }

    onFetchedScore (params) {
        this.state.score.status = params.status;
        this.state.score.data = params.data.total;
    }

    onGeneratingToken (params) {
        this.state.status = params.status;
    }

    onGeneratedToken (params) {
        this.state.status = params.status;
        this.state.account.token = params.token;
    }

    onUpdatingLink (link) {
        this.state.account.webhookUrl = link;
    }

    onSavingLink (params) {
        this.state.status = params.status;
    }

    onSavedLink (params) {
        this.state.status = params.status;
    }
}

export default alt.createStore(AccountStore, 'accountStore');
