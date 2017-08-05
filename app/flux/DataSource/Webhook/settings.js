import {ENV} from 'app/services';

export default {
    PAGINATION_SIZE: ENV.PAGINATION_SIZE,
    URI_LIST: ENV.BODYLIFT + '/webhooks',
    URI_CHANGE: ENV.BODYLIFT + '/webhook'
};
