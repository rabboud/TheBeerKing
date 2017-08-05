class Model {
    constructor (content, agent, time, tags, department) {
        this.id = 0;
        this.type = 'NOTE';
        this.content = content || '';
        this.interactionId = '';
        this.time = time || '';
        this.tags = tags || [];
        this.agent = agent || {};
        this.department = department || '';
        this.searchValue = '';
        this.adding = true;
        this.showTags = false;
        this.tagsStatus = '';
    }
}

export default Model;
