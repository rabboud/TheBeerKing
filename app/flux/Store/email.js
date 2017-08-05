import alt from 'app/flux/Alt';
import {emailActions} from 'app/flux/Actions';
import {EmailModel} from 'app/flux/Model';
import _ from 'lodash';

class EmailStore {
    constructor () {
        this.state = {
            status: '',
            emails: [],
            page: 1,
            search: '',
            currentEmail: {
                status: '',
                type: 'add',
                id: '',
                email: ''
            }
        };

        this.bindActions(emailActions);
    }

    onResettingAll () {
        this.state.emails = [];
        this.state.search = '';
        this.state.status = '';
        this.state.page = 1;
    }

    onFetchingAll (params) {
        this.state.status = params.status;
    }

    onFetchedAll (params) {
        this.state.page = this.state.page + 1;
        this.state.status = params.status;

        if (params.status === 'TIMEOUT' || params.status === 'ERROR') {
            return;
        }

        if (params.results.length === 0) {
            this.state.status = 'ENDED';
            return;
        }

        _.map(params.results, (email) => {
            this.state.emails.push(new EmailModel(email));
        });
    }

    onTogglingState (params) {
        this.state.emails[params.emailKey].state = params.email.state === 'INACTIVE'
            ? 'ACTIVE'
            : 'INACTIVE';
    }

    onToggledState (params) {
        if (params.error) {
            this.state.emails[params.emailKey].state = params.email.state === 'INACTIVE'
                ? 'ACTIVE'
                : 'INACTIVE';
        }
    }

    onSaving (params) {
        this.state.currentEmail.status = params.status;

        this.setState({
            currentEmail: this.state.currentEmail
        });
    }

    onSaved (params) {
        this.state.currentEmail.status = params.status;

        this.setState({
            currentEmail: this.state.currentEmail
        });
    }

    onChangingSearch (value) {
        this.state.search = value;
    }

    onUpdatingCurrent (email) {
        this.state.currentEmail.email = email;

        this.setState({
            currentEmail: this.state.currentEmail
        });
    }

    onChangingCurrent (emailItem) {
        if (emailItem) {
            this.state.currentEmail.type = 'edit';
            this.state.currentEmail.id = emailItem.id;
            this.state.currentEmail.email = emailItem.email;
            this.state.currentEmail.department = emailItem.department;
        } else {
            this.state.currentEmail.type = 'add';
            this.state.currentEmail.id = '';
            this.state.currentEmail.email = '';
            this.state.currentEmail.department = {};
        }

        this.setState({
            currentEmail: this.state.currentEmail
        });
    }
}

export default alt.createStore(EmailStore, 'emailStore');
