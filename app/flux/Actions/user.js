import alt from 'app/flux/Alt';
import {User} from 'app/flux/DataSource';
import Honeybadger from 'honeybadger-js';
import Crypto from 'crypto-js';

class UserActions {
    constructor () {
        this.generateActions(
            'fetchingAll',
            'fetchedAll',
            'resettingAll',
            'togglingUserState',
            'toggledUserState',
            'changingCurrentUser',
            'updatingCurrentUser',
            'changingSearchValue',
            'fetchingOnline',
            'fetchedOnline'
        );
    }

    fetchAll (receiveParams) {
        const params = {
            accountId: receiveParams.accountId,
            headerId: receiveParams.headerId,
            orderDirection: receiveParams.orderDirection,
            search: receiveParams.search,
            page: receiveParams.page,
            from: receiveParams.from,
            to: receiveParams.to,
            state: receiveParams.state,
            status: 'LOADING',
            results: []
        };

        if (receiveParams.reset) {
            this.resetAll();
        }

        this.fetchingAll(params);
        User.fetchAll(params).then((results) => {
            params.results = results;
            params.status = '';
            this.fetchedAll(params);
        }, (error) => {
            if (error.timeout) {
                params.status = 'TIMEOUT';
                this.fetchedAll(params);
            } else {
                params.status = 'ERROR';
                this.fetchedAll(params);
            }
        });
    }

    resetAll () {
        this.resettingAll();
    }

    toggleUserState (user, userKey, agentId) {
        const params = {
            user: user,
            userKey: userKey
        };
        const onError = (error) => {
            if (error.timeout) {
                params.error = 'TIMEOUT';
                Honeybadger.notify(error, {
                    name: 'Timeout on Bodylift - Change user state',
                    context: {userId: agentId}
                });
                this.toggledUserState(params);
            } else {
                params.error = 'ERROR';
                Honeybadger.notify(error, {
                    name: 'Timeout on Bodylift - Change user state',
                    context: {userId: agentId}
                });
                this.toggledUserState(params);
            }
        };

        if (user.state === 'ACTIVE') {
            this.togglingUserState(params);
            User.inactiveUser(user.id, agentId).then((response) => {
                this.toggledUserState(params);
            }, (error) => {
                onError(error, params);
            });
            return;
        }

        if (user.state === 'INACTIVE') {
            this.togglingUserState(params);
            User.activeUser(user.id, agentId).then((response) => {
                this.toggledUserState(params);
            }, (error) => {
                onError(error, params);
            });
            return;
        }
    }

    _generateHash (password) {
        const passDescrypt = Crypto.SHA256(password);

        return passDescrypt.toString();
    }

    saveUser (accountId, user, departments, profiles, resetAndLoad) {
        if (user.password) {
            user.password = this._generateHash(user.password);
        }

        if (user.type === 'add') {
            User.createUser(accountId, user, departments, profiles).then((result) => {
                resetAndLoad();
            });
        } else {
            User.editUser(accountId, user, departments, profiles).then((result) => {
                resetAndLoad();
            });
        }
    }

    changeCurrentUser (userSelected) {
        this.changingCurrentUser(userSelected);
    }

    updateCurrentUser (user) {
        this.updatingCurrentUser(user);
    }

    updatingCurrentUserPassword (userPassword) {
        this.updatingCurrentUserPassword(this._generateHash(userPassword));
    }

    changeSearchValue (value) {
        this.changingSearchValue(value);
    }

    fetchOnline (receivedParams) {
        const params = {
            accountId: receivedParams.accountId,
            status: 'LOADING',
            data: []
        };

        this.fetchingOnline(params);
        User.fetchOnline(params.accountId).then((response) => {
            params.data = response;
            params.status = '';
            this.fetchedOnline(params);
        }, (error) => {
            if (error.timeout) {
                params.status = 'TIMEOUT';
                this.fetchedOnline(params);
                Honeybadger.notify(error, {
                    name: 'REPORTS - Timeout on getting online users',
                    context: {accountId: params.accountId}
                });
            } else {
                params.status = 'ERROR';
                this.fetchedOnline(params);
                Honeybadger.notify(error, {
                    name: 'REPORTS - Error on getting online users',
                    context: {accountId: params.accountId}
                });
            }
        });
    }
}

export default alt.createActions(UserActions);
