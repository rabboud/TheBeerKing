import Alt from 'app/flux/Alt';
import Moment from 'moment';
import _ from 'lodash';
import {interactionActions, currentUserActions} from 'app/flux/Actions';
import {InteractionModel, MessageModel, CustomerModel, AttendanceModel, NoteModel, TagModel, UserModel} from 'app/flux/Model';
import {currentUserStore} from 'app/flux/Store';
import {FilterHelper, MaskHelper} from 'app/helpers';

class InteractionStore {
    constructor () {
        this.state = {
            currentSessionId: '',
            currentInboxSession: {},
            interactions: {},
            inbox: [],
            inboxPage: 0,
            inboxSearch: '',
            inboxCurrentIndex: null,
            history: [],
            historyPage: 0,
            historySearch: '',
            historyCurrentIndex: null,
            status: '',
            transfer: {
                currentInteraction: {},
                agents: [],
                departments: [],
                filter: '',
                status: {
                    flag: '',
                    message: 'Transferir atendimento'
                }
            },
            initTransfer: {},
            metaData: {},
            alertInbox: false,
            availableTags: [],
            lastWeekInteractions: {
                status: '',
                data: []
            },
            talking: {
                status: '',
                data: []
            },
            pending: {
                status: '',
                data: []
            },
            answered: {
                status: '',
                data: []
            },
            notAnswered: {
                status: '',
                data: []
            }
        };
        this.bindActions(interactionActions);
    }

    onReceiving (params) {
        if (!this.state.interactions[params.id]) {
            const OmzSip = currentUserStore.state.OmzSip;
            const customerInfo = JSON.parse(OmzSip.profile.getClientInfo(params.id));

            params.state = 'RINGING';
            params.customerInfo = new CustomerModel(customerInfo);
            params.customerInfo.cpf = MaskHelper.maskCpf(params.customerInfo.cpf);
            params.customerInfo.phone = MaskHelper.maskPhone(params.customerInfo.phone);
            params.customerInfo.customerId = OmzSip.profile.getCustomerKey(params.id);
            params.customerInfo.state = 'EXIST';

            params.department = params.customerInfo.department;
            params.departmentId = params.customerInfo.departmentId;
            this.state.interactions[params.id] = new AttendanceModel(params);
            this.state.interactions[params.id].currentNote = new NoteModel();
        } else {
            const OmzSip = currentUserStore.state.OmzSip;
            const customerInfo = JSON.parse(OmzSip.profile.getClientInfo(params.id));

            if (this.state.interactions[params.id].state === 'POSTPONED') {
                OmzSip.profile.decreaseCounter();
            }

            if (this.state.transfer.status.flag === 'waiting') {
                return;
            }
            this.state.interactions[params.id].state = 'TALKING';
            this.state.interactions[params.id].customerInfo.lastURL = customerInfo.lastURL;
            OmzSip.profile.acceptText(params.id);
        }
        this.setState({
            interactions: this.state.interactions
        });
    }

    onReceivingReconnect (sessionId) {
        const OmzSip = currentUserStore.state.OmzSip;
        const customerInfo = JSON.parse(OmzSip.profile.getClientInfo(sessionId));

        this.state.interactions[sessionId].state = 'TALKING';
        this.state.interactions[sessionId].typing = false;
        this.state.interactions[sessionId].customerInfo.lastURL = customerInfo.lastURL;
        this.state.interactions[sessionId].customerInfo.navigationHistory.push(customerInfo.lastURL);
        OmzSip.profile.acceptText(sessionId);
        this.setState({
            interactions: this.state.interactions
        });
    }

    onAcceptingCall (sessionId) {
        this.state.interactions[sessionId].state = 'TALKING';
        this.state.interactions[sessionId].startTime = Moment();
        currentUserStore.state.OmzSip.profile.acceptCall();
        this.setState({
            interactions: this.state.interactions
        });
    }

    onConnected (sessionId) {
        this.state.interactions[sessionId].state = 'TALKING';
        this.state.interactions[sessionId].startTime = Moment();
        this.setState({
            interactions: this.state.interactions
        });
    }

    onEndingInteraction (sessionId) {
        this.state.interactions[sessionId].state = 'ENDING';
        this.state.interactions[sessionId].endTime = Moment();
        this.state.interactions[sessionId].status = 'LOADING';
        this.setState({
            interactions: this.state.interactions
        });
    }

    onFinishingInteraction (sessionId) {
        this.state.interactions[sessionId].state = 'FINISHING';
        this.state.interactions[sessionId].endTime = Moment();
        this.state.interactions[sessionId].status = 'LOADING';
        this.setState({
            interactions: this.state.interactions
        });
    }

