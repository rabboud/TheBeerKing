import _ from 'lodash';

class BEMHelper {
    constructor (block) {
        try {
            if (typeof block !== 'string') {
                throw new Error('Invalid block type. Should be a string.');
            }
        } catch (error) {
            console.error(error);
            return;
        }
        this.block = block;
    }

    getBlock (className = '') {
        return `${this.block}${className ? ' ' + className : ''}`;
    }

    setElement (element, className = '') {
        return `${this.block}__${element}${className ? ' ' + className : ''}`;
    }

    setModifiers (mods) {
        let classNames = this.block;

        if (typeof mods === 'object') {
            _.map(mods, (mod) => {
                classNames = `${classNames} ${this.block}--${mod}`;
            });
        } else {
            classNames = `${classNames} ${this.block}--${mods}`;
        }

        return classNames;
    }
}

export default BEMHelper;
