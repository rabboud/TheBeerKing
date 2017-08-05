import {FilterHelper} from 'app/helpers';

describe('Testing FilterHelper Class', () => {
    // Do not change this
    const collection = {
        properties: [
            {name: 'Sta Cecilia', beds: 2, baths: 1, price: 1500},
            {name: 'Dr Virgilio', beds: 2, baths: 2, price: 1800},
            {name: 'Vitorino Carmilo', beds: 3, baths: 3, price: 2500},
            {name: 'Conselheiro Ramalho, Liberdade', beds: 1, baths: 1, price: 1600},
            {name: 'Tamandaré, Liberdade', beds: 2, baths: 2, price: 2500}
        ]
    };

    it('Testing Value Method.', () => {
        const FilteredCollection = new FilterHelper(collection.properties);
        const filterObj = {
            beds: 2
        };
        const propertiesWithTwoBeds = FilteredCollection.byValue(filterObj);

        expect(propertiesWithTwoBeds.length).toBe(3);
    });

    it('Testing Range Method.', () => {
        const FilteredCollection = new FilterHelper(collection.properties);
        const rangeObj = {
            min: 1200,
            max: 1800
        };
        const propertiesBetweenRange = FilteredCollection.byRange('price', rangeObj);

        expect(propertiesBetweenRange.length).toBe(3);
    });

    it('Testing Uniq Method.', () => {
        const FilteredCollection = new FilterHelper(collection.properties);
        const prices = FilteredCollection.uniq('price');

        expect(typeof prices).toBe('object');
        expect(prices.length).toBe(4);
    });

    it('Testing Index Method.', () => {
        const FilteredCollection = new FilterHelper(collection.properties);
        const filterObj = {
            name: 'Liberdade'
        }
        const propertiesWithTerm = FilteredCollection.byIndex(filterObj);

        expect(propertiesWithTerm.length).toBe(2);
    })

    it('Testing No-Case sensitive on Index Method.', () => {
        const FilteredCollection = new FilterHelper(collection.properties);
        const filterObj = {
            name: 'liber'
        }
        const propertiesWithTerm = FilteredCollection.byIndex(filterObj);

        expect(propertiesWithTerm.length).toBe(2);
    })
})
