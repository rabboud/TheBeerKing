import Moment from 'moment';

class Model {
    constructor (telegram) {
        this.id = telegram && telegram.id !== null ? telegram.id : '';
        this.departments = telegram && telegram.departments !== null ? telegram.departments : '';
        this.botUsername = telegram && telegram.botUsername !== null ? telegram.botUsername : '';
        this.phone = telegram && telegram.phone !== null ? this.parsePhone(telegram.phone) : '';
        this.createdAt = telegram && telegram.createdAt !== null ? this.parseDate(telegram.createdAt) : '';
        this.state = telegram && telegram.state !== null ? this.parseState(telegram.state) : '';
        this.selected = false;
    }

    parseState (state) {
        switch (state) {
            case true:
                return 'ACTIVE';
            case false:
                return 'INACTIVE';
            default:
                return 'INACTIVE';
        }
    }

    parsePhone (phone) {
        let phoneLabel = '';

        if (phone.length === 9) {
            phoneLabel = `${phone.substring(0, 5)}-${phone.substring(5, 9)}`;
        }

        if (phone.length === 11) {
            phoneLabel = `(${phone.substring(0, 2)}) ${phone.substring(2, 7)}-${phone.substring(7, 11)}`;
        }

        return phoneLabel;
    }

    parseDate (date) {
        return Moment(date).format('DD/MM/YYYY');
    }
}

export default Model;
