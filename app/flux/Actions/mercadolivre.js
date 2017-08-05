import alt from 'app/flux/Alt';
import {Mercadolivre} from 'app/flux/DataSource';

class MercadolivreActions {
    constructor () {
        this.generateActions(
          'fetchedAll',
        );
    }

    authorize (departmentId) {
        Mercadolivre.authorize(departmentId).then((results) => {
        });
    }

    fetchAll (accountId) {
        Mercadolivre.fetchAll(accountId).then((results) => {
            this.fetchedAll(results);
        });
    }
}

export default alt.createActions(MercadolivreActions);
