import Interaction from './interaction';

class Attendance extends Interaction {
    constructor (props) {
        super(props);
        this.typing = false;
        this.currentMessage = '';
        this.currentNote = {};
        this.sentCseq = {};
        this.endInteraction = {
            open: false,
            type: ''
        };
        this.localVideoUrl = '';
        this.remoteVideoUrl = '';
        this.remoteAudioUrl = '';
        this.clientMenu = 0;
        this.clientForm = {
            state: '',
            data: {
                name: '',
                email: '',
                phone: '',
                cpf: ''
            }
        };
        this.searchCustomer = {
            state: '',
            searchValue: '',
            customers: [] // [Customer Model]
        };
        this.transferState = 'closed';
        this.endOrigin = '';
        this.activeInteraction = props.activeInteraction || false;
        this.isTransfer = props.isTransfer || false;
        this.attachmentAlert = '';
    }
}

export default Attendance;
