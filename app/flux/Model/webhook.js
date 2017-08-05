class Model {
    constructor (webhook) {
        this.id = webhook && webhook.id !== null ? webhook.id : '';
        this.name = webhook && webhook.name !== null ? webhook.name : '';
        this.url = webhook && webhook.url !== null ? webhook.url : '';
        this.type = webhook && webhook.type !== null ? webhook.type : '';
        this.departments = webhook && webhook.departments !== null ? webhook.departments : '';
        this.fields = webhook && webhook.fields !== null ? webhook.fields : '';
        this.state = webhook && webhook.state !== null ? this.parseState(webhook.state) : '';
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
}

export default Model;
