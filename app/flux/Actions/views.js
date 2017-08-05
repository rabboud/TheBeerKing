import alt from 'app/flux/Alt';
import {Interaction, Partner} from 'app/flux/DataSource';
import Honeybadger from 'honeybadger-js';

class ViewsActions {
    constructor () {
        this.generateActions(
            'closedAllMenus',
            'closedAndResetedAccountForms',
            'closedAvatar',
            'toggledAccountMenuState',
            'toggledChangeAvatarState',
            'toggledChangePasswordState',
            'toggledSettingsMenuState',
            'toggledLeftMenuState',
            'toggledPasswordResponseState',
            'fetchedInboxCount',
            'updatingInternetConnection',
            'closingOfflineModal',
            'openingOfficeHoursModal',
            'closingOfficeHoursModal',
            'showingInteractionMessages',
            'hidingInteractionMessages',
            'changingInboxTab',
            'changingIntegrationTab',
            'showingInboxUser',
            'hidingInboxUser',
            'togglingModalState',
            'fetchedPartnerInfo',
            'forwardingModalPanel',
            'rewindingModalPanel',
            'showingInitialModalPanel',
            'showingModalPanelIndex',
            'updatingWindowsFocus'
        );
    }

    toggleAccountMenuState () {
        this.toggledAccountMenuState({});
    }

    toggleSettingsMenuState () {
        this.toggledSettingsMenuState({});
    }

    toggleLeftMenuState () {
        this.toggledLeftMenuState({});
    }

    closeAvatar () {
        this.closedAvatar({});
    }

    toggleAvatarState () {
        this.toggledChangeAvatarState({});
    }

    toggleChangePasswordState () {
        this.toggledChangePasswordState({});
    }

    closeAllMenus () {
        this.closedAllMenus({});
    }

    closeAndResetAccountForms () {
        this.closedAndResetedAccountForms({});
    }

    togglePasswordResponseState () {
        this.toggledPasswordResponseState({});
    }

    fetchInboxCount (accountId, agentId, profile, callback) {
        Interaction.getInboxCount(accountId, agentId, profile).then((result) => {
            this.fetchedInboxCount(result);
            if (typeof callback === 'function') {
                callback();
            }
        }, (error) => {
            if (error.timeout) {
                Honeybadger.notify(error, 'Timeout on LoadInteraction - Count');
            } else {
                Honeybadger.notify(error, 'Error on LoadInteraction - Count');
            }
        });
    }

    updateInternetConnection (status) {
        this.updatingInternetConnection(status);
    }

    closeOfflineModal () {
        this.closingOfflineModal();
    }

    closeOfficeHoursModal () {
        this.closingOfficeHoursModal();
    }

    openOfficeHoursModal () {
        this.openingOfficeHoursModal();
    }

    showInteractionMessages () {
        this.showingInteractionMessages();
    }

    hideInteractionMessages () {
        this.hidingInteractionMessages();
    }

    changeInboxTab (key) {
        this.changingInboxTab(key);
    }

    changeIntegrationTab (key) {
        this.changingIntegrationTab(key);
    }

    hideInboxUser () {
        this.hidingInboxUser();
    }

    toggleModalState (modal, screen) {
        const params = {
            modal: modal,
            screen: screen
        };

        this.togglingModalState(params);
    }

    fetchPartnerInfo (partner) {
        Partner.fetch(partner).then((result) => {
            this.fetchedPartnerInfo(result);
        });
    }

    forwardModalPanel (view) {
        this.forwardingModalPanel(view);
    }

    rewindModalPanel (view) {
        this.rewindingModalPanel(view);
    }

    showInitialModalPanel (view) {
        this.showingInitialModalPanel(view);
    }

    showModalPanelIndex (view, index) {
        const params = {
            view: view,
            index: index
        };

        this.showingModalPanelIndex(params);
    }

    updateWindowsFocus (isFocused) {
        this.updatingWindowsFocus(isFocused);
    }
}

export default alt.createActions(ViewsActions);
