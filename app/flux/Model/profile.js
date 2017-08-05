class Model {
    constructor (profile) {
        this.id = profile && profile.id !== null ? profile.id : '';
        this.name = profile && profile.name !== null ? profile.name : '';
        this.label = profile && profile.label !== null ? profile.label : '';
        this.state = profile && profile.state !== null ? this.parseState(profile.state) : 'INACTIVE';
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
}

export default Model;
