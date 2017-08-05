import _ from 'lodash';
import alt from 'app/flux/Alt';
import {browserHistory} from 'react-router';
import {CurrentUser} from 'app/flux/DataSource';
import {ENV} from 'app/services';
import Crypto from 'crypto-js';
import Jsrsasign from 'jsrsasign';
import {Session, OmzHistory} from 'app/services';
import {viewsActions} from 'app/flux/Actions';
import Honeybadger from 'honeybadger-js';
import {OfficeHours} from 'app/flux/DataSource';

class CurrentUserActions {
    constructor () {
        this.generateActions(
            'changedAvatar',
            'zoomedAvatar',
            'savingAvatar',
            'savedAvatar',
            'addedAvatarPreview',
            'changedAvatarScale',
            'resetedAvatar',
            'savingPasswordForm',
            'changedPassword',
            'changingPassword',
            'fetchedCurrentUser',
            'fetchedJWTSession',
            'refreshedJWTSession',
            'digestedJWTSession',
            'gettingCurrentUserType',
            'resetedChangePassword',
            'turningOnSip',
            'turningOffSip',
            'settingVideoElements',
            'settingAudioElement',
            'signingIn',
            'signedIn',
            'signedOut',
            'signedInError',
            'transferingInteraction'
        );
    }

    _decodeJWT (dataHash) {
        const data = dataHash.split('.');
        const uClaim = decodeURIComponent(escape(Jsrsasign.b64utos(data[1])));
        const pClaim = Jsrsasign.KJUR.jws.JWS.readSafeJSONString(uClaim);

        return pClaim;
    }

    _padString (pass) {
        const paddingChar = ' ';
        const size = 16;
        const x = pass.length % size;
        const padLength = size - x;
        let source = pass;

        for (let i = 0; i < padLength; i++) {
            source = source + paddingChar;
        }

        return source;
    }

    _generateHash (password) {
        const key = Crypto.enc.Latin1.parse('%AES,omnize2015#');
        const iv = Crypto.enc.Latin1.parse('fedcba9876543210');

        const passDescrypt = Crypto.AES.encrypt(
            this._padString(password),
            key,
            {
                iv,
                padding: Crypto.pad.NoPadding,
                mode: Crypto.mode.CBC
            }
        );

        return passDescrypt.toString();
    }


    fetchCurrentUser () {
        if (ENV.TYPE === 'STANDALONE') {
            const entity = {
                account: {
                    id: '1'
                },
                agent: {
                    id: '4'
                },
                subscriber: {
                    username: 'agent_000003',
                    domain: 'account00001.omnize.com',
                    password: 'dff9f3ce7c9fa015c6f442afd46dbd694957f503d7b8e4d2676e4e08289663f1'
                },
                wsserver: 'ws://33.33.33.10'
                //
                // PRODUCTION TEST
                //
                // account: {
                //     id: '6'
                // },
                // agent: {
                //     id: '20'
                // },
                //
                // subscriber: {
                //     username: 'agent_000019',
                //     domain: 'account00006.omnize.com',
                //     password: '57165e329ab3f5782616bb9697868dafc3303ce7b9eaf1858dba8bea3da52177'
                // },
                // wsserver: 'wss://edge.omnize.com'
            };

            const result = {
                entity: [entity]
            };

            this.fetchedCurrentUser(result);
        } else {
            CurrentUser.fetch().then((result) => {
                this.fetchedCurrentUser(result);
            });
        }
    }

    turnOnSip (accountId) {
        OfficeHours.verify(accountId).then((response) => {
            if (response.active || response.status === 404) {
                this.turningOnSip();
            } else {
                viewsActions.closeAllMenus();
                viewsActions.openOfficeHoursModal();
            }
        }, (error) => {
            if (error.timeout) {
                Honeybadger.notify(error, 'Timeout on OfficeHours - verify');
            } else {
                Honeybadger.notify(error, 'Error on OfficeHours - verify');
            }
            this.turningOnSip();
        });
    }

    turnOffSip () {
        this.turningOffSip();
    }

    setVideoElements (local, remote) {
        const params = {
            local: local,
            remote: remote
        };

        this.settingVideoElements(params);
    }

    setAudioElement (remote) {
        this.settingAudioElement(remote);
    }

    resetChangePassword () {
        this.resetedChangePassword();
    }

    changeAvatar (image) {
        this.changedAvatar({
            image: image
        });
    }

    zoomAvatar (scale) {
        this.zoomedAvatar({scale});
    }

    saveAvatar (id, image64) {
        this.savingAvatar();
        CurrentUser.changeAvatar(id, image64).then((result) => {
            this.savedAvatar({
                image: result.image,
                status: 'DONE',
                message: 'Seu nova foto foi alterada com sucesso.'
            });
        }, (error) => {
            if (error.timeout) {
                this.savedAvatar({
                    status: 'TIMEOUT'
                });
                Honeybadger.notify(error, {
                    name: 'Timeout on Change Avatar',
                    context: {userId: id}
                });
            } else {
                this.savedAvatar({
                    status: 'ERROR'
                });
                Honeybadger.notify(error, {
                    name: 'Error on Change Avatar',
                    context: {userId: id}
                });
            }
        });
    }

