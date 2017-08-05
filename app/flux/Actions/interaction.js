import alt from 'app/flux/Alt';
import Honeybadger from 'honeybadger-js';
import {Buffer} from 'buffer';
import {Attendance} from 'app/flux/DataSource';
import {Interaction} from 'app/flux/DataSource';
import {OmzS3} from 'app/services';

class InteractionActions {
    constructor () {
        this.generateActions(
            'receiving',
            'receivingReconnect',
            'acceptingCall',
            'connected',
            'accepting',
            'endingInteraction',
            'finishingInteraction',
            'reconnecting',
            'ending',
            'closing',
            'closingSocial',
            'postponing',
            'fetchingInteraction',
            'fetchingInbox',
            'resettingInbox',
            'fetchingInboxMessages',
            'fetchedInboxMessages',
            'sendingMessage',
            'readingMessages',
            'savingCurrentMessage',
            'changingClientMenu',
            'receivingTextMessage',
            'deliveredTextMessage',
            'failedTextMessage',
            'typingInteraction',
            'clearingInteraction',
            'closing',
            'showingEndInteraction',
            'closingEndInteraction',
            'savingCustomerInfo',
            'savedCustomerInfo',
            'searchingCustomerInfo',
            'searchedCustomerInfo',
            'clearingCustomers',
            'changingCustomer',
            'changingClientFieldForm',
            'settingClientFormValues',
            'changingClientFormState',
            'loadingClientInfo',
            'settingCustomerInfoValues',
            'settingClientFormState',
            'settingCallUrls',
            'loadingInbox',
            'loadedInbox',
            'openingInbox',
            'openedSocialInbox',
            'loadingInteractionMessages',
            'loadedInteractionMessages',
            'sendingOffContactMessage',
            'sendedOffContactMessage',
            'sendingChatContentViaEmail',
            'sendedChatContentViaEmail',
            'loadedRemoteMessages',
            'fetchedCustomerHistory',
            'settingCurrentCustomerHistoryId',
            'fetchingCustomerHistoryDetail',
            'fetchedCustomerHistoryDetail',
            'fetchingTransferAgents',
            'fetchedTransferAgents',
            'updatingTransferFilter',
            'transferingInteraction',
            'transferSuccessed',
            'transferFailed',
            'finishingTransfer',
            'loadingTags',
            'loadedTags',
            'loadedNotes',
            'togglingAddNote',
            'togglingShowTags',
            'savingSearchTagValue',
            'changingTags',
            'creatingNote',
            'createdNote',
            'savedNote',
            'toggledTransferState',
            'alertingInbox',
            'removingInbox',
            'changedAttachmentAlert',
            'editingNote',
            'resettingHistory',
            'fetchingAgentHistory',
            'fetchedAgentHistory',
            'changingSearch',
            'settingCurrentIndex',
            'updatingInboxCheck',
            'fetchingLastWeek',
            'fetchedLastWeek',
            'fetchingTalking',
            'fetchedTalking',
            'fetchingPending',
            'fetchedPending',
            'fetchingAnswered',
            'fetchedAnswered',
            'fetchingNotAnswered',
            'fetchedNotAnswered',
            'sendingMeliMessage',
            'sentMeliMessage'
        );
    }

    waitAndFetchInbox (sessionId) {
        console.log('INSIDE WAIT_AND_FETCH_INBOX', sessionId);
        this.fetchInbox.defer(sessionId);
    }

    receiveText (sessionId, ai, type, transfer) {
        const params = {
            id: sessionId,
            type: type.toLowerCase(),
            activeInteraction: ai,
            isTransfer: transfer
        };

        this.receiving(params);
    }

    receiveVideo (sessionId, ai, oneway, type, transfer) {
        const params = {
            id: sessionId,
            type: type,
            activeInteraction: ai,
            isTransfer: transfer
        };

        this.receiving(params);
    }

    receiveAudio (sessionId, ai, type, transfer) {
        const params = {
            id: sessionId,
            type: type,
            activeInteraction: ai,
            isTransfer: transfer
        };

        this.receiving(params);
    }

    fetchInteraction (sessionId) {
        this.fetchingInteraction(sessionId);
    }

