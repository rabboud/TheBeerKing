import {ENV} from 'app/services';

export default {
    URI_LIST: ENV.BODYLIFT + '/officehours',
    URI_CHANGE: ENV.BODYLIFT + '/officehour',
    URI_TIMEZONES: ENV.BODYLIFT + '/timezones',
    URI: ENV.OFFICEHOURS_URI
};
