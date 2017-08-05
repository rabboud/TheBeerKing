class QueryHelper {
    constructor (locationObj) {
        try {
            if (typeof locationObj !== 'object') {
                throw new Error('Invalid location type. Should be an object.');
            }

            if (!('query' in locationObj)) {
                throw new Error('Invalid location type. Should have a "query" object.');
            }
        } catch (err) {
            console.error(err);
            return false;
        }

        this.location = locationObj;
    }

    validate (queries) {
        for (const query in queries) {
            if (!queries.hasOwnProperty(query) || typeof this.location.query[query] !== queries[query] || this.location.query[query].length === 0) {
                return false;
            }
        }

        return true;
    }

    getValue (query) {
        return this.location.query[query] || '';
    }
}

export default QueryHelper;
