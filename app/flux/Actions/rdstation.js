import alt from 'app/flux/Alt';
import {Rdstation} from 'app/flux/DataSource';
import Honeybadger from 'honeybadger-js';

class RdstationActions {
    constructor () {
        this.generateActions(
            'fetchingInfo',
            'fetchedInfo',
            'updatingToken',
            'saving',
            'saved',
            'togglingState',
            'toggledState'
        );
    }

    fetchInfo (accountId) {
        const params = {
            status: 'LOADING',
            accountId: accountId
        };

        this.fetchingInfo(params);
        Rdstation.fetchInfo(params.accountId).then((result) => {
            params.status = '';
            params.result = result;

            this.fetchedInfo(params);
        }, (error) => {
            if (error.timeout) {
                params.status = 'TIMEOUT';
                this.fetchedInfo(params);
                Honeybadger.notify(error, {
                    name: 'Timeout on Bodylift - Get RDStation',
                    context: {
                        accountId: params.accountId
                    }
                });
            } else {
                params.status = 'ERROR';
                this.fetchedInfo(params);
                Honeybadger.notify(error, {
                    name: 'Error on Bodylift - Get RDStation',
                    context: {
                        accountId: params.accountId
                    }
                });
            }
        });
    }

    updateToken (token) {
        this.updatingToken(token);
    }

    save (accountId, token, id) {
        const params = {
            accountId: accountId,
            token: token,
            id: id,
            status: 'LOADING'
        };
        const onError = (error) => {
            if (error.timeout) {
                params.status = 'TIMEOUT';
                this.saved(params);
                Honeybadger.notify(error, {
                    name: `Timeout on Bodylift - RDStation`,
                    context: {accountId: accountId}
                });
            } else {
                params.status = 'ERROR';
                this.saved(params);
                Honeybadger.notify(error, {
                    name: `Error on Bodylift - RDStation`,
                    context: {accountId: accountId}
                });
            }
        };

        this.saving(params);
        if (params.id === 0) {
            Rdstation.create(accountId, params.token).then(() => {
                params.status = '';
                this.saved(params);
            }, (error) => {
                onError(error);
            });
        } else {
            Rdstation.update(params.id, token).then(() => {
                params.status = '';
                this.saved(params);
            }, (error) => {
                onError(error);
            });
        }
    }

    toggleState (accountId, id, active) {
        const params = {
            accountId: accountId,
            id: id,
            active: active,
            status: 'LOADING'
        };
        const onError = (error) => {
            if (error.timeout) {
                params.status = 'TIMEOUT';
                this.toggledState(params);
                Honeybadger.notify(error, {
                    name: `Timeout on Bodylift - RDStation`,
                    context: {accountId: accountId}
                });
            } else {
                params.status = 'ERROR';
                this.toggledState(params);
                Honeybadger.notify(error, {
                    name: `Error on Bodylift - RDStation`,
                    context: {accountId: accountId}
                });
            }
        };

        this.togglingState(params);
        if (params.active) {
            Rdstation.inactive(params.id).then(() => {
                params.status = '';
                this.toggledState(params);
            }, (error) => {
                onError(error);
            });
        } else {
            Rdstation.active(params.id).then(() => {
                params.status = '';
                this.toggledState(params);
            }, (error) => {
                onError(error);
            });
        }
    }
}

export default alt.createActions(RdstationActions);
