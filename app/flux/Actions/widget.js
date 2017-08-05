import alt from 'app/flux/Alt';
import Honeybadger from 'honeybadger-js';
import {Widget} from 'app/flux/DataSource';

class WidgetActions {
    constructor () {
        this.generateActions(
            'fetchingAppearance',
            'fetchedAppearance',
            'loading',
            'updatingAppearance',
            'updatedAppearance',
            'savingValue'
        );
    }

    fetchAppearance (receivedParams) {
        const params = {
            accountId: receivedParams.accountId,
            status: 'LOADING',
            result: {}
        };

        this.fetchingAppearance(params);
        Widget.fetchAppearance(params.accountId).then((result) => {
            params.result = result;
            this.fetchedAppearance(params);
        }, (error) => {
            if (error.timeout) {
                params.status = 'TIMEOUT';
                this.fetchedAppearance(params);
                Honeybadger.notify(error, {
                    name: 'Timeout on Bodylift - GET Appearance',
                    context: {accountId: params.accountId}
                });
            } else {
                params.status = 'ERROR';
                this.fetchedAppearance(params);
                Honeybadger.notify(error, {
                    name: 'Error on Bodylift - GET Appearance',
                    context: {accountId: params.accountId}
                });
            }
        });
    }

    updateAppearance (accountId, field, value, id) {
        const params = {
            accountId: accountId,
            send: {},
            field: field,
            value: value,
            status: 'LOADING',
            id: id
        };

        params.send[field] = value;

        this.updatingAppearance(params);
        Widget.updateAppearance(params).then((result) => {
            params.status = '';
            params.result = result;
            this.updatedAppearance(params);
        }, (error) => {
            if (error.timeout) {
                params.status = 'TIMEOUT';
                this.updatedAppearance(params);
                Honeybadger.notify(error, {
                    name: 'TIMEOUT on Bodylift - PUT Appearance',
                    context: {accountId: params.accountId}
                });
            } else {
                params.status = 'ERROR';
                this.updatedAppearance(params);
                Honeybadger.notify(error, {
                    name: 'ERROR on Bodylift - PUT Appearance',
                    context: {accountId: params.accountId}
                });
            }
        });
    }

    saveValue (field, value) {
        const params = {
            field: field,
            value: value
        };

        this.savingValue(params);
    }
}

export default alt.createActions(WidgetActions);
