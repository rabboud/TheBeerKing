import alt from 'app/flux/Alt';
import {Department} from 'app/flux/DataSource';
import Honeybadger from 'honeybadger-js';

class DepartmentActions {
    constructor () {
        this.generateActions(
            'fetchingAll',
            'fetchedAll',
            'resettingAll',
            'changingCurrent',
            'changingSearch',
            'togglingState',
            'toggledState',
            'changingCurrentName',
            'saving',
            'saved',
            'selectingSingle',
            'selectingDepartment',
            'selectingAllDepartments',
            'resetingSelectedDepartments'
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
        Department.fetchAll(params).then((results) => {
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
            Department.inactiveDepartment(department.id, agentId).then((response) => {
                this.toggledState(params);
            }, (error) => {
                onError(error, params);
            });
            return;
        }

        if (department.state === 'INACTIVE') {
            this.togglingState(params);
            Department.activeDepartment(department.id, agentId).then((response) => {
                this.toggledState(params);
            }, (error) => {
                onError(error, params);
            });
            return;
        }
    }

    save (accountId, department, channels, agents, resetAndLoad) {
        const params = {
            accountId: accountId,
            department: department,
            channels: channels,
            agents: agents,
            status: 'LOADING'
        };

        const onError = (error, type) => {
            if (error.timeout) {
                params.status = 'TIMEOUT';
                this.saved(params);
                Honeybadger.notify(error, {
                    name: `Timeout on Bodylift - ${type === 'add' ? 'Create' : 'Edit'} department`,
                    context: {accountId: accountId}
                });
            } else {
                params.status = 'ERROR';
                this.saved(params);
                Honeybadger.notify(error, {
                    name: `Error on Bodylift - ${type === 'add' ? 'Create' : 'Edit'} department`,
                    context: {accountId: accountId}
                });
            }
        };

        this.saving(params);
        if (department.type === 'add') {
            Department.create(accountId, department.name, channels, agents).then(() => {
                params.status = '';
                this.saved(params);
                resetAndLoad();
            }, (error) => {
                onError(error, params, department.type);
            });
        }

        if (department.type === 'edit') {
            Department.edit(department.id, department.name, channels, agents).then(() => {
                params.status = '';
                this.saved(params);
                resetAndLoad();
            }, (error) => {
                onError(error, params, department.type);
            });
        }
    }

    selectSingle (departmentId) {
        this.selectingSingle(departmentId);
    }

    selectDepartment (departmentId) {
        this.selectingDepartment(departmentId);
    }

    selectAllDepartments () {
        this.selectingAllDepartments();
    }

    resetSelectedDepartments () {
        this.resetingSelectedDepartments();
    }
}

export default alt.createActions(DepartmentActions);
