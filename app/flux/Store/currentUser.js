import alt from 'app/flux/Alt';
import _ from 'lodash';
import Honeybadger from 'honeybadger-js';
import {OmzSip} from 'app/services';
import {currentUserActions} from 'app/flux/Actions';
import {interactionActions} from 'app/flux/Actions';
import {Session} from 'app/services';

class CurrentUserStore {
    constructor () {
        this.state = {
            information: {
                account: {
                    email: '',
                    id: 0,
                    name: ''
                },
                email: '',
                exp: 0,
                firstAccess: false,
                iat: 0,
                id: 0,
                master: '',
                name: '',
                photo: '',
                subscriber: {
                    domain: '',
                    ha1: '',
                    ha1b: '',
                    id: 0,
                    password: '',
                    username: ''
                },
                subscription: '',
                wsserver: ''
            },
            status: 'LOADING',
            registerState: 'NOT_REGISTERED',
            OmzSip: {},
            changePasswordState: {
                status: '',
                message: ''
            },
            passwordForm: {
                oldPassword: '',
                newPassword: '',
                newPasswordConfirmation: ''
            },
            changeAvatarState: {
                image: '',
                scale: 1.5,
                status: '',
                message: ''
            },
            loginState: {
                status: '',
                message: ''
            }
        };

        this.bindActions(currentUserActions);
    }

    onAddedAvatarPreview (params) {
        const avatarObj = _.extend({}, this.state.changeAvatarState);

        avatarObj.image = params.image64;

        this.setState({
            changeAvatarState: avatarObj
        });
    }

    onChangedAvatarScale (params) {
        const avatarObj = _.extend({}, this.state.changeAvatarState);

        avatarObj.scale = params.value;

        this.setState({
            changeAvatarState: avatarObj
        });
    }

    onSavingAvatar () {
        const avatarObj = _.extend(this.state.changeAvatarState, {});

        avatarObj.status = 'LOADING';

        this.setState({
            changeAvatarState: avatarObj
        });
    }

    onZoomedAvatar (params) {
        const avatarObj = _.extend(this.state.changeAvatarState, {});

        avatarObj.scale = params.scale;

        this.setState({
            changeAvatarState: avatarObj
        });
    }

    onSavedAvatar (savedAvatarResponse) {
        const avatarObj = _.extend(this.state.changeAvatarState, {});

        avatarObj.image = savedAvatarResponse.image || '';
        avatarObj.status = savedAvatarResponse.status;
        avatarObj.message = savedAvatarResponse.message || '';
        avatarObj.scale = 1;

        this.setState({
            changeAvatarState: avatarObj
        });

        if (savedAvatarResponse.status === 'ERROR' || savedAvatarResponse.status === 'TIMEOUT') {
            return;
        }

        currentUserActions.refreshJWTSession.defer();
    }

    onSavingPasswordForm (fields) {
        this.setState({
            passwordForm: {
                oldPassword: fields.oldPassword,
                newPassword: fields.newPassword,
                newPasswordConfirmation: fields.newPasswordConfirmation
            }
        });
    }

    onChangingPassword () {
        this.setState({
            changePasswordState: {
                status: 'WAITING',
                message: ''
            }
        });
    }

    onChangedPassword (changePasswordResponse) {
        this.setState({
            changePasswordState: {
                status: changePasswordResponse.status,
                message: changePasswordResponse.message
            }
        });
    }

    onFetchedCurrentUser (data) {
        if (typeof this.state.information.wsserver === 'undefined') {
            this.setState({
                information: data.entity[0]
            });
        }
    }

    onFetchedJWTSession (params) {
        if (params.token && params.information) {
            Session.set('omz_token', params.token);
            this.setState({
                information: params.information,
                status: ''
            });
        } else {
            this.setState({
                status: ''
            });
        }
    }

    onRefreshedJWTSession (userInformation) {
        this.setState({
            information: userInformation.data
        });

        Session.set('omz_token', userInformation.token);
    }

    onDigestedJWTSession (userInformation) {
        this.setState({
            information: userInformation.data
        });

        Session.set('omz_token', userInformation.token);
    }

    onResetedAvatar () {
        this.setState({
            changeAvatarState: {
                image: '',
                scale: 1.5,
                status: '',
                message: ''
            }
        });
    }

    onResetedChangePassword () {
        this.setState({
            changePasswordState: {
                status: '',
                message: ''
            }
        });
    }

    onSigningIn () {
        this.setState({
            loginState: {
                status: 'WAITING',
                message: ''
            }
        });
    }

    onSignedIn (signInResponse) {
        this.setState({
            information: signInResponse.data,
            loginState: {
                status: 'DONE',
                message: ''
            }
        });

        Session.set('omz_token', signInResponse.token);
    }

