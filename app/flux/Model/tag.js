class Model {
    constructor (tag) {
        this.id = tag ? tag.id : '';
        this.accountId = tag ? tag.account_id : '';
        this.value = '';
        this.name = tag ? tag.name : '';
        this.state = tag && tag.state !== null ? this.parseState(tag.state) : '';
        this.dateCreation = tag ? tag.date_creation : '';
        this.changeDate = tag ? tag.change_date : '';
        this.baseColor = tag ? tag.base_color : '';
        this.agentName = tag ? tag.agent_name : '';
        this.agentPhoto = tag ? tag.agent_photo : '';
        this.count = tag ? tag.tag_count : '';
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