    fetchInbox (sessionId) {
        this.fetchingInbox(sessionId);
    }

    resetInbox () {
        this.resettingInbox({});
    }

    fetchInboxMessages (sessionId, page, type, index) {
        const params = {
            sessionId: sessionId,
            page: page,
            type: type,
            index: index,
            messages: []
        };

        this.fetchingInboxMessages(params);
        Interaction.getMessages(sessionId, page).then((results) => {
            params.messages = results.entity;
            this.fetchedInboxMessages(params);
        }, (error) => {
            if (error.timeout) {
                params.error = 'TIMEOUT';
                Honeybadger.notify(error, 'Timeout on LoadMessages');
                this.fetchedInboxMessages(params);
            } else {
                params.error = 'ERROR';
                Honeybadger.notify(error, 'ERROR on LoadMessages');
                this.fetchedInboxMessages(params);
            }
        });
    }

    openInbox (sessionId) {
        this.openingInbox(sessionId);
    }

    acceptCall (sessionId) {
        this.acceptingCall(sessionId);
    }

    connect (sessionId) {
        this.connected(sessionId);
    }

    retrieveMessages (sessionId) {
        const params = {
            sessionId: sessionId,
            data: []
        };

        this.loadingInteractionMessages(sessionId);
        Interaction.getMessages(sessionId).then((results) => {
            params.data = results.entity;
            this.loadedInteractionMessages(params);
            this.readMessages(sessionId);
            this.connect(sessionId);
        }, (error) => {
            if (error.timeout) {
                params.error = 'TIMEOUT';
                Honeybadger.notify(error, 'Timeout on LoadMessages');
                this.loadedInteractionMessages(params);
            } else {
                params.error = 'ERROR';
                Honeybadger.notify(error, 'ERROR on LoadMessages');
                this.loadedInteractionMessages(params);
            }
        });
    }

    reconnectCall (sessionId) {
        this.acceptingCall(sessionId);
    }

    reconnectTextSession (sessionId) {
        this.receivingReconnect(sessionId);
    }

    receiveTextMessage (time, message, remote, sessionId, mediaType) {
        this.receivingTextMessage(time, message, remote, sessionId, mediaType);
    }

    typesInteraction (sessionId) {
        this.typingInteraction(sessionId);
    }

    clearInteraction (sessionId) {
        this.clearingInteraction(sessionId);
    }

    deliveredTextMessage (cseq, time, sessionId) {
        this.deliveringTextMessage(cseq, time, sessionId);
    }

    failedTextMessage (cseq, sessionId) {
        this.failedTextMessage(cseq, sessionId);
    }

    postponed (sessionId) {
        this.postponing(sessionId);
    }

    sendMessage (message, sessionId, clearCurrentMessage) {
        this.sendingMessage(message, sessionId, clearCurrentMessage);
    }

    sendMeliMessage (message, sessionId, agentId) {
        const params = {
            message: message,
            sessionId: sessionId,
            agentId: agentId
        };

        this.sendingMeliMessage(params);
        Attendance.sendMeliMessage(message, sessionId, agentId).then(() => {
        });
    }

    finishMeliMessage (sessionId) {
        Attendance.finishMeliMessage(sessionId).then(() => {
        });
    }

    readMessages (sessionId) {
        this.readingMessages(sessionId);
    }

    saveCurrentMessage (sessionId, message) {
        const params = {
            sessionId: sessionId,
            message: message
        };

        this.savingCurrentMessage(params);
    }

    changeClientMenu (sessionId, clientMenuindex) {
        this.changingClientMenu(sessionId, clientMenuindex);
    }

    closeText (sessionId) {
        this.reconnecting(sessionId);
    }

    endText (sessionId, reason) {
        const params = {
            sessionId: sessionId,
            type: 'text',
            reason: reason
        };

        this.ending(params);
    }

    closeCall (request, sessionId) {
        this.reconnecting(sessionId);
    }

    endCall (reason, sessionId) {
        const params = {
            sessionId: sessionId,
            type: 'call',
            reason: reason
        };

        this.ending(params);
    }

    endInteraction (sessionId) {
        this.endingInteraction(sessionId);
    }