    onSignedInError (message) {
        this.setState({
            loginState: {
                status: 'ERROR',
                message
            }
        });
    }

    onSignedOut () {
        Session.clear();
        this.setState({
            information: {
                account: {
                    email: '',
                    id: 0,
                    name: ''
                },
                email: '',
                exp: 0,
                firstAccess: false,
                iat: 0,
                id: 0,
                master: '',
                name: '',
                photo: '',
                subscriber: {
                    domain: '',
                    ha1: '',
                    ha1b: '',
                    id: 0,
                    password: '',
                    username: ''
                },
                subscription: '',
                wsserver: ''
            }
        });
    }

    onTurningOnSip () {
        const registerPreferences = {
            username: `${this.state.information.subscriber.username}@${this.state.information.subscriber.domain}`,
            password: this.state.information.subscriber.password,
            host: `wss:${this.state.information.wsserver}`,
            logLevel: 2,
            trace: 'debug',
            expires: 300,
            registerHandlers: {
                success: () => {
                    this.setState({
                        registerState: 'REGISTERED'
                    });
                },
                fail: (cause) => {
                    this.setState({
                        registerState: 'NOT_REGISTERED'
                    });
                    this.registeredFailed(cause);
                },
                error: (cause) => {
                    this.setState({
                        registerState: 'NOT_REGISTERED'
                    });
                    this.registeredFailed(cause);
                },
                unregister: () => {
                    this.setState({
                        registerState: 'NOT_REGISTERED'
                    });
                }
            }
        };

        const agentProfilePreferences = {
            localVideoStreamContainer: {},
            remoteVideoStreamContainer: {},
            remoteAudioStreamContainer: {},
            textMessagesComposer: {},
            'agent_id': this.state.information.id,
            totalVoice: {
                enabled: (this.state.information.id === 13817),
                token: 'bcf10077fd5f8206c78de6b16baea3b5',
                station: 4000
            },
            agentInfo: {'image-path': this.state.information.photo, 'name': this.state.information.name, 'enable-messages': true},
            callHandlers: {
                newTextMessage: interactionActions.receiveTextMessage,
                messageDelivered: interactionActions.deliveredTextMessage,
                messageFailed: interactionActions.failedTextMessage,
                typing: interactionActions.typesInteraction,
                cleared: interactionActions.clearInteraction,

                receiveTextSession: interactionActions.receiveText,
                initVideoCall: interactionActions.receiveVideo,
                initAudioCall: interactionActions.receiveAudio,

                receiveAudioCall: interactionActions.connect,
                receiveVideoCall: interactionActions.connect,

                reconnectingTextSession: interactionActions.reconnectTextSession,
                reconnectingVideoCall: interactionActions.reconnectCall,
                reconnectingAudioCall: interactionActions.reconnectCall,

                finishTextSession: interactionActions.endText,
                finishVideoCall: interactionActions.endCall,
                finishAudioCall: interactionActions.endCall,

                closeTextSession: interactionActions.closeText,
                closeAudioCall: interactionActions.closeCall,
                closeVideoCall: interactionActions.closeCall,

                cancelTextSession: interactionActions.endText,
                cancelAudioCall: interactionActions.endCall,
                cancelVideoCall: interactionActions.endCall,

                transferredTextSession: interactionActions.transferSuccess,
                notTransferred: interactionActions.transferFail
            }
        };

        if (typeof this.state.OmzSip.register === 'undefined') {
            this.state.OmzSip = OmzSip(registerPreferences).withAgentProfile(agentProfilePreferences);
        }

        this.setState({
            registerState: 'REGISTERING'
        });

        this.state.OmzSip.register();
    }

    registeredFailed (cause) {
        Honeybadger.notify(cause, {
            name: 'Registration fail on SIP',
            context: {currentUser: this.state.information}
        });
    }

    onTurningOffSip () {
        this.setState({
            registerState: 'UNREGISTERING'
        });

        if (typeof this.state.OmzSip.register === 'undefined') {
            this.setState({
                registerState: 'NOT_REGISTERED'
            });
        } else {
            this.state.OmzSip.unregister();
        }
    }

    onSettingVideoElements (params) {
        this.state.OmzSip.profile.setVideoContainers(params.local, params.remote);
    }

    onSettingAudioElement (remote) {
        this.state.OmzSip.profile.setAudioContainer(remote);
    }

    onTransferingInteraction (params) {
        console.log('CALLING OMZSIP TRANSFER WITH', params);
        this.state.OmzSip.profile.transfer(params.sessionId, params.destination, JSON.stringify(params.customerInfo));
    }
}

export default alt.createStore(CurrentUserStore, 'currentUserStore');
