import alt from 'app/flux/Alt';
import {Channel} from 'app/flux/DataSource';
import Honeybadger from 'honeybadger-js';

class ChannelActions {
    constructor () {
        this.generateActions(
            'fetchingAll',
            'fetchedAll',
            'togglingSelection',
            'clearingSelection'
        );
    }

    fetchAll (receiveParams) {
        const params = {
            accountId: receiveParams.accountId,
            status: 'LOADING',
            selectable: receiveParams.selectable,
            results: []
        };

        this.fetchingAll(params);
        Channel.fetchAll(params).then((results) => {
            params.results = results;
            params.status = '';
            this.fetchedAll(params);
        }, (error) => {
            if (error.timeout) {
                params.status = 'TIMEOUT';
                this.fetchedAll(params);
                Honeybadger.notify(error, {
                    name: 'Timeout on Bodylift - Get Channels',
                    context: {accountId: params.accountId}
                });
            } else {
                params.status = 'ERROR';
                this.fetchedAll(params);
                Honeybadger.notify(error, {
                    name: 'Error on Bodylift - Get Channels',
                    context: {accountId: params.accountId}
                });
            }
        });
    }

    toggleSelection (index) {
        this.togglingSelection(index);
    }

    clearSelection () {
        this.clearingSelection();
    }
}

export default alt.createActions(ChannelActions);
