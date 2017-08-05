import Moment from 'moment';

class Model {
    constructor (message) {
        this.time = message && message.time !== null && message.time !== '' ? message.time instanceof Object ? message.time : Moment(message.time) : '';
        this.direction = message ? message.direction : ''; // CLIENT, AGENT
        this.type = message ? message.type : ''; // TEXT, MEDIA, FILE
        this.content = message ? message.content : '';
        this.state = message ? message.state : ''; // SENDED, NOTREADED, READED, DELIVERED, FAILED
        this.subject = '';
        this.tags = []; // List of objects Ex: {name: '', color: ''}
        this.agentName = message ? message.agentName : '';
        this.agentPhoto = message ? message.agentPhoto : '';
    }
}

export default Model;
