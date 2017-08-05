import Moment from 'moment';

class Model {
    constructor (props) {
        this.loading = '';
        this.id = props.id || '';
        this.hash = props.hash || '';
        this.type = props.type || ''; // facebook, text, voice, video, telegram, offcontact
        this.state = props.state || ''; // RINGING, TALKING, CLOSED, ENDED, PENDING, POSTPONED, RESTORE_FAILED
        this.department = props.department || '';
        this.departmentId = props.departmentId || '';
        this.departmentUri = props.departmentUri || '';
        this.startTime = props.startTime ? props.startTime instanceof Moment ? props.startTime : Moment(props.startTime) : '';
        this.endTime = props.endTime || 0;
        this.customerInfo = props.customerInfo || {}; // Customer Model
        this.tags = props.tags || [];
        this.messages = {
            status: '',
            page: 0,
            data: [] // Message Model
        };
        this.notes = {
            status: '',
            data: []
        };
        this.history = props.history || [];
        this.currentHistoryId = props.currentHistoryId || '';
        this.activeInteraction = props.activeInteraction || false;
        this.loadingMessages = '';
        this.agent = props.agent || {}; // User Model
        this.selected = false;
    }
}

export default Model;
