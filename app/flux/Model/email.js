import {UserModel, DepartmentModel} from 'app/flux/Model';

class Model {
    constructor (email) {
        this.id = email && email.id ? email.id : '';
        this.email = email && email.email ? email.email : '';
        this.agent = email && email.agent ? new UserModel(email.agent) : {};
        this.department = email && email.department ? new DepartmentModel(email.department) : {};
        this.createdAt = email && email.createdAt ? email.createdAt : '';
        this.state = email && email.state ? this.parseState(email.state) : '';
    }

    parseState (state) {
        console.log(state);
        switch (state) {
            case true:
                return 'ACTIVE';
            case false:
                return 'INACTIVE';
            default:
                return 'INACTIVE';
        }
    }
}

export default Model;