    onReconnecting (sessionId) {
        this.state.interactions[sessionId].state = 'RECONNECTING';
        this.setState({
            interactions: this.state.interactions
        });
    }

    onEnding (params) {
        const interaction = this.state.interactions[params.sessionId];

        if (params.reason === 'TRANSFERRED') {
            this.onTransferSuccessed(params);
            return;
        }
        if (params.reason === 'NO_REASON') {
            if (this.state.transfer.status.flag !== 'waiting') {
                interaction.state = 'ENDED';
                currentUserStore.state.OmzSip.profile.finishSession(params.sessionId);
            }
            return;
        }
        if (interaction.state === 'END' || interaction.state === 'TALKING' || interaction.state === 'RECONNECTING') {
            if (interaction.state !== 'END') {
                interaction.endOrigin = 'CLIENT';
            } else {
                interaction.endOrigin = 'AGENT';
            }

            interaction.state = 'ENDED';
            interaction.endTime = Moment();
            interaction.status = '';
            currentUserStore.state.OmzSip.profile.finishSession(params.sessionId);
        } else {
            currentUserStore.state.OmzSip.profile.finishSession(params.sessionId);
            Reflect.deleteProperty(this.state.interactions, params.sessionId);
        }
        this.setState({
            interactions: this.state.interactions
        });
    }

    onClosing (sessionId) {
        if (!this.state.interactions[sessionId]) {
            return;
        }

        if (this.state.interactions[sessionId].type === 'video' || this.state.interactions[sessionId].type === 'audio'
           || this.state.interactions[sessionId].type === 'phone') {
            currentUserStore.state.OmzSip.profile.finishSession();
        }

        Reflect.deleteProperty(this.state.interactions, sessionId);
        this.setState({
            interactions: this.state.interactions
        });
    }

    onClosingSocial (sessionId) {
        Reflect.deleteProperty(this.state.interactions, sessionId);
        this.setState({
            interactions: this.state.interactions
        });
    }

    onPostponing (sessionId) {
        this.state.interactions[sessionId].state = 'POSTPONEENDED';
        this.setState({
            interactions: this.state.interactions
        });
    }

    onFetchingInteraction (sessionId) {
        this.setState({
            currentSessionId: sessionId
        });
    }

    onFetchingInbox (sessionId) {
        if (sessionId) {
            this.setState({
                currentInboxSession: this.state.inbox[sessionId],
                loading: ''
            });
        } else {
            this.setState({
                currentInboxSession: '',
                loading: ''
            });
        }
    }

    onResettingInbox (params) {
        this.state.inboxPage = 0;
        this.state.inboxSearch = '';
        this.state.inboxCurrentIndex = null;
    }

    fetchingInboxMessages (params) {
        this.state[params.type][params.index].messages.status = 'LOADING';
    }

    onFetchedInboxMessages (params) {
        _.map(params.messages, (data, key) => {
            if (data.message !== '{"status": "SENDING FILE"}') {
                const messageParams = {
                    content: data.message,
                    direction: data.source,
                    type: data.media,
                    state: 'READED',
                    time: data.datetime,
                    agentName: data.name,
                    agentPhoto: data.photo
                };
                const message = new MessageModel(messageParams);

                if (data.source === 'AGENT') {
                    message.state = 'DELIVERED';
                }
                this.state[params.type][params.index].messages.data.unshift(message);
            }
        });

        if (params.error) {
            this.state[params.type][params.index].messages.status = params.error;
            return;
        }

        if (params.messages.length === 20) {
            this.state[params.type][params.index].messages.status = '';
            this.state[params.type][params.index].messages.page = this.state[params.type][params.index].messages.page + 1;
        } else {
            this.state[params.type][params.index].messages.status = 'ENDED';
        }
    }

    onReadingMessages (sessionId) {
        this.state.interactions[sessionId].messages.data = _.map(this.state.interactions[sessionId].messages.data, (message, key) => {
            if (message.direction === 'CLIENT') {
                message.state = 'READED';
            }
            return message;
        });

        this.setState({
            interactions: this.state.interactions
        });
    }

    onSavingCurrentMessage (params) {
        this.state.interactions[params.sessionId].currentMessage = params.message;

        this.setState({
            interactions: this.state.interactions
        });
    }

