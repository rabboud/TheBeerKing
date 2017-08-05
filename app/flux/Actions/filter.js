import alt from 'app/flux/Alt';
import {User, Department} from 'app/flux/DataSource';

class FilterActions {
    constructor () {
        this.generateActions(
            'fetchingFilter',
            'fetchedAgentsFilter',
            'fetchedDepartmentsFilter',
            'updatingFilter',
            'clearingAllSelecteds'
        );
    }

    fetchAgentsFilter (params) {
        this.fetchingFilter();
        User.fetchAll(params).then((result) => {
            this.fetchedAgentsFilter(result);
        });
    }

    fetchDepartmentsFilter (params) {
        this.fetchingFilter();
        Department.fetchAll(params).then((result) => {
            this.fetchedDepartmentsFilter(result);
        });
    }

    updateFilter (filterId, optionIndex, all) {
        const params = {
            filterId: filterId,
            optionIndex: optionIndex,
            all: all
        };

        this.updatingFilter(params);
    }

    clearAllSelecteds (filter) {
        this.clearingAllSelecteds(filter);
    }
}

export default alt.createActions(FilterActions);