    finishInteraction (sessionId) {
        this.finishingInteraction(sessionId);
    }

    close (params) {
        this.closing(params);
    }

    closeSocial (sessionId) {
        this.closingSocial(sessionId);
    }

    showEndInteraction (sessionId, type) {
        const params = {
            sessionId: sessionId,
            type: type
        };

        this.showingEndInteraction(params);
    }

    closeEndInteraction (sessionId) {
        this.closingEndInteraction(sessionId);
    }

    saveCustomerInfo (customerInfo, callback) {
        this.savingCustomerInfo();

        Attendance.processKey(customerInfo).then((result) => {
            customerInfo.customerKey = result.entity.customerKey;

            Attendance.saveCustomerInfo(customerInfo).then((results) => {
                this.savedCustomerInfo(results);
                callback();
            });
        });
    }

    searchCustomerInfo (name, sessionId, accountId) {
        const params = {
            name: name,
            sessionId: sessionId
        };

        this.searchingCustomerInfo(params);
        Attendance.searchCustomerInfo(name, accountId).then((results) => {
            params.results = results.result;
            this.searchedCustomerInfo(params);
        }, (error) => {
            params.results = [];
            this.searchedCustomerInfo(params);
        });
    }

    clearCustomers (sessionId) {
        this.clearingCustomers(sessionId);
    }

    changeClientFieldForm (sessionId, field) {
        const params = {
            sessionId: sessionId,
            field: field
        };

        this.changingClientFieldForm(params);
    }

    changeCustomer (sessionId, customerKey) {
        const params = {
            sessionId: sessionId,
            customerKey: customerKey
        };

        this.changingCustomer(params);
    }

    setCustomerInfoValues (sessionId, clientForm, accountId) {
        const params = {
            sessionId: sessionId
        };

        this.loadingClientInfo(sessionId);
        Attendance.findCustomer(clientForm.data, accountId).then((result) => {
            params.result = result;
            this.settingCustomerInfoValues(params);
        });
    }

    setClientFormValues (sessionId, values) {
        const params = {
            sessionId: sessionId,
            values: values
        };

        this.settingClientFormValues(params);
    }

    setClientFormState (sessionId, type) {
        const params = {
            sessionId: sessionId,
            type: type
        };

        this.settingClientFormState(params);
    }

    addCustomer (sessionId) {

    }

    setVideoUrls (sessionId, remote, local) {
        const params = {
            sessionId: sessionId,
            remote: remote,
            local: local,
            type: 'video'
        };

        this.settingCallUrls(params);
    }

    setAudioUrl (sessionId, remote) {
        const params = {
            sessionId: sessionId,
            remote: remote,
            type: 'audio'
        };

        this.settingCallUrls(params);
    }


    getInbox (accountId, agentId, profile) {
        this.loadingInbox();
        Interaction.getInteractions(accountId, agentId, profile).then((results) => {
            this.loadedInbox(results);
        }, (error) => {
            const result = {
                entity: {}
            };

            if (error.timeout) {
                result.error = 'TIMEOUT';
                Honeybadger.notify(error, 'Timeout on LoadInteraction');
                this.loadedInbox(result);
            } else {
                result.error = 'ERROR';
                Honeybadger.notify(error, 'Error on LoadInteraction');
                this.loadedInbox(result);
            }
        });
    }

    loadRemoteMessages (sessionId, uri) {
        Interaction.getRemoteMessages(uri).then((data) => {
            const params = {
                sessionId: sessionId,
                messages: data.messages,
                metaData: data.meta
            };

            this.loadedRemoteMessages(params);
        });
    }

    sendOffContactMessage (sessionId, userData, message, toEmail, interactionType) {
        this.sendingOffContactMessage(sessionId);
        Interaction.sendOffContactMessage(sessionId, userData, message, toEmail, interactionType).then((result) => {
            this.sendedOffContactMessage(sessionId);
        }, (error) => {
            this.sendedOffContactMessage(sessionId);
        });
    }

