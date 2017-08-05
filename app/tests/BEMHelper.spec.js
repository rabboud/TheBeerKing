import {BEMHelper} from 'app/helpers';

describe('Testing BEMHelper Class', () => {
    const BEM = new BEMHelper('button');

    it('Testing Block Method', () => {
        expect(BEM.getBlock()).toBe('button');
        expect(BEM.getBlock('col col-md-12')).toBe('button col col-md-12');
    });

    it('Testing Element Method', () => {
        expect(BEM.setElement('icon')).toBe('button__icon');
        expect(BEM.setElement('icon', 'blocked')).toBe('button__icon blocked');
    });

    it('Testing Modifier Method', () => {
        expect(BEM.setModifiers(['sm'])).toBe('button button--sm');
        expect(BEM.setModifiers(['sm', 'secondary'])).toBe('button button--sm button--secondary');
    });
});