    onSendingMessage (params) {
        const content = params[0];
        const sessionId = params[1];
        const clearCurrentMessage = params[2];
        const agent = currentUserStore.state.information;
        const messageParams = {
            content: content.trim(),
            direction: 'AGENT',
            type: 'TEXT',
            state: 'SENDED',
            agentName: agent.name,
            agentPhoto: agent.photo
        };
        const message = new MessageModel(messageParams);
        const OmzSip = currentUserStore.state.OmzSip;
        const target = this.state.interactions[sessionId].departmentUri;
        let cseq;

        switch (this.state.interactions[sessionId].state) {
            case 'POSTPONED':
            case 'PENDING':
            case 'RESTORE_FAILED':
                cseq = OmzSip.profile.sendPostponedMessage(sessionId, target, currentUserStore.state.information.id, content, false); // If pending
                message.state = 'DELIVERED';
                break;
            default:
                cseq = OmzSip.profile.sendMessage(sessionId, content);
        }

        this.state.interactions[sessionId].messages.data.push(message);
        this.state.interactions[sessionId].sentCseq[cseq] = this.state.interactions[sessionId].messages.data.length;

        if (clearCurrentMessage) {
            this.state.interactions[sessionId].currentMessage = '';
        }

        this.setState({
            interactions: this.state.interactions
        });
    }
    onSendingMeliMessage (params) {
        const content = params.message;
        const sessionId = params.sessionId;
        const agent = currentUserStore.state.information;
        const messageParams = {
            content: content.trim(),
            direction: 'AGENT',
            type: 'TEXT',
            state: 'SENDED',
            agentName: agent.name,
            agentPhoto: agent.photo
        };
        const message = new MessageModel(messageParams);

        this.state.interactions[sessionId].messages.data.push(message);
        this.state.interactions[sessionId].currentMessage = '';
    }

    onReceivingTextMessage (params) {
        const content = params[1];
        const remote = params[2];
        const sessionId = params[3];
        const mediaType = params[4];

        if (remote === true) {
            const readed = this.state.currentSessionId === sessionId ? 'READED' : 'NOTREADED';
            const messageParams = {
                content: content,
                direction: 'CLIENT',
                type: 'TEXT',
                state: readed
            };
            const message = new MessageModel(messageParams);
            const OmzSip = currentUserStore.state.OmzSip;

            if (mediaType === 'text') {
                OmzSip.profile.acceptText(sessionId);
            }

            if (content === '{"status": "SENDING FILE"}') {
                return;
            }
            this.state.interactions[sessionId].messages.data.push(message);
            this.state.interactions[sessionId].typing = false;
            this.setState({
                interactions: this.state.interactions
            });
        }
    }

    onTypingInteraction (sessionId) {
        this.state.interactions[sessionId].typing = true;
        this.setState({
            interactions: this.state.interactions
        });
    }

    onClearingInteraction (sessionId) {
        this.state.interactions[sessionId].typing = false;
        this.setState({
            interactions: this.state.interactions
        });
    }

    onDeliveredTextMessage (params) {
        const sessionId = params[2];
        const cseq = params[0];
        const messageId = this.state.interactions[sessionId].sentCseq[cseq] - 1;

        this.state.interactions[sessionId].messages.data[messageId].state = 'DELIVERED';
        this.setState({
            interactions: this.state.interactions
        });
    }

    onFailedTextMessage (params) {
        const sessionId = params[1];
        const cseq = params[0];
        const messageId = this.state.interactions[sessionId].sentCseq[cseq] - 1;

        this.state.interactions[sessionId].messages.data[messageId].state = 'FAILED';
        this.setState({
            interactions: this.state.interactions
        });
    }

    onChangingClientMenu (params) {
        const sessionId = params[0];
        const index = params[1];

        this.state.interactions[sessionId].clientMenu = index;
        this.setState({
            interactions: this.state.interactions
        });
    }

    onShowingEndInteraction (params) {
        this.state.interactions[params.sessionId].endInteraction.open = true;
        this.state.interactions[params.sessionId].endInteraction.type = params.type;
        this.setState({
            interactions: this.state.interactions
        });
    }

    onClosingEndInteraction (sessionId) {
        this.state.interactions[sessionId].endInteraction.open = false;
        this.setState({
            interactions: this.state.interactions
        });
    }

    onSettingCallUrls (params) {
        if (params.type === 'video') {
            this.state.interactions[params.sessionId].localVideoUrl = params.local;
            this.state.interactions[params.sessionId].remoteVideoUrl = params.remote;
        } else if (params.type === 'audio') {
            this.state.interactions[params.sessionId].remoteAudioUrl = params.remote;
        }

        this.setState({
            interactions: this.state.interactions
        });
    }

    onSavingCustomerInfo () {
        console.log('Saving customer info!');
    }

    onSavedCustomerInfo (response) {
        console.log('Saved: ', response);
    }

