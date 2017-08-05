import _ from 'lodash';
import alt from 'app/flux/Alt';
import {userActions} from 'app/flux/Actions';
import {UserModel} from 'app/flux/Model';

class UserStore {
    constructor () {
        this.state = {
            status: '',
            search: '',
            page: 0,
            profiles: [
                {
                    id: 'AGENT',
                    name: 'Agente',
                    select: false
                },
                {
                    id: 'ADMIN',
                    name: 'Administrador',
                    select: false
                }
            ],
            users: [],
            currentUser: {
                accountId: '',
                name: '',
                email: '',
                photo: '',
                password: '',
                passwordConfirm: '',
                profile: '',
                departments: {}
            },
            online: {
                status: '',
                data: []
            }
        };
        this.bindActions(userActions);
    }

    onResettingAll () {
        this.state.users = [];
        this.state.page = 0;
        this.state.status = '';
    }

    onFetchingAll (params) {
        this.state.status = params.status;
    }

    onFetchedAll (params) {
        this.state.page = this.state.page + 1;
        this.state.status = params.status;

        if (params.status === 'TIMEOUT' || params.status === 'ERROR') {
            return;
        }

        if (params.results.length === 0) {
            this.state.status = 'ENDED';
            return;
        }

        _.map(params.results, (user) => {
            this.state.users.push(new UserModel(user));
        });
    }

    onTogglingUserState (params) {
        this.state.users[params.userKey].state = params.user.state === 'INACTIVE' ? 'ACTIVE' : 'INACTIVE';
        this.setState({
            users: this.state.users
        });
    }

    onToggledUserState (params) {
        if (params.error) {
            this.state.users[params.userKey].state = params.user.state === 'INACTIVE' ? 'ACTIVE' : 'INACTIVE';
            this.setState({
                users: this.state.users
            });
        }
    }

    onChangingCurrentUser (userSelected) {
        if (userSelected) {
            this.state.currentUser.type = 'edit';
            this.state.currentUser.id = userSelected.id;
            this.state.currentUser.name = userSelected.name;
            this.state.currentUser.email = userSelected.email;
            this.state.currentUser.photo = userSelected.photo;
            this.state.currentUser.profiles = userSelected.profiles;
            this.state.currentUser.departments = userSelected.departments;
            this.state.currentUser.password = '';
            this.state.currentUser.passwordConfirm = '';
        } else {
            this.state.currentUser.type = 'add';
            this.state.currentUser.name = '';
            this.state.currentUser.email = '';
            this.state.currentUser.photo = 0;
            this.state.currentUser.password = '';
            this.state.currentUser.passwordConfirm = '';
            this.state.currentUser.profiles = [];
            this.state.currentUser.departments = [];
        }
    }

    onUpdatingCurrentUser (user) {
        this.state.currentUser.name = user.name;
        this.state.currentUser.email = user.mail;
        this.state.currentUser.photo = user.photo;
        this.state.currentUser.password = user.password;
        this.state.currentUser.departments = user.departments;
        this.state.currentUser.profiles = user.profiles;
    }

    onChangingSearchValue (value) {
        this.setState({
            search: value
        });
    }

    onFetchingOnline (params) {
        this.state.online.status = params.status;
    }

    onFetchedOnline (params) {
        this.state.online.status = params.status;
        this.state.online.data = [];

        _.map(params.data, (user) => {
            this.state.online.data.push(user);
        });
    }
}

export default alt.createStore(UserStore, 'userStore');
