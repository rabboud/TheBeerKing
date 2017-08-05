import alt from 'app/flux/Alt';
import {officeHourActions} from 'app/flux/Actions';
import {OfficeHourModel} from 'app/flux/Model';
import _ from 'lodash';

class OfficeHourStore {
    constructor () {
        this.state = {
            status: '',
            officeHours: [],
            page: 0,
            search: '',
            currentOfficeHour: {
                status: '',
                type: 'add',
                id: '',
                name: ''
            }
        };

        this.bindActions(officeHourActions);
    }

    onResettingAll () {
        this.state.officeHours = [];
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
            this.state.officeHours.push(new OfficeHourModel(department));
        });
    }
}

export default alt.createStore(OfficeHourStore, 'officeHourStore');
