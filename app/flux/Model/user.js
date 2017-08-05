import _ from 'lodash';
import {ProfileModel, DepartmentModel} from 'app/flux/Model';

class Model {
    constructor (user) {
        this.id = user && user.id !== null ? user.id : '';
        this.accountId = user && user.accountId !== null ? user.accountId : '';
        this.name = user && user.name !== null ? user.name : '';
        this.email = user && user.email !== null ? user.email : '';
        this.profiles = user && user.profiles !== null ? this.parseProfiles(user.profiles) : [];
        this.departments = user && user.departments !== null ? this.parseDepartments(user.departments) : [];
        this.state = user && user.state !== null ? this.parseState(user.state) : 'INACTIVE';
        this.photo = user && user.photo !== null ? user.photo : '';
        this.password = '';
        this.passwordConfirm = '';
    }

    parseState (state) {
        switch (state) {
            case 1:
                return 'ACTIVE';
            case 0:
                return 'INACTIVE';
            default:
                return 'INACTIVE';
        }
    }

    parseProfiles (profiles) {
        return _.map(profiles, (profile) => {
            return new ProfileModel(profile);
        });
    }

    parseDepartments (departments) {
        return _.map(departments, (department) => {
            return new DepartmentModel(department);
        });
    }

    getProfile () {
        return _.find(this.profiles, (profile) => {
            return profile;
        });
    }
}

export default Model;
