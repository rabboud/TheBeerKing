import Request from '../request';
import Settings from './settings';
import {Session} from 'app/services';

const resource = Settings.AUTH_URI;

class CurrentUserDataSource {
    static changePassword (id, oldPassword, newPassword) {
        const params = {
            send: {
                'agent_id': id,
                'password': oldPassword,
                'new_password': newPassword
            }
        };

        return Request.do('POST', `${resource}/change-password`, params);
    }

    static signIn (data) {
        const params = {
            send: {
                action: 'login',
                username: data.email,
                password: data.password
            }
        };

        return Request.do('POST', `${resource}/authentication`, params);
    }

    static getJWTSession (token) {
        const params = {
            set: {
                Authorization: token || Session.get('omz_token')
            },
            send: {
                action: 'verify'
            }
        };

        return Request.do('POST', `${resource}/authentication`, params);
    }

    static updateJWTSession () {
        const params = {
            set: {
                Authorization: Session.get('omz_token')
            },
            send: {
                action: 'refresh'
            }
        };

        return Request.do('POST', `${resource}/authentication`, params);
    }

    static changeAvatar (agentId, image64) {
        const params = {
            send: {
                'agent_id': agentId,
                'photo': image64
            }
        };

        return Request.do('POST', Settings.CHANGE_AVATAR_URI, params);
    }
}

export default CurrentUserDataSource;
