import alt from 'app/flux/Alt';
import {Account} from 'app/flux/DataSource';
import Honeybadger from 'honeybadger-js';

class AccountActions {
    constructor () {
        this.generateActions(
            'fetchingInfo',
            'fetchedInfo',
            'updatingAccountForm',
            'saving',
            'saved',
            'fetchingScore',
            'fetchedScore',
            'updatingLink',
            'generatingToken',
            'generatedToken',
            'savingLink',
            'savedLink'
        );
    }

    fetchInfo (accountId) {
        const params = {
            status: 'LOADING',
            accountId: accountId
        };

        this.fetchingInfo(params);
        Account.fetchInfo(params).then((results) => {
            params.status = '';
            params.results = results;

            this.fetchedInfo(params);
        }, (error) => {
            if (error.timeout) {
                params.status = 'TIMEOUT';
                this.fetchedInfo(params);
                Honeybadger.notify(error, {
                    name: 'Timeout on Bodylift - Get account information',
                    context: {
                        accountId: params.accountId
                    }
                });
            } else {
                params.status = 'ERROR';
                this.fetchedInfo(params);
                Honeybadger.notify(error, {
                    name: 'Error on Bodylift - Get account information',
                    context: {
                        accountId: params.accountId
                    }
                });
            }
        });
    }

    updateAccountForm (form) {
        this.updatingAccountForm(form);
    }

    save (accountId, accountInfo) {
        const params = {
            accountId: accountId,
            accountInfo: accountInfo,
            status: 'LOADING'
        };

        const onError = (error, type) => {
            if (error.timeout) {
                params.status = 'TIMEOUT';
                this.saved(params);
                Honeybadger.notify(error, {
                    name: 'Timeout on Bodylift - Update account information',
                    context: {accountId: accountId}
                });
            } else {
                params.status = 'ERROR';
                this.saved(params);
                Honeybadger.notify(error, {
                    name: 'Error on Bodylift - Update account information',
                    context: {accountId: accountId}
                });
            }
        };

        this.saving(params);
        Account.save(params).then(() => {
            params.status = 'SUCCESS';
            this.saved(params);

            setTimeout(() => {
                params.status = '';
                this.saved(params);
            }, 2000);
        }, (error) => {
            onError(error, params);
        });
    }

    fetchScore (receivedParams) {
        const params = {
            accountId: receivedParams.accountId,
            status: 'LOADING',
            data: []
        };

        this.fetchingScore(params);
        Account.fetchScore(params.accountId).then((response) => {
            params.data = response;
            params.status = '';
            this.fetchedScore(params);
        }, (error) => {
            if (error.timeout) {
                params.status = 'TIMEOUT';
                this.fetchedScore(params);
                Honeybadger.notify(error, {
                    name: 'REPORTS - Timeout on getting score',
                    context: {accountId: params.accountId}
                });
            } else {
                params.status = 'ERROR';
                this.fetchedScore(params);
                Honeybadger.notify(error, {
                    name: 'REPORTS - Error on getting score',
                    context: {accountId: params.accountId}
                });
            }
        });
    }

    updateLink (link) {
        this.updatingLink(link);
    }

    generateToken (accountId, token) {
        const params = {
            accountId: accountId,
            status: 'LOADING',
            token: ''
        };

        const generateTokenMethod = () => {
            Account.generateToken(params.accountId).then((response) => {
                params.status = '';
                params.token = response.token;
                this.generatedToken(params);
            }, (error) => {
                if (error.timeout) {
                    params.status = 'TIMEOUT';
                    this.generatedToken(params);
                    Honeybadger.notify(error, {
                        name: 'BODYLIFT - Timeout on generating clientSdk token',
                        context: {accountId: params.accountId}
                    });
                } else {
                    params.status = 'ERROR';
                    this.generatedToken(params);
                    Honeybadger.notify(error, {
                        name: 'BODYLIFT - Error on generating clientSdk token',
                        context: {accountId: params.accountId}
                    });
                }
            });
        };

        this.generatingToken(params);
        if (token) {
            Account.deleteToken(params.accountId).then((response) => {
                generateTokenMethod();
            }, (error) => {
                if (error.timeout) {
                    params.status = 'TIMEOUT';
                    this.generatedToken(params);
                    Honeybadger.notify(error, {
                        name: 'BODYLIFT - Timeout on deleting clientSdk token',
                        context: {accountId: params.accountId}
                    });
                } else {
                    params.status = 'ERROR';
                    this.generatedToken(params);
                    Honeybadger.notify(error, {
                        name: 'BODYLIFT - Error on deleting clientSdk token',
                        context: {accountId: params.accountId}
                    });
                }
            });
        } else {
            generateTokenMethod();
        }
    }
}

export default alt.createActions(AccountActions);
