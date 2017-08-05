import {ENV} from 'app/services';

export default {
    PAGINATION_SIZE: ENV.PAGINATION_SIZE,
    URI_LIST: ENV.BODYLIFT + '/agents',
    URI_CHANGE: ENV.BODYLIFT + '/agent',
    REPORTS: ENV.REPORTS + '/report-data'
};
