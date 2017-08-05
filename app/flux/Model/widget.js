import Moment from 'moment';

class Model {
    constructor (widget) {
        this.id = widget && widget.id !== null ? widget.id : 0;
        this.state = widget && widget.ativo !== null ? widget.ativo : 0;
        this.widgetVersion = widget && widget.widgetVersion !== null ? widget.widgetVersion : '';
        this.widgetJson = widget && widget.widgetJson !== null ? widget.widgetJson : '';
        this.createdAt = widget && widget.createdAt ? Moment(widget.createdAt) : '';
        this.updatedAt = widget && widget.updatedAt ? Moment(widget.updatedAt) : '';

        // Main
        this.icon = widget && widget.icon !== null ? widget.icon : 'omnize-logo';
        this.baseColor = widget && widget.baseColor !== null ? widget.baseColor : '';
        this.minimized = widget && widget.minimized !== null ? widget.minimized : true;
        this.positions = widget && widget.positions !== null ? widget.positions : 'RIGHT';
        this.widgetCode = widget && widget.widgetCode !== null ? widget.widgetCode : '';

        // Features
        this.enableCallout = widget && widget.enableCallout !== null ? widget.enableCallout : false;
        this.enablePreCare = widget && widget.enablePreCare !== null ? widget.enablePreCare : false;
        this.enableCustomerFeedback = widget && widget.enableCustomerFeedback !== null ? widget.enableCustomerFeedback : false;
        this.enableTextTranscription = widget && widget.enableTextTranscription !== null ? widget.enableTextTranscription : false;
        this.enableCpf = widget && widget.enableCpf !== null ? widget.enableCpf : false;

        // Messages
        this.mainTitle = widget && widget.mainTitle !== null ? widget.mainTitle : '';
        this.channelSelectionMsg = widget && widget.channelSelectionMsg !== null ? widget.channelSelectionMsg : '';
        this.welcomeText = widget && widget.welcomeText !== null ? widget.welcomeText : '';
        this.welcomeAudio = widget && widget.welcomeAudio !== null ? widget.welcomeAudio : '';
        this.welcomeVideo = widget && widget.welcomeVideo !== null ? widget.welcomeVideo : '';
        this.deptoSelectionMsg = widget && widget.deptoSelectionMsg !== null ? widget.deptoSelectionMsg : '';
        this.firstAgentMessage = widget && widget.firstAgentMessage !== null ? widget.firstAgentMessage : '';
        this.activeInteractionMessage = widget && widget.activeInteractionMessage !== null ? widget.activeInteractionMessage : '';
        this.endInteractionMsg = widget && widget.endInteractionMsg !== null ? widget.endInteractionMsg : '';
        this.deptoTitleMsg = widget && widget.deptoTitleMsg !== null ? widget.deptoTitleMsg : '';
        this.feedbackQuestion = widget && widget.feedbackQuestion !== null ? widget.feedbackQuestion : '';
        this.textTranscriptionMsg = widget && widget.textTranscriptionMsg !== null ? widget.textTranscriptionMsg : '';
    }
}

export default Model;
