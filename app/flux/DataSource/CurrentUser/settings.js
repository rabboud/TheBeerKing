import {ENV} from 'app/services';

export default {
    AUTH_URI: ENV.AUTH_URI,
    CHANGE_AVATAR_URI: ENV.CHANGE_AVATAR_URI,
    HASH: document.springHash,
    HEADERS: {
        Accept: 'application/json'
    }
};
