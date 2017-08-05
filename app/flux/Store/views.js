import alt from 'app/flux/Alt';
import {viewsActions, currentUserActions} from 'app/flux/Actions';
import {PartnerModel} from 'app/flux/Model';

class ViewsStore {
    constructor () {
        this.state = {
            accountFree: false,
            inboxCount: 0,
            hasInternetConnection: true,
            leftMenuState: 'disabled',
            settingsMenuState: 'closed',
            accountMenuState: 'closed',
            changePasswordState: 'closed',
            changeAvatarState: 'closed',
            passwordResponseState: 'closed',
            offlineModalState: 'closed',
            officeHoursModalState: 'closed',
            showInteractionMessages: false,
            currentInboxTab: 0,
            currentIntegrationTab: 0,
            isWindowFocused: true,
            modal: {
                tagView: {
                    showFilter: false,
                    showPeriod: false,
                    showAddEdit: false
                },
                inboxView: {
                    showPeriod: false,
                    showFilter: false
                },
                userView: {
                    showFilter: false,
                    showAddEdit: false
                },
                departmentView: {
                    showFilter: false,
                    showAddEdit: false
                },
                officeHourView: {
                    showAddEdit: false
                },
                telegramView: {
                    showAddEdit: false,
                    activePanel: 0
                },
                facebookView: {
                    showAddEdit: false,
                    activePanel: 0
                },
                webhookView: {
                    showAddEdit: false,
                    activePanel: 0
                },
                emailView: {
                    showAddEdit: false
                }
            },
            partner: null
        };
        this.bindActions(viewsActions);
    }

    onClosingOfficeHoursModal () {
        this.setState({
            officeHoursModalState: 'closed'
        });
    }

    onOpeningOfficeHoursModal () {
        this.setState({
            officeHoursModalState: 'opened'
        });
    }

    onClosedAllMenus () {
        this.setState({
            accountMenuState: 'closed',
            settingsMenuState: 'closed',
            changePasswordState: 'closed'
        });
    }

    onClosedAndResetedAccountForms () {
        this.setState({
            changeAvatarState: 'closed',
            changePasswordState: 'closed',
            passwordResponseState: 'closed'
        });
    }

    onClosedAvatar () {
        this.setState({
            changeAvatarState: 'closed'
        });

        currentUserActions.resetAvatar.defer();
    }

    onToggledAccountMenuState () {
        this.setState({
            accountMenuState: this.state.accountMenuState === 'closed' ? 'opened' : 'closed'
        });
    }

    onToggledSettingsMenuState () {
        this.setState({
            settingsMenuState: this.state.settingsMenuState === 'closed' ? 'opened' : 'closed'
        });
    }

    onToggledLeftMenuState () {
        this.setState({
            leftMenuState: this.state.leftMenuState === 'disabled' ? 'enabled' : 'disabled'
        });
    }

    onToggledChangeAvatarState () {
        this.setState({
            changeAvatarState: this.state.changeAvatarState === 'closed' ? 'opened' : 'closed',
            accountMenuState: 'closed'
        });
    }

    onToggledChangePasswordState () {
        this.setState({
            changePasswordState: this.state.changePasswordState === 'closed' ? 'opened' : 'closed'
        });
    }

    onToggledPasswordResponseState () {
        this.setState({
            passwordResponseState: this.state.passwordResponseState === 'closed' ? 'opened' : 'closed'
        });
    }

    onFetchedInboxCount (result) {
        if (result.status === 200) {
            if (this.state.inboxCount !== result.interactions.length) {
                this.setState({
                    inboxCount: result.interactions.length
                });
            }
        }
    }

    onUpdatingInternetConnection (status) {
        if (status !== this.state.hasInternetConnection) {
            this.setState({
                hasInternetConnection: status === 'online' ? true : false,
                offlineModalState: status === 'offline' && this.state.offlineModalState === 'closed' ? 'opened' : this.state.offlineModalState
            });
        }
    }

    onClosingOfflineModal () {
        this.setState({
            offlineModalState: 'closed'
        });
    }

    onTogglingState (id) {
        this.state[id] = !this.state[id];
    }

    showingInteractionMessages () {
        this.state.showInteractionMessages = true;
    }

    hidingInteractionMessages () {
        this.state.showInteractionMessages = false;
    }

    onChangingInboxTab (key) {
        this.state.currentInboxTab = key;
    }

    onHidingInboxUser () {
        this.state.showInboxUser = false;
    }

    onChangingIntegrationTab (key) {
        this.state.currentIntegrationTab = key;
    }

    onTogglingModalState (params) {
        if (params.screen) {
            this.state.modal[params.screen][params.modal] = !this.state.modal[params.screen][params.modal];
        } else {
            this.state.modal[params.modal] = !this.state.modal[params.modal];
        }

        this.setState({
            modal: this.state.modal
        });
    }

    onFetchedPartnerInfo (result) {
        if (result.status === 200) {
            const partner = new PartnerModel(result.data);

            partner.logoUrl = result.logo_url;
            this.state.partner = partner;
        }
    }

    onForwardingModalPanel (view) {
        this.state.modal[view].activePanel++;

        this.setState({
            modal: this.state.modal
        });
    }

    onRewindingModalPanel (view) {
        this.state.modal[view].activePanel--;

        this.setState({
            modal: this.state.modal
        });
    }

    onShowingInitialModalPanel (view) {
        this.state.modal[view].activePanel = 0;

        this.setState({
            modal: this.state.modal
        });
    }

    onShowingModalPanelIndex (params) {
        this.state.modal[params.view].activePanel = params.index;

        this.setState({
            modal: this.state.modal
        });
    }

    onUpdatingWindowsFocus (isFocused) {
        this.state.isWindowFocused = isFocused;
    }
}

export default alt.createStore(ViewsStore, 'viewsStore');
