import alt from 'app/flux/Alt';
import _ from 'lodash';
import {mercadolivreActions} from 'app/flux/Actions';

class MercadolivreStore {
    constructor () {
        this.state = {
            integrations: []
        };
        this.bindActions(mercadolivreActions);
    }

    onFetchedAll (results) {
        _.map(results, (result) => {
            this.state.integrations.push(result);
        });
    }
}

export default alt.createStore(MercadolivreStore, 'MercadolivreStore');
