import alt from 'app/flux/Alt';
import {Appearance} from 'app/flux/DataSource';

class AppearanceActions {
    constructor () {
        this.generateActions(
            'fetchedCurrentAppearance'
        );
    }

    fetchCurrentAppearance () {
        Appearance.fetch().then((results) => {
            this.fetchedCurrentAppearance(results.entity[0]);
        });
    }
}

export default alt.createActions(AppearanceActions);
