import alt from 'app/flux/Alt';
import _ from 'lodash';
import {channelActions} from 'app/flux/Actions';
import {ChannelModel} from 'app/flux/Model';

class ChannelStore {
    constructor () {
        this.state = {
            status: '',
            channels: []
        };
        this.bindActions(channelActions);
    }

    onFetchingAll (params) {
        this.state.channels = [];
        this.state.status = params.status;
    }

    onFetchedAll (params) {
        this.state.status = params.status;

        if (params.status === 'TIMEOUT' || params.status === 'ERROR') {
            return;
        }

        _.map(params.results, (result) => {
            const channel = new ChannelModel(result);

            if (params.selectable) {
                channel.selected = false;
            }

            this.state.channels.push(channel);
        });
    }

    onTogglingSelection (index) {
        this.state.channels[index].selected = !this.state.channels[index].selected;
    }

    onClearingSelection () {
        _.map(this.state.channels, (channel, key) => {
            this.state.channels[key].selected = false;
        });
    }
}

export default alt.createStore(ChannelStore, 'ChannelStore');
