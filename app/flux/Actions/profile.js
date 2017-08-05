import alt from 'app/flux/Alt';
import {Profile} from 'app/flux/DataSource';
import Honeybadger from 'honeybadger-js';

class ProfileActions {
    constructor () {
        this.generateActions(
            'fetchingAll',
            'fetchedAll',
            'changingProfileSelected',
            'clearingSelecteds'
        );
    }

    fetchAll (receiveParams) {
        const params = {
            accountId: receiveParams.accountId,
            status: 'LOADING',
            results: []
        };

        this.fetchingAll(params);
        Profile.fetchAll(params).then((results) => {
            params.results = results;
            params.status = '';
            this.fetchedAll(params);
        }, (error) => {
            if (error.timeout) {
                params.status = 'TIMEOUT';
                this.fetchedAll(params);
                Honeybadger.notify(error, {
                    name: 'Timeout on Bodylift - Get Profiles',
                    context: {accountId: params.accountId}
                });
            } else {
                params.status = 'ERROR';
                this.fetchedAll(params);
                Honeybadger.notify(error, {
                    name: 'Error on Bodylift - Get Profiles',
                    context: {accountId: params.accountId}
                });
            }
        });
    }

    changeProfileSelected (index, value) {
        const params = {
            index: index,
            value: value
        };

        this.changingProfileSelected(params);
    }

    clearSelecteds () {
        this.clearingSelecteds();
    }
}

export default alt.createActions(ProfileActions);
