import _ from 'lodash';

class OmzHistory {
    static getLocation () {
        return window.location.pathname;
    }

    static getUri () {
        return window.location.hostname;
    }

    static forcePushState (path) {
        window.location.pathname = path;
    }

    static getParameters () {
        const query = window.location.search.substr(1);
        const result = {};

        _.map(query.split('&'), (part) => {
            const item = part.split('=');

            result[item[0]] = decodeURIComponent(item[1]);
        });

        return (Object.keys(result)[0] === '' ? false : result);
    }

    static getParameter (name) {
        const queries = this.getParameters();

        if (!queries) {
            return false;
        }

        return queries[name] || false;
    }

    static redirectToLogin () {
        if (!(this.getLocation() === '/login')) {
            this.forcePushState('/login');
        }
    }
}

export default OmzHistory;
