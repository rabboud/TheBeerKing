import _ from 'lodash';

class FilterHelper {
    constructor (collection) {
        try {
            if (typeof collection !== 'object') {
                throw new Error('Invalid collection type. Should be an object.');
            }
        } catch (err) {
            console.error(err);
            return;
        }

        this.collection = collection;
    }

    byValue (filterObj) {
        this.collection = _.filter(this.collection, filterObj);
        return this.collection;
    }

    byIndex (indexObj) {
        _.map(Object.keys(indexObj), (field) => {
            this.collection = _.filter(this.collection, (item) => {
                return item[field].toLowerCase().indexOf(indexObj[field].toLowerCase()) !== -1;
            });
        });

        return this.collection;
    }

    byRange (field, rangeObj) {
        const rangeList = _.filter(this.collection, (item) => {
            return rangeObj.min <= item[field] && item[field] <= rangeObj.max;
        });

        this.collection = rangeList;
        return this.collection;
    }

    uniq (uniqValue) {
        const uniqList = _.map(_.orderBy(this.collection, uniqValue), uniqValue);

        return _.uniq(uniqList);
    }

    getCollection () {
        return this.collection;
    }
}

export default FilterHelper;
