import React from 'react';
import _ from 'lodash';
import {
    ModalDefault,
    Card,
    Form,
    InputText,
    SimpleList,
    InputCheckbox,
    Button,
    Animated,
    Icon
} from 'app/screens/Components';

class AddEditUser extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            activePanel: null,
            showSuggestion: false
        };
        this.saveUser = this.saveUser.bind(this);
    }

    _close () {
        this.setState({
            activePanel: null
        });
        this.props.closeUserModal();
    }

    _changeToDepartment (e) {
        e.preventDefault();
        this.setState({
            activePanel: 0
        });
    }

    _changeToUser () {
        this.setState({
            activePanel: null
        });
    }

    saveUser (e) {
        this.setState({
            activePanel: null
        });
        this.props.saveUser(e);
    }

    render () {
        const cardTitle = (
            <label>
                <Icon name="back" iconClass="icon--clickable icon--inline" width="20px" height="12.9px" handleClick={this._changeToUser.bind(this)}/>
                <p className="title title--card title--inline title--margin-l-1 title--quaternary">
                    {this.props.titleCardModal}
                </p>
            </label>
        );
        const departmentUser = (
            <Card helpers="AddEditUser__container__card" contentPadded={true} title={cardTitle} data-scroll="true">
                <Form>
                    <div className="card__content__header">
                        <div className="row collapse">
                            <h4>Departamentos cadastrados</h4>
                        </div>
                    </div>
                    <div className="card__content__container">
                    {
                        this.props.userDepartmentsValues.selectAll ? (
                            <div className="row collapse">
                                <div className="options columns large-2">
                                    <InputCheckbox
                                        id="dept-all"
                                        name="Todos"
                                        checked={
                                            this.props.userDepartmentsValues.selectedOptionsId.length
                                            && (this.props.userDepartmentsValues.selectedOptionsId.split(',').length
                                            === this.props.userDepartmentsValues.options.length)
                                                ? true
                                                : false
                                        }
                                        onChange={
                                            () => this.props.userDepartmentsChanged(
                                                this.props.userDepartmentsValues.id,
                                                -1,
                                                this.props.userDepartmentsValues.selectedOptionsId
                                                && (this.props.userDepartmentsValues.selectedOptionsId.split(',').length
                                                === this.props.userDepartmentsValues.options.length)
                                            )
                                        }
                                    />
                                </div>
                                <div className="options__text columns large-10">
                                    <label htmlFor="dept-all">Todos</label>
                                </div>
                            </div>
                        ) : null
                    }
                    {
                        _.map(this.props.userDepartmentsValues.options, (department, key) => (
                            <div className="row collapse" key={key}>
                                <div className="options columns large-2">
                                    <InputCheckbox
                                        id={department.name}
                                        name={department.name}
                                        checked={department.selected}
                                        onChange={
                                            () => this.props.userDepartmentsChanged(
                                                this.props.userDepartmentsValues.id,
                                                key,
                                                this.props.userDepartmentsValues.selectedOptionsId
                                                && (this.props.userDepartmentsValues.selectedOptionsId.split(',').length
                                                === this.props.userDepartmentsValues.options.length)
                                            )
                                        }
                                    />
                                </div>
                                <div className="options__text columns large-10">
                                    <label htmlFor={department.name}>{department.name}</label>
                                </div>
                            </div>
                        ))
                    }
                    </div>
                    <div className="card__content__footer">
                        <Button size="small" color="green-secondary" className="btn--large" full={true} handleOnClick={this.saveUser}>
                            Salvar
                        </Button>
                    </div>
                </Form>
            </Card>
        );
        const getSelectedProfile = (profiles) => {
            const selectedProfile = _.find(profiles, (profile) => {
                return profile.selected;
            });

            return selectedProfile ? selectedProfile.label : '';
        };

        return (
            <div className={`AddEditUser ${this.props.className}`}>
                <ModalDefault
                    isOpen={this.props.openUserModal}
                    onRequestClose={this._close.bind(this)}
                    shouldCloseOnOverlayClick={true} className="AddEditUser__modal"
                    parentSelector={this.props.modalParentSelector}
                    cardContent={true}
                    isCentralized={true}
                >
                    <div className="AddEditUser__container">
                        <Animated
                            className="full--height"
                            transition={true}
                            secondariesPanel={[departmentUser]}
                            activePanelIndex={this.state.activePanel}
                        >
                            <Card helpers="AddEditUser__container__card" contentPadded={true} title={this.props.titleCardModal}>
                                <Form ref={(c) => this.userForm = c} onSubmit={this._changeToDepartment.bind(this)}>
                                    <InputText
                                        ref={(c) => this.name = c}
                                        type="text"
                                        value={this.props.user.name}
                                        name="name"
                                        placeholder="Nome"
                                        className="input--rounded input--border-gray"
                                        animation="input-animated"
                                        hasLabel={true}
                                        validations={['required']}
                                        onChange={this.props.userChanged}
                                    />
                                    <InputText
                                        ref={(c) => this.email = c}
                                        type="text"
                                        value={this.props.user.email}
                                        name="mail"
                                        placeholder="E-mail"
                                        className="input--rounded input--border-gray"
                                        animation="input-animated"
                                        hasLabel={true}
                                        validations={['required', 'email']}
                                        onChange={this.props.userChanged}
                                    />
                                    <InputText
                                        ref={(c) => this.password = c}
                                        type="password"
                                        value={this.props.user.password}
                                        name="password"
                                        placeholder="Senha"
                                        className="input--rounded input--border-gray"
                                        animation="input-animated"
                                        hasLabel={true}
                                        validations={this.props.userPasswordValidate ? ['required', 'password'] : ['password']}
                                        onChange={this.props.userChanged}
                                    />
                                    <InputText
                                        ref={(c) => this.passwordConfirm = c}
                                        type="password"
                                        value={this.props.user.passwordConfirm}
                                        name="passwordConfirm"
                                        placeholder="Confirmação de senha"
                                        className="input--rounded input--border-gray"
                                        animation="input-animated"
                                        hasLabel={true}
                                        validations={this.props.userPasswordValidate ? ['required', 'password'] : ['password']}
                                        onChange={this.props.userChanged}
                                    />
                                    <InputText
                                        ref={(c) => this.select = c}
                                        type="select"
                                        placeholder="Tipo de usuário"
                                        name="profile"
                                        className="input--rounded input--border-gray"
                                        animation="input-animated"
                                        disabled={true}
                                        sugestionOpen={this.state.showSuggestion}
                                        sugestion={
                                            <SimpleList
                                                container={this.props.profiles}
                                                paddingLeft="10px"
                                                maxHeight="100px"
                                                onClick={this.props.userProfileChanged}
                                            />
                                        }
                                        sugestionClass="input__select"
                                        sugestionDirection="up"
                                        value={getSelectedProfile(this.props.profiles)}
                                        hasLabel={true}
                                        validations={[]}
                                        onClick={() => this.setState({showSuggestion: !this.state.showSuggestion})}
                                        onCloseSugestion={() => this.setState({showSuggestion: false})}
                                    />
                                    <Button size="small" color="green-secondary" className="btn--large" full={true} validate={true}>
                                        Escolher departamento
                                    </Button>
                                </Form>
                            </Card>
                        </Animated>
                    </div>
                </ModalDefault>
            </div>
        );
    }
}

AddEditUser.PropTypes = {
    className: React.PropTypes.string,
    user: React.PropTypes.object,
    userPasswordValidate: React.PropTypes.bool,
    profiles: React.PropTypes.array,
    userDepartmentsValues: React.PropTypes.array,
    userChanged: React.PropTypes.func,
    userDepartmentsChanged: React.PropTypes.func,
    userProfileChanged: React.PropTypes.func,
    saveUser: React.PropTypes.func
};

export default AddEditUser;