    sendChatContentViaEmail (sessionId, information, departmentId, toEmail) {
        const params = {
            accountId: information.account.id,
            departmentId: departmentId,
            sessionId: sessionId,
            toEmail: toEmail,
            agentEmail: information.email
        };

        this.sendingChatContentViaEmail(sessionId);

        Interaction.sendChatContentViaEmail(params).then((result) => {
            params.result = result;
            this.sendedChatContentViaEmail(params);
        });
    }

    fetchCustomerHistory (sessionId, customerKey, accountFree) {
        if (!customerKey || customerKey.length < 5) {
            return;
        }
        Interaction.fetchCustomerHistory(customerKey, accountFree).then((response) => {
            const params = {
                sessionId: sessionId,
                result: response.result
            };

            this.fetchedCustomerHistory(params);
        });
    }

    fetchCustomerHistoryDetail (sessionId, id) {
        const params = {
            sessionId: sessionId,
            id: id
        };

        this.settingCurrentCustomerHistoryId(params);
        if (!id) {
            return;
        }

        this.fetchingCustomerHistoryDetail(params);
        Interaction.fetchCustomerHistoryDetail(id).then((response) => {
            params.response = response;
            this.fetchedCustomerHistoryDetail(params);
        });
    }

    fetchTransferAgents () {
        this.fetchingTransferAgents({});

        Interaction.getTransferAgents().then((response) => {
            this.fetchedTransferAgents(response.result);
        });
    }

    transferInteraction (destination) {
        this.transferingInteraction({destination});
    }

    updateTransferFilter (params) {
        this.updatingTransferFilter(params);
    }

    finishTransfer () {
        this.finishingTransfer({});
    }

    uploadFile (buffer, sessionId, info, interactionType, agentId) {
        const params = {
            Key: `${sessionId}/${info.name}`,
            Body: new Buffer(buffer.replace(/^data:\w+([^\s]+base64)/, '').replace(/^,/, ''), 'base64'),
            ContentType: info.type
        };

        OmzS3.putObject(params, (putErr, data) => {
            if (putErr) {
                Honeybadger.notify(putErr, {
                    name: 'Upload file to S3 Failed',
                    context: {sessionId: sessionId}
                });
                this.changedAttachmentAlert(sessionId);
            }
            OmzS3.getSignedUrl('getObject', {Key: params.Key}, (getErr, url) => {
                if (putErr) {
                    Honeybadger.notify(putErr, {
                        name: 'Getting URL from S3 Failed',
                        context: {sessionId: sessionId}
                    });
                    this.changedAttachmentAlert(sessionId);
                } else {
                    if (interactionType === 'meli_msg') {
                        this.sendMeliMessage(url.split('?')[0], sessionId, agentId);
                        return;
                    }
                    this.sendingMessage(url.split('?')[0], sessionId);
                }
            });
        });
    }

    transferSuccess (interaction) {
        this.transferSuccessed({interaction});
    }

    transferFail (interaction) {
        this.transferFailed({interaction});
    }

    toggleAddNote (sessionId) {
        this.togglingAddNote(sessionId);
    }

    toggleShowTags (sessionId) {
        this.togglingShowTags(sessionId);
    }

    changeTags (sessionId, tags) {
        const params = {
            sessionId: sessionId,
            tags: tags
        };

        this.changingTags(params);
    }

    getTags (sessionId, accountId) {
        const params = {
            sessionId: sessionId,
            tags: []
        };

        this.loadingTags(sessionId);
        Attendance.getTags(accountId).then((data) => {
            params.tags = data.result;
            this.loadedTags(params);
        }, (error) => {
            if (error.timeout) {
                params.error = 'TIMEOUT';
                Honeybadger.notify(error, 'Timeout on LoadInteraction');
                this.loadedTags(params);
            } else {
                params.error = 'ERROR';
                Honeybadger.notify(error, 'Error on LoadInteraction');
                this.loadedTags(params);
            }
        });
    }

    saveSearchTagValue (sessionId, searchValue) {
        const params = {
            sessionId: sessionId,
            searchValue: searchValue
        };

        this.savingSearchTagValue(params);
    }