    onSearchingCustomerInfo (params) {
        this.state.interactions[params.sessionId].searchCustomer.searchValue = params.name;
        this.state.interactions[params.sessionId].searchCustomer.state = 'LOADING';
        this.setState({
            interactions: this.state.interactions
        });
    }

    onSearchedCustomerInfo (params) {
        const customers = [];

        params.results.forEach((value) => {
            value.customerKey = value.customer_id;
            value.customerEntityId = value.id;
            value.phone = MaskHelper.maskPhone(value.phone);
            value.cpf = MaskHelper.maskCpf(value.cpf);
            value.state = 'EXIST';
            value.firstContact = Moment(value.first_contact);
            value.historyCount = value.history_count;
            const customer = new CustomerModel(value);

            customers.push(customer);
        });

        this.state.interactions[params.sessionId].searchCustomer.customers = customers;
        this.state.interactions[params.sessionId].searchCustomer.state = '';
        this.setState({
            interactions: this.state.interactions
        });
    }

    onClearingCustomers (sessionId) {
        this.state.interactions[sessionId].searchCustomer.customers = [];
        this.state.interactions[sessionId].searchCustomer.searchValue = '';
        this.setState({
            interactions: this.state.interactions
        });
    }

    onChangingCustomer (params) {
        const customerInfo = this.state.interactions[params.sessionId].customerInfo;
        const newCustomerInfo = _.find(this.state.interactions[params.sessionId].searchCustomer.customers, (customer) => {
            return customer.customerKey === params.customerKey;
        });

        if (customerInfo.customerId !== '' && customerInfo.customerId.indexOf('key') < 0) {
            newCustomerInfo.customerId = this.state.interactions[params.sessionId].customerInfo.customerId;
        } else {
            newCustomerInfo.customerId = '';
        }

        newCustomerInfo.so = customerInfo.so;
        newCustomerInfo.ip = customerInfo.ip;
        newCustomerInfo.pageSource = customerInfo.pageSource;
        newCustomerInfo.browser = customerInfo.browser;
        newCustomerInfo.state = 'EXIST';

        this.state.interactions[params.sessionId].customerInfo = newCustomerInfo;
        this.state.interactions[params.sessionId].searchCustomer.customers = [];
        this.state.interactions[params.sessionId].searchCustomer.searchValue = '';
        this.setState({
            interactions: this.state.interactions
        });
    }

    onSettingClientFormValues (params) {
        this.state.interactions[params.sessionId].clientForm.data.name = params.values.name;
        this.state.interactions[params.sessionId].clientForm.data.email = params.values.email;
        this.state.interactions[params.sessionId].clientForm.data.phone = params.values.phone;
        this.state.interactions[params.sessionId].clientForm.data.cpf = params.values.cpf;
        this.setState({
            interactions: this.state.interactions
        });
    }

    onLoadingClientInfo (sessionId) {
        this.state.interactions[sessionId].clientForm.state = 'loading';
        this.setState({
            interactions: this.state.interactions
        });
    }

    onSettingCustomerInfoValues (params) {
        if (params.result) {
            if (params.result.status !== 404 && params.result.entity.customerKey !== this.state.interactions[params.sessionId].customerInfo.customerKey) {
                this.state.interactions[params.sessionId].clientForm.state = 'error';
            } else {
                this.state.interactions[params.sessionId].customerInfo = this.state.interactions[params.sessionId].clientForm.data;
                this.state.interactions[params.sessionId].customerInfo.state = 'NEW';
                this.state.interactions[params.sessionId].clientForm.state = '';
                this.state.interactions[params.sessionId].searchCustomer.customers = [];
                this.state.interactions[params.sessionId].searchCustomer.searchValue = '';
            }
        } else {
            this.state.interactions[params.sessionId].customerInfo = this.state.interactions[params.sessionId].clientForm.data;
            this.state.interactions[params.sessionId].clientForm.state = '';
        }

        this.state.interactions[params.sessionId].customers = [];
        this.setState({
            interactions: this.state.interactions
        });
    }

    onSettingClientFormState (params) {
        this.state.interactions[params.sessionId].clientForm.state = params.type;

        if (params.type === 'add') {
            const customer = {};

            this.state.interactions[params.sessionId].clientForm.data = new CustomerModel(customer);
        }

        if (params.type === 'edit' || params.type === 'fake-add') {
            const customer = this.state.interactions[params.sessionId].customerInfo;

            this.state.interactions[params.sessionId].clientForm.data = new CustomerModel(customer);
        }

        this.setState({
            interactions: this.state.interactions
        });
    }

    onLoadingInbox () {
        this.setState({
            loading: 'LOADING'
        });
    }

