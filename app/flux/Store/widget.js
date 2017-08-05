import alt from 'app/flux/Alt';
import {widgetActions} from 'app/flux/Actions';
import {WidgetModel} from 'app/flux/Model';

class WidgetStore {
    constructor () {
        this.state = {
            status: '',
            appearance: {}
        };
        this.bindActions(widgetActions);
    }

    onFetchingAppearance (params) {
        this.state.status = params.status;
    }

    onFetchedAppearance (params) {
        this.state.status = params.status;

        if (params.status === 'TIMEOUT' || params.status === 'ERROR') {
            return;
        }

        this.state.appearance = new WidgetModel(params.result);
    }

    onUpdatingAppearance (params) {
        this.state.status = params.status;
        this.state.appearance[params.field] = params.value;
    }

    onUpdatedAppearance (params) {
        this.state.status = params.status;
        this.state.appearance = new WidgetModel(params.result);
    }

    onSavingValue (params) {
        this.state.appearance[params.field] = params.value;
    }
}

export default alt.createStore(WidgetStore, 'widgetStore');
