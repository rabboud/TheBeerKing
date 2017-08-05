import alt from 'app/flux/Alt';

class TableActions {
    constructor () {
        this.generateActions(
            'changingTableOrder',
            'clearingAllOrder'
        );
    }

    changeTableOrder (table, headerId, callback) {
        const params = {
            table: table,
            headerId: headerId,
            callback: callback
        };

        this.changingTableOrder(params);
    }

    clearAllOrder () {
        this.clearingAllOrder();
    }
}

export default alt.createActions(TableActions);