    onLoadedInbox (result) {
        this.state.inbox.splice(0, this.state.inbox.length);

        _.map(result.interactions, (interaction, key) => {
            const newInteraction = new InteractionModel(interaction);

            newInteraction.type = interaction.media.toLowerCase();
            newInteraction.id = interaction.interaction_hash;
            newInteraction.hash = interaction.interaction_hash;
            newInteraction.department = interaction.department;
            newInteraction.departmentUri = interaction.dept_uri;
            newInteraction.state = interaction.status;
            newInteraction.startTime = Moment(interaction.initial_date);

            const customerInfo = {
                customerKey: interaction.customer_key,
                email: interaction.customer_email,
                name: interaction.customer_name,
                cpf: MaskHelper.maskCpf(interaction.customer_cpf),
                phone: MaskHelper.maskPhone(interaction.customer_phone),
                state: 'EXIST'
            };

            if (customerInfo.name === null) {
                customerInfo.name = interaction.name;
            }
            newInteraction.customerInfo = new CustomerModel(customerInfo);
            newInteraction.customerInfo.firstContact = newInteraction.startTime;

            const lastMessage = new MessageModel();

            lastMessage.content = interaction.last_message;
            lastMessage.direction = interaction.source;
            lastMessage.time = Moment(interaction.last_message_date);
            lastMessage.type = 'TEXT';
            lastMessage.state = 'READED';
            newInteraction.messages.data.push(lastMessage);

            if (this.state.interactions[interaction.interaction_hash]) {
                newInteraction.state = 'OPENED';
            }

            this.state.inbox.push(newInteraction);
        });
        this.setState({
            loading: result.error || '',
            inbox: this.state.inbox
        });
    }

    onOpeningInbox (sessionId) {
        const medias = ['offcontact', 'email', 'meli_qst'];

        this.state.interactions[sessionId] = new AttendanceModel(this.state.inbox[this.state.inboxCurrentIndex]);
        this.state.interactions[sessionId].currentNote = new NoteModel();
        if (!medias.includes(this.state.interactions[sessionId].type)) {
            this.state.interactions[sessionId].state = 'POSTPONED';
        }
        this.state.interactions[sessionId].messages.data = this.state.inbox[this.state.inboxCurrentIndex].messages.data;

        this.setState({
            interactions: this.state.interactions
        });
    }

    onLoadedRemoteMessages (params) {
        this.state.interactions[params.sessionId].messages.data = [];
        this.state.interactions[params.sessionId].metaData = params.metaData;
        _.map(params.messages, (data, key) => {
            const message = data;

            this.state.interactions[params.sessionId].messages.data.push(message);
        });
        this.setState({
            interactions: this.state.interactions
        });
    }

    onLoadingInteractionMessages (sessionId) {
        this.state.interactions[sessionId].messages.status = 'LOADING';
        this.setState({
            interactions: this.state.interactions
        });
    }

    onLoadedInteractionMessages (params) {
        const parsedMessages = [];

        _.map(params.data, (data, key) => {
            const messageParams = {
                content: data.message,
                direction: data.source,
                type: data.media,
                state: 'DELIVERED',
                time: Moment(data.datetime),
                agentName: data.name,
                agentPhoto: data.photo
            };
            const message = new MessageModel(messageParams);

            parsedMessages.push(message);
        });

        if (params.error) {
            this.state.interactions[params.sessionId].messages.status = params.error;
        } else {
            this.state.interactions[params.sessionId].messages.status = '';
            this.state.interactions[params.sessionId].messages.data = parsedMessages;
        }

        this.setState({
            interactions: this.state.interactions
        });
    }

    onSendingOffContactMessage (sessionId) {
        this.state.interactions[sessionId].status = 'LOADING';
        this.setState({
            interactions: this.state.interactions
        });
    }

    onSendedOffContactMessage (sessionId) {
        this.state.interactions[sessionId].status = '';
        this.state.interactions[sessionId].endInteraction.open = true;
        this.state.interactions[sessionId].endInteraction.type = 'message-sent';
        this.setState({
            interactions: this.state.interactions
        });
    }

    onSendingChatContentViaEmail (sessionId) {
        this.state.interactions[sessionId].status = 'LOADING';
        this.setState({
            interactions: this.state.interactions
        });
    }

    onSendedChatContentViaEmail (params) {
        this.state.interactions[params.sessionId].status = '';
        this.state.interactions[params.sessionId].endInteraction.open = true;
        this.state.interactions[params.sessionId].endInteraction.type = 'message-sent';
        this.setState({
            interactions: this.state.interactions
        });
    }

