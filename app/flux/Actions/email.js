import alt from 'app/flux/Alt';
import {Email} from 'app/flux/DataSource';
import Honeybadger from 'honeybadger-js';

class EmailActions {
    constructor () {
        this.generateActions(
            'resettingAll',
            'fetchingAll',
            'fetchedAll',
            'togglingState',
            'toggledState',
            'saving',
            'saved',
            'changingSearch',
            'updatingCurrent',
            'changingCurrent'
        );
    }

    resetAll () {
        this.resettingAll();
    }

    fetchAll (params) {
        params.status = 'LOADING';

        if (params.reset) {
            this.resettingAll();
        }

        this.fetchingAll(params);
        Email.fetchAll(params).then((results) => {
            params.status = '';
            params.results = results;

            this.fetchedAll(params);
        }, (error) => {
            if (error.timeout) {
                params.status = 'TIMEOUT';
                this.fetchedAll(params);
                Honeybadger.notify(error, {
                    name: 'Timeout on Bodylift - Get emails',
                    context: {
                        accountId: params.accountId
                    }
                });
            } else {
                params.status = 'ERROR';
                this.fetchedAll(params);
                Honeybadger.notify(error, {
                    name: 'Error on Bodylift - Get emails',
                    context: {
                        accountId: params.accountId
                    }
                });
            }
        });
    }

    toggleState (email, emailKey, agentId) {
        const params = {
            email: email,
            emailKey: emailKey
        };

        console.log(email.state);

        const onError = (error) => {
            if (error.timeout) {
                params.error = 'TIMEOUT';
                Honeybadger.notify(error, {
                    name: 'Timeout on Bodylift - Change email state',
                    context: {userId: agentId}
                });
                this.toggledState(params);
            } else {
                params.error = 'ERROR';
                Honeybadger.notify(error, {
                    name: 'Error on Bodylift - Change email state',
                    context: {userId: agentId}
                });
                this.toggledState(params);
            }
        };

        if (email.state === 'ACTIVE') {
            console.log('toggle Active');
            this.togglingState(params);
            Email.inactive(email.id, agentId).then((response) => {
                this.toggledState(params);
            }, (error) => {
                onError(error, params);
            });
            return;
        }

        if (email.state === 'INACTIVE') {
            console.log('toggle Inactive');
            this.togglingState(params);
            Email.active(email.id, agentId).then((response) => {
                this.toggledState(params);
            }, (error) => {
                onError(error, params);
            });
            return;
        }
    }

    save (accountId, agentId, emailItem, departmentId, resetAndLoad) {
        const params = {
            accountId: accountId,
            agentId: agentId,
            email: emailItem.email,
            emailId: emailItem.id,
            department: departmentId,
            status: 'LOADING'
        };

        const onError = (error, type) => {
            if (error.timeout) {
                params.status = 'TIMEOUT';
                this.saved(params);
                Honeybadger.notify(error, {
                    name: `Timeout on Bodylift - ${type === 'add' ? 'Create' : 'Edit'} email`,
                    context: {accountId: accountId}
                });
            } else {
                params.status = 'ERROR';
                this.saved(params);
                Honeybadger.notify(error, {
                    name: `Error on Bodylift - ${type === 'add' ? 'Create' : 'Edit'} email`,
                    context: {accountId: accountId}
                });
            }
        };

        const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;

        this.saving(params);
        if (params.email.match(emailRegExp) !== null && params.department !== null) {
            if (emailItem.type === 'add') {
                Email.create(params).then(() => {
                    params.status = '';
                    this.saved(params);
                    resetAndLoad();
                }, (error) => {
                    onError(error, params, emailItem.type);
                });
            }

            if (emailItem.type === 'edit') {
                Email.edit(params).then(() => {
                    params.status = '';
                    this.saved(params);
                    resetAndLoad();
                }, (error) => {
                    onError(error, params, emailItem.type);
                });
            }
        } else {
            if (params.department === null) {
                params.status = 'INVALID DEPARTMENT';
            } else {
                params.status = 'INVALID EMAIL';
            }
            this.saved(params);

            setTimeout(() => {
                params.status = '';
                this.saved(params);
            }, 2000);
        }
    }

    changeSearch (value) {
        this.changingSearch(value);
    }

    updateCurrent (email) {
        this.updatingCurrent(email);
    }

    changeCurrent (emailItem) {
        this.changingCurrent(emailItem);
    }
}

export default alt.createActions(EmailActions);
