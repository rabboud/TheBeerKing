import alt from 'app/flux/Alt';
import _ from 'lodash';
import {profileActions} from 'app/flux/Actions';
import {ProfileModel} from 'app/flux/Model';

class ProfileStore {
    constructor () {
        this.state = {
            status: '',
            profiles: []
        };
        this.bindActions(profileActions);
    }

    onFetchingAll (params) {
        this.state.profiles = [];
        this.state.status = params.status;
    }

    onFetchedAll (params) {
        this.state.status = params.status;

        if (params.status === 'TIMEOUT' || params.status === 'ERROR') {
            return;
        }

        _.map(params.results, (result) => {
            const profile = new ProfileModel(result);

            if (params.selectable) {
                profile.selected = false;
            }

            this.state.profiles.unshift(profile);
        });
    }

    onChangingProfileSelected (params) {
        this.state.profiles[params.index].selected = params.value;
    }

    onClearingSelecteds () {
        _.map(this.state.profiles, (profile) => {
            profile.selected = false;
        });
    }
}

export default alt.createStore(ProfileStore, 'ProfileStore');