    onFetchedCustomerHistory (params) {
        if (!params.result) {
            return;
        }

        this.state.interactions[params.sessionId].history = [];
        _.map(params.result.interactions, (interaction) => {
            const parsedInteraction = new InteractionModel(interaction);

            if (interaction.lastMessage) {
                const messageParams = {
                    content: interaction.lastMessage,
                    direction: 'AGENT',
                    type: 'TEXT',
                    state: 'SENDED',
                    time: Moment(interaction.createdTime),
                    agentName: interaction.agentName,
                    agentPhoto: interaction.agentPhoto
                };

                parsedInteraction.messages.data[0] = new MessageModel(messageParams);
            }

            parsedInteraction.startTime = Moment(interaction.createdTime);
            parsedInteraction.type = interaction.media.toLowerCase();
            if (params.sessionId !== interaction.interactionHash) {
                this.state.interactions[params.sessionId].history.push(parsedInteraction);
            }
        });

        this.setState({
            interactions: this.state.interactions
        });
    }

    onSettingCurrentCustomerHistoryId (params) {
        this.state.interactions[params.sessionId].currentHistoryId = params.id;
        this.setState({
            interactions: this.state.interactions
        });
    }

    onLoadingTags (sessionId) {
        this.state.interactions[sessionId].currentNote.tagsStatus = 'LOADING';
        this.setState({
            interactions: this.state.interactions
        });
    }

    onLoadedTags (params) {
        const parsedTags = [];

        _.map(params.tags, (tag) => {
            const newTag = new TagModel();

            newTag.id = tag.id;
            newTag.accountId = tag.account_id;
            newTag.value = tag.name;
            newTag.name = tag.name;
            newTag.dateCreation = tag.date_creation;
            newTag.changeDate = tag.change_date;
            newTag.baseColor = tag.base_color;
            parsedTags.push(newTag);
        });

        if (params.error) {
            this.state.interactions[params.sessionId].currentNote.tagsStatus = params.error;
        } else {
            this.state.interactions[params.sessionId].currentNote.tagsStatus = '';
            this.state.interactions[params.sessionId].availableTags = parsedTags;
        }

        this.setState({
            interactions: this.state.interactions
        });
    }

    onLoadedNotes (params) {
        _.map(params.notes, (note) => {
            const newNote = new NoteModel();

            newNote.id = note.id;
            newNote.content = note.body;
            newNote.interactionId = note.interactionId;
            newNote.time = Moment(note.dateCreation);
            newNote.tags = note.tags;
            newNote.agent = note.agent;
            newNote.department = note.department;
            this.state.interactions[params.sessionId].notes.data.push(newNote);
        });

        if (params.error) {
            this.state.interactions[params.sessionId].notes.status = params.error;
        } else {
            this.state.interactions[params.sessionId].notes.status = '';
        }

        this.setState({
            interactions: this.state.interactions
        });
    }

    onFetchingCustomerHistoryDetail (params) {
        const history = _.find(this.state.interactions[params.sessionId].history, {'id': params.id});

        history.status = 'LOADING';
        this.setState({
            interactions: this.state.interactions
        });
    }

    onFetchedCustomerHistoryDetail (params) {
        if (params.response.status === 200) {
            const histories = this.state.interactions[params.sessionId].history;
            const history = _.find(histories, {'id': params.id});

            history.messages = {
                status: '',
                data: []
            };
            _.map(params.response.result, (message) => {
                if (message.message !== '{"status": "SENDING FILE"}') {
                    let msg;

                    if (message.type === 'note') {
                        msg = new NoteModel(message.body, message.agent, Moment(message.dateCreation), message.tags, message.department);
                    } else {
                        const messageParams = {
                            content: message.message,
                            direction: message.source,
                            type: message.type,
                            time: Moment(message.dateCreation),
                            agentName: message.agentName,
                            agentPhoto: message.agentPhoto
                        };

                        msg = new MessageModel(messageParams);
                    }

                    msg.type = msg.type === 'message' ? 'TEXT' : msg.type;
                    history.messages.data.push(msg);
                }
            });
            this.setState({
                interactions: this.state.interactions
            });
        }
    }

    onFetchingTransferAgents () {
        const transferObj = _.extend({}, this.state.transfer);

        transferObj.status.flag = 'waiting';
        this.setState({
            transfer: transferObj
        });
    }

    onFetchedTransferAgents (params) {
        const transferObj = _.extend({}, this.state.transfer);

        transferObj.agents = params.agents;
        transferObj.departments = params.departments;
        transferObj.status.flag = '';
        transferObj.currentInteraction = this.state.interactions[this.state.currentSessionId];

        this.setState({
            transfer: transferObj,
            initTransfer: _.extend({}, transferObj)
        });
    }