    getNotes (sessionId) {
        const params = {
            sessionId: sessionId,
            notes: []
        };

        Attendance.getNotes(sessionId).then((data) => {
            params.note = data.result;
            this.loadedNotes(params);
        }, (error) => {
            if (error.timeout) {
                params.error = 'TIMEOUT';
                Honeybadger.notify(error, 'Timeout on GetNotes');
                this.loadedNotes(params);
            } else {
                params.error = 'ERROR';
                Honeybadger.notify(error, 'Error on GetNotes');
                this.loadedNotes(params);
            }
        });
    }

    createNote (params) {
        this.creatingNote(params.sessionId);
        Attendance.createNote(params.sessionId, params.noteContent, params.tagIds, params.agent.id).then((result) => {
            params.result = result;
            this.createdNote(params);
        }, (error) => {
            if (error.timeout) {
                params.error = 'TIMEOUT';
                Honeybadger.notify(error, 'Timeout on GetNotes');
                this.createdNote(params);
            } else {
                params.error = 'ERROR';
                Honeybadger.notify(error, 'Error on GetNotes');
                this.createdNote(params);
            }
        });
    }

    saveNote (params) {
        this.savedNote(params);
    }

    updateNote (params) {
        this.creatingNote(params.sessionId);
        Attendance.updateNote(params.sessionId, params.noteContent, params.tagIds, params.agent.id, params.id).then((result) => {
            params.result = result;
            this.createdNote(params);
        }, (error) => {
            if (error.timeout) {
                params.error = 'TIMEOUT';
                Honeybadger.notify(error, 'Timeout on GetNotes');
                this.createdNote(params);
            } else {
                params.error = 'ERROR';
                Honeybadger.notify(error, 'Error on GetNotes');
                this.createdNote(params);
            }
        });
    }

    sendWebhook (params) {
        Interaction.sendWebhook(params).then((result) => {});
    }

    sendRdstation (params) {
        Interaction.sendRdstation(params).then((result) => {});
    }

    toggleTransferState (sessionId) {
        this.toggledTransferState(sessionId);
    }

    discardOffcontact (sessionId, agentId) {
        Interaction.discardOffcontact(sessionId, agentId).then((result) => {
            if (result.status === 200) {
                this.removingInbox(sessionId);
            }
        });
    }

    alertInbox (status) {
        this.alertingInbox(status);
    }

    changeAttachmentAlert (sessionId, error) {
        const params = {
            sessionId: sessionId,
            error: error
        };

        this.changedAttachmentAlert(params);
    }

    editNote (sessionId, index) {
        const params = {
            sessionId: sessionId,
            index: index
        };

        this.editingNote(params);
    }

    resetHistory (additionalClear) {
        this.resettingHistory(additionalClear);
    }

    fetchAgentHistory (params) {
        params.status = 'LOADING';

        if (params.reset) {
            this.resetHistory();
        }

        this.fetchingAgentHistory(params);

        Interaction.fetchAgentHistory(params).then((result) => {
            params.status = '';
            params.result = result;
            this.fetchedAgentHistory(params);
        }, (error) => {
            if (error.timeout) {
                params.status = 'TIMEOUT';
                this.fetchedAgentHistory(params);
                Honeybadger.notify(error, {
                    name: 'BODYLIFT - Timeout on getting history',
                    context: {
                        accountId: params.accountId,
                        agentId: params.agentId
                    }
                });
            } else {
                params.status = 'ERROR';
                this.fetchedAgentHistory(params);
                Honeybadger.notify(error, {
                    name: 'BODYLIFT - Error on getting history',
                    context: {
                        accountId: params.accountId,
                        agentId: params.agentId
                    }
                });
            }
        });
    }

    changeSearch (type, value) {
        const params = {
            type: type,
            value: value
        };

        this.changingSearch(params);
    }

    setCurrentIndex (type, index) {
        const params = {
            type: type,
            index: index
        };

        this.settingCurrentIndex(params);
    }

    updateInboxCheck (inboxIndex, allChecked) {
        const params = {
            inboxIndex: inboxIndex,
            allChecked: allChecked
        };

        this.updatingInboxCheck(params);
    }

