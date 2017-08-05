import alt from 'app/flux/Alt';
import _ from 'lodash';
import {OfficeHours} from 'app/flux/DataSource';
import Honeybadger from 'honeybadger-js';

class OfficeHoursActions {
    constructor () {
        this.generateActions(
            'fetchingTimezones',
            'fetchedTimezones',
            'fetchingAll',
            'fetchedAll',
            'resettingAll',
            'togglingState',
            'toggledState',
            'deletingOfficeHours',
            'deletedOfficeHours',
            'updatingOfficeHourCheck',
            'updatingCurrentOfficeHour',
            'updatingSelectPeriods',
            'updatingSelectTimezones',
            'changingCurrentOfficeHour',
            'saving',
            'saved'
        );
    }

    resetAll () {
        this.resettingAll();
    }

    fetchTimezones () {
        const params = {
            status: 'LOADING'
        };

        this.fetchingTimezones(params);

        OfficeHours.fetchTimezones().then((results) => {
            params.status = '';
            params.results = results;

            this.fetchedTimezones(params);
        }, (error) => {
            if (error.timeout) {
                params.status = 'TIMEOUT';
                this.fetchedTimezones(params);
                Honeybadger.notify(error, {
                    name: 'Timeout on Bodylift - Get timezones',
                    context: {
                        accountId: params.accountId
                    }
                });
            } else {
                params.status = 'ERROR';
                this.fetchedTimezones(params);
                Honeybadger.notify(error, {
                    name: 'Error on Bodylift - Get timezones',
                    context: {
                        accountId: params.accountId
                    }
                });
            }
        });
    }

    fetchAll (params) {
        params.status = 'LOADING';

        if (params.reset) {
            this.resettingAll();
        }

        this.fetchingAll(params);
        OfficeHours.fetchAll(params).then((results) => {
            params.status = '';
            params.results = results;

            this.fetchedAll(params);
        }, (error) => {
            if (error.timeout) {
                params.status = 'TIMEOUT';
                this.fetchedAll(params);
                Honeybadger.notify(error, {
                    name: 'Timeout on Bodylift - Get office hours',
                    context: {
                        accountId: params.accountId
                    }
                });
            } else {
                params.status = 'ERROR';
                this.fetchedAll(params);
                Honeybadger.notify(error, {
                    name: 'Error on Bodylift - Get office hours',
                    context: {
                        accountId: params.accountId
                    }
                });
            }
        });
    }

    toggleState (officeHour, officeHourKey, agentId) {
        const params = {
            officeHour: officeHour,
            officeHourKey: officeHourKey
        };

        const onError = (error) => {
            if (error.timeout) {
                params.error = 'TIMEOUT';
                Honeybadger.notify(error, {
                    name: 'Timeout on Bodylift - Change office hour state',
                    context: {userId: agentId}
                });
                this.toggledState(params);
            } else {
                params.error = 'ERROR';
                Honeybadger.notify(error, {
                    name: 'Error on Bodylift - Change office hour state',
                    context: {userId: agentId}
                });
                this.toggledState(params);
            }
        };

        if (officeHour.state === 'ACTIVE') {
            this.togglingState(params);
            OfficeHours.inactiveOfficeHour(officeHour.id, agentId).then((response) => {
                this.toggledState(params);
            }, (error) => {
                onError(error, params);
            });
            return;
        }

        if (officeHour.state === 'INACTIVE') {
            this.togglingState(params);
            OfficeHours.activeOfficeHour(officeHour.id, agentId).then((response) => {
                this.toggledState(params);
            }, (error) => {
                onError(error, params);
            });
            return;
        }
    }

    deleteOfficeHours (officeHours, agentId, resetAndLoad) {
        const params = {
            officeHours: officeHours.join(','),
            agentId: agentId,
            status: 'LOADING'
        };

        this.deletingOfficeHours(params);
        OfficeHours.deleteOfficeHours(params.officeHours, params.agentId).then((results) => {
            params.status = '';
            this.deletedOfficeHours(params);
            resetAndLoad();
        }, (error) => {
            if (error.timeout) {
                params.status = 'TIMEOUT';
                Honeybadger.notify(error, {
                    name: 'Timeout on Bodylift - Delete office hour state',
                    context: {userId: agentId}
                });

                this.deletedOfficeHours(params);
            } else {
                params.status = 'ERROR';
                Honeybadger.notify(error, {
                    name: 'Error on Bodylift - Delete office hour state',
                    context: {userId: agentId}
                });

                this.deletedOfficeHours(params);
            }
        });
    }

    updateOfficeHourCheck (officeHourIndex, allChecked) {
        const params = {
            officeHourIndex: officeHourIndex,
            allChecked: allChecked
        };

        this.updatingOfficeHourCheck(params);
    }

    changeCurrentOfficeHour (officeHourItem) {
        this.changingCurrentOfficeHour(officeHourItem);
    }

    updateCurrentOfficeHour (officeHour) {
        this.updatingCurrentOfficeHour(officeHour);
    }

    updateSelectPeriods (day) {
        this.updatingSelectPeriods(day);
    }

    updateSelectTimezones (timezoneId) {
        this.updatingSelectTimezones(timezoneId);
    }

    save (accountId, officeHour, resetAndLoad) {
        const params = {
            accountId: accountId,
            officeHour: officeHour,
            status: 'LOADING'
        };

        const onError = (error, type) => {
            if (error.timeout) {
                params.status = 'TIMEOUT';
                this.saved(params);
                Honeybadger.notify(error, {
                    name: `Timeout on Bodylift - ${type === 'add' ? 'Create' : 'Edit'} office hour`,
                    context: {accountId: accountId}
                });
            } else {
                params.status = 'ERROR';
                this.saved(params);
                Honeybadger.notify(error, {
                    name: `Error on Bodylift - ${type === 'add' ? 'Create' : 'Edit'} office hour`,
                    context: {accountId: accountId}
                });
            }
        };

        const days = [];

        _.map(officeHour.period, (day) => {
            days.push(day.selected);
        });

        this.saving(params);
        if (officeHour.type === 'add') {
            OfficeHours.create(accountId, officeHour, days).then(() => {
                params.status = '';
                this.saved(params);
                resetAndLoad();
            }, (error) => {
                onError(error, params, officeHour.type);
            });
        }

        if (officeHour.type === 'edit') {
            OfficeHours.edit(officeHour, days).then(() => {
                params.status = '';
                this.saved(params);
                resetAndLoad();
            }, (error) => {
                onError(error, params, officeHour.type);
            });
        }
    }
}

export default alt.createActions(OfficeHoursActions);
