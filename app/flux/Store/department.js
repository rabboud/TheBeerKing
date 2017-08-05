import alt from 'app/flux/Alt';
import {departmentActions} from 'app/flux/Actions';
import {DepartmentModel} from 'app/flux/Model';
import _ from 'lodash';

class DepartmentStore {
    constructor () {
        this.state = {
            status: '',
            departments: [],
            page: 0,
            search: '',
            currentDepartment: {
                status: '',
                type: 'add',
                id: '',
                name: ''
            }
        };

        this.bindActions(departmentActions);
    }

    onResettingAll () {
        this.state.departments = [];
        this.state.page = 0;
        this.state.status = '';
    }

    onFetchingAll (params) {
        this.state.status = params.status;
    }

    onFetchedAll (params) {
        this.state.page = this.state.page + 1;
        this.state.status = params.status;

        if (params.status === 'TIMEOUT' || params.status === 'ERROR') {
            return;
        }

        if (params.results.length === 0) {
            this.state.status = 'ENDED';
            return;
        }

        _.map(params.results, (department) => {
            this.state.departments.push(new DepartmentModel(department));
        });
    }

    onChangingSearch (value) {
        this.state.search = value;
    }

    onChangingCurrent (departmentSelected) {
        if (departmentSelected) {
            this.state.currentDepartment.type = 'edit';
            this.state.currentDepartment.id = departmentSelected.id;
            this.state.currentDepartment.name = departmentSelected.name;
        } else {
            this.state.currentDepartment.type = 'add';
            this.state.currentDepartment.name = '';
        }
    }

    onTogglingState (params) {
        this.state.departments[params.departmentKey].state = params.department.state === 'INACTIVE'
            ? 'ACTIVE'
            : 'INACTIVE';
    }

    onToggledState (params) {
        if (params.error) {
            this.state.departments[params.departmentKey].state = params.department.state === 'INACTIVE'
                ? 'ACTIVE'
                : 'INACTIVE';
        }
    }

    onChangingCurrentName (name) {
        this.state.currentDepartment.name = name;
    }

    onSaving (params) {
        this.state.currentDepartment.status = params.status;
    }

    onSaved (params) {
        this.state.currentDepartment.status = params.status;
    }

    onSelectingSingle (departmentId) {
        _.map(this.state.departments, (department) => {
            if (department.id === departmentId) {
                department.selected = true;
            } else {
                department.selected = false;
            }
        });

        this.setState({
            departments: this.state.departments
        });
    }

    onSelectingDepartment (departmentId) {
        _.map(this.state.departments, (department) => {
            if (department.id === departmentId) {
                department.selected = !department.selected;
            }
        });

        this.setState({
            departments: this.state.departments
        });
    }

    onSelectingAllDepartments () {
        const changeAll = (state) => {
            _.map(this.state.departments, (department) => department.selected = state);
        };

        if (this.state.departments.find((department) => department.selected === false)) {
            changeAll(true);
        } else {
            changeAll(false);
        }

        this.setState({
            departments: this.state.departments
        });
    }

    onResetingSelectedDepartments () {
        _.map(this.state.departments, (department) => {
            department.selected = false;
        });

        this.setState({
            departments: this.state.departments
        });
    }
}

export default alt.createStore(DepartmentStore, 'departmentStore');
