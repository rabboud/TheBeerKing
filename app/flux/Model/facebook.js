import Moment from 'moment';

class Model {
    constructor (facebookPage) {
        this.id = facebookPage && facebookPage.id !== null ? facebookPage.id : '';
        this.pageName = facebookPage && facebookPage.name !== null ? facebookPage.name : '';
        this.pageImage = facebookPage && facebookPage.pictureUrl !== null ? facebookPage.pictureUrl : '';
        this.accessToken = facebookPage && facebookPage.accessToken !== null ? facebookPage.accessToken : '';

        this.adminName = facebookPage && facebookPage.adminName !== null ? facebookPage.adminName : '';
        this.adminEmail = facebookPage && facebookPage.adminEmail !== null ? facebookPage.adminEmail : '';

        this.departmentName = facebookPage && facebookPage.department.name !== null ? facebookPage.department.name : '';
        this.departmentId = facebookPage && facebookPage.department.id !== null ? facebookPage.department.id : '';

        this.verifiedAt = facebookPage && facebookPage.validationDate !== null ? this.parseDate(facebookPage.validationDate) : '';
        this.state = facebookPage && facebookPage.state !== null ? this.parseState(facebookPage.state) : '';
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

    parseDate (date) {
        return Moment(date).format('DD/MM/YYYY');
    }
}

export default Model;