    onTransferingInteraction (params) {
        console.log('TRANSFERING INTERACTION INSIDE STORE', params);
        const transferObj = _.extend({}, this.state.transfer);

        transferObj.status.flag = 'waiting';
        transferObj.status.message = 'Transferindo...';

        this.setState({
            transfer: transferObj
        });

        const transferredInteractionObj = this.state.interactions[this.state.currentSessionId];

        currentUserActions.transferInteraction.defer(transferredInteractionObj.id, params.destination, transferredInteractionObj.customerInfo);
        // currentUserActions.transferInteraction(id);
    }

    onUpdatingTransferFilter (params) {
        const transferObj = _.extend({}, this.state.transfer);
        const DepartmentsCollection = new FilterHelper(this.state.initTransfer.departments);
        const AgentsCollection = new FilterHelper(this.state.initTransfer.agents);

        transferObj.filter = params.value;
        transferObj.departments = DepartmentsCollection.byIndex({
            name: params.value
        });
        transferObj.agents = AgentsCollection.byIndex({
            name: params.value
        });

        this.setState({
            transfer: transferObj
        });
    }

    onTransferSuccessed (params) {
        console.log('TRANSFERRED', params);
        const transferObj = _.extend({}, this.state.transfer);

        transferObj.status.flag = 'success';
        transferObj.status.message = 'Transferido!';

        this.setState({
            transfer: transferObj
        });
    }

    onTransferFailed (params) {
        console.log('NOT TRANSFERRED', params);
        const transferObj = _.extend({}, this.state.transfer);

        transferObj.status.flag = 'error';
        transferObj.status.message = 'Falhou! Tente novamente.';

        this.setState({
            transfer: transferObj
        });
    }

    onFinishingTransfer (params) {
        const transferObj = {
            currentInteraction: {},
            agents: [],
            departments: [],
            filter: '',
            status: {
                flag: '',
                message: 'Transferir atendimento'
            }
        };

        this.setState({
            transfer: transferObj,
            initTransfer: transferObj
        });
    }

    onTogglingAddNote (sessionId) {
        this.state.interactions[sessionId].currentNote.adding = !this.state.interactions[sessionId].currentNote.adding;
        this.state.interactions[sessionId].notes.status = '';
        this.setState({
            interactions: this.state.interactions
        });
    }

    onTogglingShowTags (sessionId) {
        this.state.interactions[sessionId].currentNote.showTags = !this.state.interactions[sessionId].currentNote.showTags;
        this.setState({
            interactions: this.state.interactions
        });
    }

    onSavingSearchTagValue (params) {
        this.state.interactions[params.sessionId].currentNote.searchValue = params.searchValue;
        this.setState({
            interactions: this.state.interactions
        });
    }

    onSelectingTag (params) {
        this.state.interactions[params.sessionId].currentNote.tags = params.tags;
        this.setState({
            interactions: this.state.interactions
        });
    }

    onCreatingNote (sessionId) {
        this.state.interactions[sessionId].notes.status = 'LOADING';
        this.setState({
            interactions: this.state.interactions
        });
    }

    onCreatedNote (params) {
        if (params.error) {
            this.state.interactions[params.sessionId].notes.status = params.error;
            this.setState({
                interactions: this.state.interactions
            });
            return;
        }

        const note = new NoteModel();

        note.id = params.result.id;
        note.content = params.noteContent;
        note.interactionId = params.sessionId;
        note.time = Moment();
        note.tags = params.tags;
        note.agent = params.agent;
        note.department = params.department;

        this.state.interactions[params.sessionId].notes.status = '';
        this.state.interactions[params.sessionId].notes.data.push(note);
        this.state.interactions[params.sessionId].currentNote = new NoteModel();
        this.state.interactions[params.sessionId].currentNote.adding = false;
        this.setState({
            interactions: this.state.interactions
        });
    }

    savedNote (params) {
        this.state.interactions[params.sessionId].currentNote.id = 0;
        this.state.interactions[params.sessionId].currentNote.content = params.noteContent;
        this.state.interactions[params.sessionId].currentNote.interactionId = params.sessionId;
        this.state.interactions[params.sessionId].currentNote.time = Moment();
        this.state.interactions[params.sessionId].currentNote.tags = params.tags;
        this.state.interactions[params.sessionId].currentNote.agent = params.agent;
        this.state.interactions[params.sessionId].currentNote.department = params.department;
        this.setState({
            interactions: this.state.interactions
        });
    }

    onToggledTransferState (sessionId) {
        this.state.interactions[sessionId].transferState = this.state.interactions[sessionId].transferState === 'closed' ? 'opened' : 'closed';
        this.setState({
            interactions: this.state.interactions
        });
    }

