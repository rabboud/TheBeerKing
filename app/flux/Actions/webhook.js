import alt from 'app/flux/Alt';
import {Webhook} from 'app/flux/DataSource';
import Honeybadger from 'honeybadger-js';
import _ from 'lodash';

class WebhookActions {
    constructor () {
        this.generateActions(
            'fetchingAll',
            'fetchedAll',
            'resettingAll',
            'togglingState',
            'toggledState',
            'updatingDataDepartment',
            'updatingWebhookCheck',
            'changingSearch',
            'deletingWebhooks',
            'deletedWebhooks',
            'changingCurrent',
            'changingSearch',
            'togglingState',
            'toggledState',
            'changingCurrentName',
            'saving',
            'saved',
            'updatingCurrentWebhook',
            'updatingCurrentType',
            'updatingCurrentDepartment',
            'updatingCurrentService',
            'changingCurrentWebhook'
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
        Webhook.fetchAll(params).then((results) => {
            params.status = '';
            params.results = results;

            this.fetchedAll(params);
        }, (error) => {
            if (error.timeout) {
                params.status = 'TIMEOUT';
                this.fetchedAll(params);
                Honeybadger.notify(error, {
                    name: 'Timeout on Bodylift - Get departments',
                    context: {
                        accountId: params.accountId
                    }
                });
            } else {
                params.status = 'ERROR';
                this.fetchedAll(params);
                Honeybadger.notify(error, {
                    name: 'Error on Bodylift - Get departments',
                    context: {
                        accountId: params.accountId
                    }
                });
            }
        });
    }

    changeSearch (value) {
        this.changingSearch(value);
    }

    changeCurrent (departmentSelected) {
        this.changingCurrent(departmentSelected);
    }

    changeCurrentName (name) {
        this.changingCurrentName(name);
    }

    toggleState (department, departmentKey, agentId) {
        const params = {
            department: department,
            departmentKey: departmentKey
        };

        const onError = (error) => {
            if (error.timeout) {
                params.error = 'TIMEOUT';
                Honeybadger.notify(error, {
                    name: 'Timeout on Bodylift - Change department state',
                    context: {userId: agentId}
                });
                this.toggledState(params);
            } else {
                params.error = 'ERROR';
                Honeybadger.notify(error, {
                    name: 'Error on Bodylift - Change department state',
                    context: {userId: agentId}
                });
                this.toggledState(params);
            }
        };

        if (department.state === 'ACTIVE') {
            this.togglingState(params);
            Webhook.inactiveDepartment(department.id, agentId).then((response) => {
                this.toggledState(params);
            }, (error) => {
                onError(error, params);
            });
            return;
        }

        if (department.state === 'INACTIVE') {
            this.togglingState(params);
            Webhook.activeDepartment(department.id, agentId).then((response) => {
                this.toggledState(params);
            }, (error) => {
                onError(error, params);
            });
            return;
        }
    }

    deleteWebhooks (webhooks, agentId, resetAndLoad) {
        const params = {
            webhooks: webhooks.join(','),
            agentId: agentId,
            status: 'LOADING'
        };

        this.deletingWebhooks(params);
        Webhook.deleteWebhooks(params.webhooks, params.agentId).then((results) => {
            params.status = '';
            this.deletedWebhooks(params);
            resetAndLoad();
        }, (error) => {
            if (error.timeout) {
                params.status = 'TIMEOUT';
                this.deletedWebhooks(params);
            } else {
                params.status = 'ERROR';
                this.deletedWebhooks(params);
            }
        });
    }

    updateWebhookCheck (webhookIndex, allChecked) {
        const params = {
            webhookIndex: webhookIndex,
            allChecked: allChecked
        };

        this.onUpdatingFilter(params);
    }

    updateDataDepartment (departments) {
        this.updatingDataDepartment(departments);
    }

    changeCurrentWebhook (webhookItem) {
        this.changingCurrentWebhook(webhookItem);
    }

    updateCurrentWebhook (index) {
        this.updatingCurrentWebhook(index);
    }

    updateCurrentType (index) {
        this.updatingCurrentType(index);
    }

    updateCurrentDepartment (index) {
        this.updatingCurrentDepartment(index);
    }

    updateCurrentService (index) {
        this.updatingCurrentService(index);
    }

    save (accountId, webhook, departments, resetAndLoad) {
        const params = {
            accountId: accountId,
            webhook: webhook,
            departments: departments,
            status: 'LOADING'
        };

        const onError = (error, request) => {
            if (error.timeout) {
                params.status = 'TIMEOUT';
                this.saved(params);
                Honeybadger.notify(error, {
                    name: `Timeout on Bodylift - ${request === 'add' ? 'Create' : 'Edit'} webhook`,
                    context: {accountId: accountId}
                });
            } else {
                params.status = 'ERROR';
                this.saved(params);
                Honeybadger.notify(error, {
                    name: `Error on Bodylift - ${request === 'add' ? 'Create' : 'Edit'} webhook`,
                    context: {accountId: accountId}
                });
            }
        };

        this.saving(params);
        if (webhook.request === 'add') {
            const fields = this.updateFields(webhook.fields);

            Webhook.create(accountId, webhook, departments, fields).then(() => {
                params.status = '';
                this.saved(params);
                resetAndLoad();
            }, (error) => {
                onError(error, params, webhook.request);
            });
        }

        if (webhook.request === 'edit') {
            const fields = this.updateFields(webhook.fields);

            Webhook.edit(webhook, departments, fields).then(() => {
                params.status = '';
                this.saved(params);
                resetAndLoad();
            }, (error) => {
                onError(error, params, webhook.request);
            });
        }
    }

    updateFields (fields) {
        const sendField = {};

        _.map(fields, (option, key) => {
            sendField[option.id] = option.selected;
        });
        return JSON.stringify(sendField);
    }
}

export default alt.createActions(WebhookActions);