    resetAvatar () {
        this.resetedAvatar({});
    }

    savePasswordForm (fields) {
        this.savingPasswordForm(fields);
    }

    changePassword (formFields) {
        this.changingPassword();
        CurrentUser.changePassword(
            formFields.id,
            formFields.oldPassword,
            formFields.newPassword
        ).then((result) => {
            if (result.status === 500) {
                this.changedPassword({
                    status: 'ERROR',
                    message: 'Falha na troca de senha!'
                });
            } else if (result.message === 'Password wrong') {
                this.changedPassword({
                    status: 'ERROR',
                    message: 'Senha atual inválida!'
                });
            } else {
                this.changedPassword({
                    status: 'DONE',
                    message: 'Senha alterada com sucesso!'
                });
            }
            viewsActions.togglePasswordResponseState();
        }, (error) => {
            if (error.timeout) {
                this.changedPassword({
                    status: 'ERROR',
                    message: 'Troca de senha demorou!'
                });
                Honeybadger.notify(error, {
                    name: 'Timeout on authentication - Signin',
                    context: {userId: formFields.id}
                });
            } else {
                this.changedPassword({
                    status: 'ERROR',
                    message: 'Troca de senha falhou!'
                });
                Honeybadger.notify(error, {
                    name: 'Error on authentication - Signin',
                    context: {userId: formFields.id}
                });
            }
            viewsActions.togglePasswordResponseState();
        });
    }

    signIn (email, password) {
        if (email === '' || password === '') {
            this.signedInError('Preencha todos os campos.');

            return;
        }

        this.signingIn();
        CurrentUser.signIn({
            email: email,
            password: this._generateHash(password)
        }).then((result) => {
            if (result.token === '') {
                this.signedInError('E-mail ou senha incorreta.');
                return;
            }

            const userInfo = this._decodeJWT(result.token);

            this.signedIn({token: result.token, data: userInfo});
            this.turnOnSip(userInfo.account.id);
            browserHistory.push('/');
        }, (error) => {
            if (error.timeout) {
                this.signedInError('Autenticação está demorando! \nTente novamente ou entre em contato.');
                Honeybadger.notify(error, {
                    name: 'Timeout on authentication - Signin',
                    context: {email: email}
                });
            } else {
                this.signedInError('Falha na autenticação! \nTente novamente ou entre em contato.');
                Honeybadger.notify(error, {
                    name: 'Error on authentication - Signin',
                    context: {email: email}
                });
            }
        });
    }

    signOut () {
        this.signedOut();
        this.turnOffSip();
        browserHistory.push('/login');
    }

    fetchJWTSession (token, cb) {
        const params = {
            token: token,
            information: '',
            cb: cb
        };
        const urlsToIgnore = [
            '/login'
        ];
        const isIgnoredLocation = (_.indexOf(urlsToIgnore, OmzHistory.getLocation()) !== -1);

        if (!isIgnoredLocation && !Session.get('omz_token') && !params.token) {
            OmzHistory.redirectToLogin();
            this.fetchedJWTSession(params);
            return;
        }

        CurrentUser.getJWTSession(params.token).then((result) => {
            if (result.errorMessage) {
                Honeybadger.notify(result, 'Error on authentication - FetchJWT');
                Session.clear();
                OmzHistory.redirectToLogin();
            }

            if (result.message === 'denied' || result.message === 'expired') {
                Session.clear();
                OmzHistory.redirectToLogin();
            }

            if (!result.token) {
                Session.clear();
                OmzHistory.redirectToLogin();
            } else {
                params.token = result.token;
                params.information = this._decodeJWT(result.token);

                this.turnOnSip(params.information.account.id);
            }

            this.fetchedJWTSession(params);

            if (cb && typeof cb === 'function') {
                cb(params.information.account.id);
            }
        }, (error) => {
            if (error.timeout) {
                Honeybadger.notify(error, 'Timeout on authentication - FetchJWT');
                Session.clear();
                OmzHistory.redirectToLogin();
            } else {
                Honeybadger.notify(error, 'Error on authentication - FetchJWT');
                Session.clear();
                OmzHistory.redirectToLogin();
            }
        });
    }

    refreshJWTSession () {
        CurrentUser.updateJWTSession().then((result) => {
            if (result.message === 'denied' || result.message === 'expired') {
                Session.clear();
                return;
            }

            this.refreshedJWTSession({token: result.token, data: this._decodeJWT(result.token)});
        }, (error) => {
            if (error.timeout) {
                Honeybadger.notify(error, 'Timeout on authentication - updateJWT');
            } else {
                Honeybadger.notify(error, 'Error on authentication - updateJWT');
            }
        });
    }

    digestJwtSession (token) {
        this.digestedJWTSession({token: token, data: this._decodeJWT(token)});
    }

    transferInteraction (sessionId, destination, customerInfo) {
        this.transferingInteraction({
            sessionId,
            destination,
            customerInfo
        });
    }

    addAvatarPreview (image64) {
        this.addedAvatarPreview({image64});
    }

    changeAvatarScale (value) {
        this.changedAvatarScale({value});
    }
}

export default alt.createActions(CurrentUserActions);