    onAlertingInbox (status) {
        this.setState({
            alertInbox: status
        });
    }

    onRemovingInbox (sessionId) {
        Reflect.deleteProperty(this.state.inbox, sessionId);
        Reflect.deleteProperty(this.state.interactions, sessionId);
        this.setState({
            inbox: this.state.inbox,
            interactions: this.state.interactions
        });
    }

    onChangedAttachmentAlert (params) {
        this.state.interactions[params.sessionId].attachmentAlert = params.error;
        this.setState({
            interactions: this.state.interactions
        });
    }

    onEditingNote (params) {
        this.state.interactions[params.sessionId].currentNote = this.state.interactions[params.sessionId].notes.data[params.index];
        this.state.interactions[params.sessionId].currentNote.adding = true;
        this.state.interactions[params.sessionId].notes.data.splice(params.index, 1);
        this.setState({
            interactions: this.state.interactions
        });
    }

    onResettingHistory (additionalClear) {
        this.state.history.splice(0, this.state.history.length);
        this.state.historyPage = 0;
        this.state.historyCurrentIndex = null;

        if (additionalClear === 'search') {
            this.state.historySearch = '';
        }
    }

    onFetchingAgentHistory (params) {
        this.state.status = params.status;
        this.setState({
            status: this.state.status
        });
    }

    onFetchedAgentHistory (params) {
        this.state.historyPage = this.state.historyPage + 1;
        this.state.status = params.status;

        if (params.status === '') {
            if (params.result.length === 0) {
                this.state.status = 'ENDED';
            } else {
                _.map(params.result, (interaction) => {
                    const newInteraction = new InteractionModel(interaction);
                    const agent = new UserModel(interaction.agent || {});
                    const customer = new CustomerModel(interaction.customerInfo || {});
                    const message = new MessageModel(interaction.message);

                    customer.firstContact = newInteraction.startTime;
                    newInteraction.agent = agent;
                    newInteraction.customerInfo = customer;
                    newInteraction.messages.data.push(message);
                    this.state.history.push(newInteraction);
                });
            }
        }

        this.setState({
            status: this.state.status,
            history: this.state.history,
            historyPage: this.state.historyPage
        });
    }

    onChangingSearch (params) {
        if (params.type === 'inbox') {
            this.state.inboxSearch = params.value;
            this.setState({
                inboxSearch: this.state.inboxSearch
            });
        } else {
            this.state.historySearch = params.value;
            this.setState({
                historySearch: this.state.historySearch
            });
        }
    }

    onSettingCurrentIndex (params) {
        this.state[`${params.type}CurrentIndex`] = params.index;
    }

    onUpdatingInboxCheck (params) {
        const changeCheck = (state) => {
            _.map(this.state.inbox, (interaction, key) => {
                this.state.inbox[key].selected = state;
            });
        };

        if (params.inboxIndex === -1) {
            if (params.allChecked) {
                changeCheck(false);
            } else {
                changeCheck(true);
            }
        } else {
            this.state.inbox[params.inboxIndex].selected = !this.state.inbox[params.inboxIndex].selected;
        }

        this.setState({
            inbox: this.state.inbox
        });
    }

    onFetchingLastWeek (params) {
        this.state.lastWeekInteractions.status = params.status;
    }

    onFetchedLastWeek (params) {
        this.state.lastWeekInteractions.status = params.status;
        this.state.lastWeekInteractions.data = params.data;
    }

    onFetchingTalking (params) {
        this.state.talking.status = params.status;
    }

    onFetchedTalking (params) {
        this.state.talking.status = params.status;
        this.state.talking.data = params.data;
    }

    onFetchingPending (params) {
        this.state.pending.status = params.status;
    }

    onFetchedPending (params) {
        params.data.details = _.mapKeys(params.data.details, (value, key) => {
            return _.camelCase(key);
        });

        this.state.pending.status = params.status;
        this.state.pending.data = params.data;
    }

    onFetchingAnswered (params) {
        this.state.answered.status = params.status;
    }

    onFetchedAnswered (params) {
        params.data.details = _.mapKeys(params.data.details, (value, key) => {
            return _.camelCase(key);
        });

        this.state.answered.status = params.status;
        this.state.answered.data = params.data;
    }

    onFetchingNotAnswered (params) {
        this.state.notAnswered.status = params.status;
    }

    onFetchedNotAnswered (params) {
        params.data.details = _.mapKeys(params.data.details, (value, key) => {
            return _.camelCase(key);
        });

        this.state.notAnswered.status = params.status;
        this.state.notAnswered.data = params.data;
    }
}

export default Alt.createStore(InteractionStore, 'interactionStore');
