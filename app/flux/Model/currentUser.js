import Immutable from 'immutable';

const CurrentUserRecord = Immutable.Record({
    id: null,
    account: '',
    administrador: '',
    ativo: '',
    ativoLabel: '',
    email: '',
    name: '',
    phone: '',
    photo: ''
});

class Model extends CurrentUserRecord {
    getId () {
        return this.get('id');
    }
}

export default Model;
