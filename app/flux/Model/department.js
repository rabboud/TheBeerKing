import _ from 'lodash';
import {UserModel, ChannelModel} from 'app/flux/Model';

class Model {
    constructor (department) {
        this.id = department && department.id !== null ? department.id : '';
        this.name = department && department.name !== null ? department.name : '';
        this.state = department && department.state !== null ? this.parseState(department.state) : '';
        this.channels = department && department.channels !== null ? this.parseChannels(department.channels) : [];
        this.agents = department && department.agents !== null ? this.parseAgents(department.agents) : [];
        this.selected = false;
    }

    parseState (state) {
        switch (state) {
            case 1:
                return 'ACTIVE';
            case 0:
                return 'INACTIVE';
            default:
                return 'INACTIVE';
        }
    }

    parseAgents (agents) {
        return _.map(agents, (agent) => {
            return new UserModel(agent);
        });
    }

    parseChannels (channels) {
        return _.map(channels, (channel) => {
            return new ChannelModel(channel);
        });
    }
}

export default Model;
