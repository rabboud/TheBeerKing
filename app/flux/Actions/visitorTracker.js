import alt from 'app/flux/Alt';
import {VisitorTracker} from 'app/flux/DataSource';
import Honeybadger from 'honeybadger-js';

class VisitorTrackerActions {
    constructor () {
        this.generateActions(
            'gettingVisitors',
            'gettedVisitors',
            'gettingVisitorDetails',
            'gettedVisitorDetails',
            'updatingFilter',
            'applyingFilter',
            'updatingInvite',
            'updatingDetails',
            'settingCustomerId',
            'settingDepartment',
            'gettingInviteData',
            'gettedInviteData',
            'updatingInviteMessage',
            'updatingInviteDepartment',
            'invitingVisitor',
            'invitedVisitorError',
            'fetchingTotalCount',
            'fetchedTotalCount'
        );
    }

    setCustomerId (customerId) {
        this.settingCustomerId(customerId);
    }

    setDepartment (department) {
        this.settingDepartment(department);
    }

    getVisitors (accountId) {
        if (accountId === 0) {
            const params = {
                error: 'ERROR'
            };

            this.gettedVisitors(params);
            return;
        }
        this.gettingVisitors();
        VisitorTracker.getVisitors(accountId).then((results) => {
            this.gettedVisitors(results);
        }, (error) => {
            const result = {};

            if (error.timeout) {
                result.error = 'TIMEOUT';
                this.gettedVisitors(result);
                Honeybadger.notify(error, {
                    name: 'Timeout on Visitors - Get',
                    context: {accountId: accountId}
                });
            } else {
                result.error = 'ERROR';
                this.gettedVisitors(result);
                Honeybadger.notify(error, {
                    name: 'Error on Visitors - Get',
                    context: {accountId: accountId}
                });
            }
        });
    }

    getVisitorDetails (customerId) {
        this.gettingVisitorDetails();
        VisitorTracker.getVisitorDetails(customerId).then((result) => {
            this.gettedVisitorDetails(result);
        }, (error) => {
            const result = {};

            if (error.timeout) {
                result.error = 'TIMEOUT';
                this.gettedVisitorDetails(result);
                Honeybadger.notify(error, 'Timeout on Visitors - Detail');
            } else {
                result.error = 'ERROR';
                this.gettedVisitorDetails(result);
                Honeybadger.notify(error, 'Error on Visitors - Detail');
            }
        });
    }

    inviteVisitor (customerId, subscriberId, department, message) {
        this.invitingVisitor();
        VisitorTracker.inviteVisitor(customerId, subscriberId, department, message).then((results) => {
            console.log('Invited: ', results);
            this.updateInviteDisplay(false);
            this.setCustomerId('');
        }, (error) => {
            if (error.timeout) {
                this.invitedVisitorError('TIMEOUT');
                Honeybadger.notify(error, 'Timeout on Invite');
            } else {
                this.invitedVisitorError('ERROR');
                Honeybadger.notify(error, 'Error on Invite');
            }
        });
    }

    updateFilter (filter = {}) {
        this.updatingFilter(filter);
    }

    applyFilter () {
        this.applyingFilter();
    }

    updateInviteDisplay (display) {
        this.updatingInvite(display);
    }

    updateDetailsDisplay (display) {
        this.updatingDetails(display);
    }

    getInviteData (agentId) {
        const response = {
            error: '',
            departments: [],
            message: ''
        };

        this.gettingInviteData();
        this.updatingInvite(true);

        VisitorTracker.getInviteData(agentId).then((result) => {
            response.departments = result.departments;
            response.message = result.active_interaction_message;

            this.gettedInviteData(response);
        }, (error) => {
            if (error.timeout) {
                response.error = 'TIMEOUT';
                Honeybadger.notify(error, 'Timeout on Invite - Get data');
            } else {
                response.error = 'ERROR';
                Honeybadger.notify(error, 'Error on Invite - Get data');
            }
            this.gettedInviteData(response);
        });
    }

    updateMessage (message) {
        this.updatingInviteMessage(message);
    }

    updateInviteDepartment (department) {
        this.updatingInviteDepartment(department);
    }

    fetchTotalCount (receivedParams) {
        const params = {
            accountId: receivedParams.accountId,
            status: 'LOADING',
            data: []
        };

        this.fetchingTotalCount(params);
        VisitorTracker.fetchTotalCount(params.accountId).then((response) => {
            params.data = response;
            params.status = '';
            this.fetchedTotalCount(params);
        }, (error) => {
            if (error.timeout) {
                params.status = 'TIMEOUT';
                this.fetchedTotalCount(params);
                Honeybadger.notify(error, {
                    name: 'REPORTS - Timeout on getting visitors',
                    context: {accountId: params.accountId}
                });
            } else {
                params.status = 'ERROR';
                this.fetchedTotalCount(params);
                Honeybadger.notify(error, {
                    name: 'REPORTS - Error on getting visitors',
                    context: {accountId: params.accountId}
                });
            }
        });
    }
}

export default alt.createActions(VisitorTrackerActions);