    fetchLastWeek (receivedParams) {
        const params = {
            accountId: receivedParams.accountId,
            status: 'LOADING',
            data: []
        };

        this.fetchingLastWeek(params);
        Interaction.fetchLastWeek(params.accountId).then((response) => {
            params.data = response;
            params.status = '';
            this.fetchedLastWeek(params);
        }, (error) => {
            if (error.timeout) {
                params.status = 'TIMEOUT';
                this.fetchedLastWeek(params);
                Honeybadger.notify(error, {
                    name: 'REPORTS - Timeout on getting lastWeekInteractions',
                    context: {accountId: params.accountId}
                });
            } else {
                params.status = 'ERROR';
                this.fetchedLastWeek(params);
                Honeybadger.notify(error, {
                    name: 'REPORTS - Error on getting lastWeekInteractions',
                    context: {accountId: params.accountId}
                });
            }
        });
    }

    fetchTalking (receivedParams) {
        const params = {
            accountId: receivedParams.accountId,
            status: 'LOADING',
            data: []
        };

        this.fetchingTalking(params);
        Interaction.fetchTalking(params.accountId).then((response) => {
            params.data = response;
            params.status = '';
            this.fetchedTalking(params);
        }, (error) => {
            if (error.timeout) {
                params.status = 'TIMEOUT';
                this.fetchedTalking(params);
                Honeybadger.notify(error, {
                    name: 'REPORTS - Timeout on getting talking',
                    context: {accountId: params.accountId}
                });
            } else {
                params.status = 'ERROR';
                this.fetchedTalking(params);
                Honeybadger.notify(error, {
                    name: 'REPORTS - Error on getting talking',
                    context: {accountId: params.accountId}
                });
            }
        });
    }

    fetchPending (receivedParams) {
        const params = {
            accountId: receivedParams.accountId,
            status: 'LOADING',
            data: []
        };

        this.fetchingPending(params);
        Interaction.fetchPending(params.accountId).then((response) => {
            params.data = response;
            params.status = '';
            this.fetchedPending(params);
        }, (error) => {
            if (error.timeout) {
                params.status = 'TIMEOUT';
                this.fetchedPending(params);
                Honeybadger.notify(error, {
                    name: 'REPORTS - Timeout on getting pendings',
                    context: {accountId: params.accountId}
                });
            } else {
                params.status = 'ERROR';
                this.fetchedPending(params);
                Honeybadger.notify(error, {
                    name: 'REPORTS - Error on getting pendings',
                    context: {accountId: params.accountId}
                });
            }
        });
    }

    fetchAnswered (receivedParams) {
        const params = {
            accountId: receivedParams.accountId,
            status: 'LOADING',
            data: []
        };

        this.fetchingAnswered(params);
        Interaction.fetchAnswered(params.accountId).then((response) => {
            params.data = response;
            params.status = '';
            this.fetchedAnswered(params);
        }, (error) => {
            if (error.timeout) {
                params.status = 'TIMEOUT';
                this.fetchedAnswered(params);
                Honeybadger.notify(error, {
                    name: 'REPORTS - Timeout on getting answered',
                    context: {accountId: params.accountId}
                });
            } else {
                params.status = 'ERROR';
                this.fetchedAnswered(params);
                Honeybadger.notify(error, {
                    name: 'REPORTS - Error on getting answered',
                    context: {accountId: params.accountId}
                });
            }
        });
    }

    fetchNotAnswered (receivedParams) {
        const params = {
            accountId: receivedParams.accountId,
            status: 'LOADING',
            data: []
        };

        this.fetchingNotAnswered(params);
        Interaction.fetchNotAnswered(params.accountId).then((response) => {
            params.data = response;
            params.status = '';
            this.fetchedNotAnswered(params);
        }, (error) => {
            if (error.timeout) {
                params.status = 'TIMEOUT';
                this.fetchedNotAnswered(params);
                Honeybadger.notify(error, {
                    name: 'REPORTS - Timeout on getting not answered',
                    context: {accountId: params.accountId}
                });
            } else {
                params.status = 'ERROR';
                this.fetchedNotAnswered(params);
                Honeybadger.notify(error, {
                    name: 'REPORTS - Error on getting not answered',
                    context: {accountId: params.accountId}
                });
            }
        });
    }
}

export default alt.createActions(InteractionActions);
