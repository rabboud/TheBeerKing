import {ENV} from 'app/services';

export default {
    PAGINATION_SIZE: ENV.PAGINATION_SIZE,
    URI_LIST: ENV.BODYLIFT + '/telegrams',
    URI_CHANGE: ENV.BODYLIFT + '/telegram',
    URI_DEPARTMENT: ENV.BODYLIFT + '/departments',
    TELEGRAM_API_BOT: ENV.TELEGRAM_API_BOT,
    TELEGRAM_API_GW: ENV.TELEGRAM_API_GW
};
