class Model {
    constructor (channel) {
        this.id = channel && channel.id ? channel.id : '';
        this.name = channel && channel.name ? channel.name : '';
        this.label = channel && channel.label ? channel.label : '';
        this.state = channel ? channel.status ? this.parseState(channel.status) : this.parseState(channel.state) : '';
    }

    parseState (state) {
        switch (state) {
            case 1:
                return 'ACTIVE';
            case 0:
                return 'INACTIVE';
            default:
                return state;
        }
    }
}

export default Model;
