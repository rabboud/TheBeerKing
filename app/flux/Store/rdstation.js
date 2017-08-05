import alt from 'app/flux/Alt';
import {rdstationActions} from 'app/flux/Actions';

class RdstationStore {
    constructor () {
        this.state = {
            status: '',
            id: 0,
            token: '',
            active: 0
        };
        this.bindActions(rdstationActions);
    }

    onFetchingInfo (params) {
        this.state.status = params.status;
    }

    onFetchedInfo (params) {
        if (params.status === 'TIMEOUT' || params.status === 'ERROR') {
            return;
        }

        this.state.status = params.status;
        this.state.id = params.result.id ? params.result.id : 0;
        this.state.token = params.result.token;
        this.state.active = params.result.active;
    }

    onUpdatingToken (token) {
        this.state.token = token;
    }

    onSaving (params) {
        this.state.status = params.status;
    }

    onSaved (params) {
        this.state.status = params.status;
    }

    onTogglingState (params) {
        this.state.active = !params.active;
    }

    onToggledState (params) {
        this.state.status = params.status;

        if (params.status === 'TIMEOUT' || params.status === 'ERROR') {
            this.state.active = !params.active;
            return;
        }
    }
}

export default alt.createStore(RdstationStore, 'rdstationStore');
