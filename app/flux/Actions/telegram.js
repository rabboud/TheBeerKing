import alt from 'app/flux/Alt';
import {Telegram} from 'app/flux/DataSource';
import Honeybadger from 'honeybadger-js';
import _ from 'underscore';

class TelegramActions {
    constructor () {
        this.generateActions(
            'fetchingAll',
            'fetchedAll',
            'resettingAll',
            'togglingState',
            'toggledState',
            'updatingTelegramsCheck',
            'deletingBots',
            'deletedBots',
            'updatingCurrentTelegram',
            'updatingCountryCheck',
            'changingCurrentTelegram',
            'searchingCountry',
            'connectingTelegram',
            'sendingCodeTelegram',
            'sentCodeTelegram',
            'validatingCodeTelegram',
            'validatedCodeTelegram',
            'saving',
            'saved'
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
        Telegram.fetchAll(params).then((results) => {
            params.status = '';
            params.results = results;

            this.fetchedAll(params);
        }, (error) => {
            if (error.timeout) {
                params.status = 'TIMEOUT';
                this.fetchedAll(params);
                Honeybadger.notify(error, {
                    name: 'Timeout on Bodylift - Get telegram bots',
                    context: {
                        accountId: params.accountId
                    }
                });
            } else {
                params.status = 'ERROR';
                this.fetchedAll(params);
                Honeybadger.notify(error, {
                    name: 'Error on Bodylift - Get telegram bots',
                    context: {
                        accountId: params.accountId
                    }
                });
            }
        });
    }

    toggleState (telegram, telegramKey, agentId) {
        const params = {
            telegram: telegram,
            telegramKey: telegramKey
        };

        const onError = (error) => {
            if (error.timeout) {
                params.error = 'TIMEOUT';
                Honeybadger.notify(error, {
                    name: 'Timeout on Bodylift - Change telegram bot state',
                    context: {userId: agentId}
                });
                this.toggledState(params);
            } else {
                params.error = 'ERROR';
                Honeybadger.notify(error, {
                    name: 'Error on Bodylift - Change telegram bot state',
                    context: {userId: agentId}
                });
                this.toggledState(params);
            }
        };

        if (telegram.state === 'ACTIVE') {
            this.togglingState(params);
            Telegram.inactiveTelegram(telegram.id, agentId).then((response) => {
                this.toggledState(params);
            }, (error) => {
                onError(error, params);
            });
            return;
        }

        if (telegram.state === 'INACTIVE') {
            this.togglingState(params);
            Telegram.activeTelegram(telegram.id, agentId).then((response) => {
                this.toggledState(params);
            }, (error) => {
                onError(error, params);
            });
            return;
        }
    }

    updateTelegramsCheck (telegramIndex, allChecked) {
        const params = {
            telegramIndex: telegramIndex,
            allChecked: allChecked
        };

        this.updatingTelegramsCheck(params);
    }

    deleteBots (telegrams, agentId, resetAndLoad) {
        const params = {
            telegrams: telegrams.join(','),
            agentId: agentId,
            status: 'LOADING'
        };

        this.deletingBots(params);
        Telegram.deleteBots(params.telegrams, params.agentId).then((results) => {
            params.status = '';
            this.deletedBots(params);
            resetAndLoad();
        }, (error) => {
            if (error.timeout) {
                params.status = 'TIMEOUT';
                this.deletedBots(params);
            } else {
                params.status = 'ERROR';
                this.deletedBots(params);
            }
        });
    }

    updateCurrentTelegram (telegramForm) {
        this.updatingCurrentTelegram(telegramForm);
    }

    updateCountryCheck (countryCode) {
        this.updatingCountryCheck(countryCode);
    }

    changeCurrentTelegram (telegramItem) {
        this.changingCurrentTelegram(telegramItem);
    }

    searchCountry (search) {
        this.searchingCountry(search);
    }

    conectTelegram () {
        window.telegramApi.setConfig({
            app: {
                id: 70579, /* App ID */
                hash: '7cdb2cc8bafed9b6acd5ea4781a51d36', /* App hash */
                version: '0.0.1' /* App version */
            },
            server: {
                test: [
                    {id: 1, host: '149.154.175.10', port: 80},
                    {id: 2, host: '149.154.167.40', port: 80},
                    {id: 3, host: '149.154.175.117', port: 80}
                ],
                production: [
                    {id: 1, host: '149.154.175.50', port: 80},
                    {id: 2, host: '149.154.167.51', port: 80},
                    {id: 3, host: '149.154.175.100', port: 80},
                    {id: 4, host: '149.154.167.91', port: 80},
                    {id: 5, host: '149.154.171.5', port: 80}
                ]
            }
        });
    }

    sendCodeTelegram (phone, nextPanel) {
        const params = {
            status: 'SEND CODE',
            phone: phone
        };

        this.sendingCodeTelegram(params);
        window.telegramApi.sendCode(phone).then((response) => {
            params.hashcode = response.phone_code_hash;
            nextPanel();
            this.sentCodeTelegram(params);
        }, (error) => {
            console.error(error.description);
            params.status = 'INVALID PHONE NUMBER';
            this.sentCodeTelegram(params);
            setTimeout(() => {
                params.status = '';
                this.sentCodeTelegram(params);
            }, 2000);
        });
    }

    validateCodeTelegram (phone, hashcode, code, nextPanel) {
        const params = {
            status: 'VALIDATING',
            phone: phone,
            code: code
        };

        this.validatingCodeTelegram(params);
        window.telegramApi.signIn(phone, hashcode, code).then((response) => {
            params.status = 'LOGGED IN';
            this.validatedCodeTelegram(params);
            nextPanel();
        }, (error) => {
            console.error(error.description);
            params.status = 'INVALID PHONE CODE';
            this.validatedCodeTelegram(params);
            setTimeout(() => {
                params.status = '';
                this.validatedCodeTelegram(params);
            }, 2000);
        });
    }

    save (agentId, telegramBot, departments, resetAndLoad) {
        const params = {
            accountId: agentId,
            telegramBot: telegramBot,
            departments: departments,
            status: 'LOADING'
        };

        const onError = (error) => {
            if (error.timeout) {
                params.error = 'TIMEOUT';
                Honeybadger.notify(error, {
                    name: 'Timeout on Bodylift - Update telegram bot',
                    context: {userId: agentId}
                });
                this.toggledState(params);
            } else {
                params.error = 'ERROR';
                Honeybadger.notify(error, {
                    name: 'Error on Bodylift - Update telegram bot',
                    context: {userId: agentId}
                });
                this.toggledState(params);
            }
        };

        const parsedDepartments = [];

        _.map(departments, (department) => {
            parsedDepartments.push({
                id: department.id,
                selected: department.selected
            });
        });

        this.saving(params);
        if (telegramBot.type === 'add') {
            window.telegramApi.startOmniBot(params.telegramBot.botUsername).then((result) => {
                if (result === 'invalid-name') {
                    console.error('Invalid name');
                    return;
                } else if (result === 'name-exist') {
                    console.error('Name exist');
                    return;
                } else if (result === 'save-error') {
                    console.error('Save error');
                    return;
                } else if ('token' in result && 'botName' in result) {
                    params.telegramBot.name = params.telegramBot.botUsername + 'Bot';
                    telegramBot.id = result.token.split(':')[0];
                    telegramBot.hashcode = result.token;

                    // Create webhook
                    Telegram.setWebhook(telegramBot).then((response) => {},
                    (error) => {
                        onError(error, params, telegramBot.type);
                    });

                    Telegram.create(agentId, telegramBot, parsedDepartments).then((saveResults) => {
                        params.status = '';
                        this.saved(params);
                        resetAndLoad();
                    }, (error) => {
                        onError(error, params, telegramBot.type);
                    });
                }
            });
        }

        if (telegramBot.type === 'edit') {
            Telegram.edit(telegramBot, parsedDepartments).then(() => {
                params.status = '';
                this.saved(params);
                resetAndLoad();
            }, (error) => {
                onError(error, params, telegramBot.type);
            });
        }
    }
}

export default alt.createActions(TelegramActions);
