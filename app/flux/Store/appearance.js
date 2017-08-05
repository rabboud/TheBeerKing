import alt from 'app/flux/Alt';
import {appearanceActions} from 'app/flux/Actions';

class AppearanceStore {
    constructor () {
        this.state = {
            appearance: {}
        };
        this.bindActions(appearanceActions);
    }

    onFetchedCurrentAppearance (data) {
        this.setState({
            appearance: data
        });
        console.log('Fetched', this.state);
    }
}

export default alt.createStore(AppearanceStore, 'AppearanceStore');
