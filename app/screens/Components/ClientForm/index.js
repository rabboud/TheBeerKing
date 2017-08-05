import React from 'react';
import {InputText} from '../Form';
import {Form} from 'omz-react-validation/lib/build/validation.rc';
import Icon from '../Icon';
import Loader from '../Loader';

class ClientForm extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <div className="ClientForm">
                {
                    this.props.clientForm.state === 'loading' ? (
                        <Loader full="true" backdrop="true"/>
                    ) : ''
                }
                <div className="ClientForm__top rythm--6">
                    <div className="InteractionHistory__detail__header__action large-1 columns rythm--center">
                        <Icon name="back" iconClass="icon--black icon--clickable" width="20px" height="13.8px" handleClick={this.props.closeClientForm}/>
                    </div>
                    <div className="InteractionHistory__detail__header__type large-11 columns rythm--center">
                        {
                            this.props.clientForm.state === 'add' || this.props.clientForm.state === 'fake-add' ? (
                                <h4 className="ClientForm__title">Adicionar dados do cliente</h4>
                            ) : (
                                <h4 className="ClientForm__title">Editar dados do cliente</h4>
                            )
                        }
                    </div>
                </div>
                {
                    !this.props.inputsDisabled ? (
                        <Form className="ClientForm__form" ref={(c) => {this.form = c;}}>
                            <div className="ClientForm__input-container">
                                <InputText
                                    name="name"
                                    placeholder="Nome"
                                    value={this.props.clientForm.data.name}
                                    ref={(c) => {this.name = c;}}
                                    className="input--rounded input--border-gray"
                                    animation="input-animated"
                                    hasLabel={true}
                                    autoComplete="off"
                                    onChange={this.props.handleChange}
                                    validations={[]}
                                />
                            </div>

                            <div className="ClientForm__input-container">
                                <InputText
                                    name="email"
                                    placeholder="E-mail"
                                    value={this.props.clientForm.data.email}
                                    ref={(c) => {this.email = c;}}
                                    className="input--rounded input--border-gray"
                                    animation="input-animated"
                                    hasLabel={true}
                                    onChange={this.props.handleChange}
                                    autoComplete="off"
                                    validations={[]}
                                />
                            </div>

                            <div className="ClientForm__input-container">
                                <InputText
                                    name="phone"
                                    placeholder="Telefone"
                                    value={this.props.clientForm.data.phone}
                                    ref={(c) => {this.phone = c;}}
                                    className="input--rounded input--border-gray"
                                    animation="input-animated"
                                    hasLabel={true}
                                    onChange={this.props.handleChange}
                                    autoComplete="off"
                                    validations={[]}
                                    mask="(11) 11111-1111"
                                />
                            </div>

                            <div className="ClientForm__input-container">
                                <InputText
                                    name="cpf"
                                    placeholder="CPF"
                                    value={this.props.clientForm.data.cpf}
                                    ref={(c) => {this.cpf = c;}}
                                    className="input--rounded input--border-gray"
                                    animation="input-animated"
                                    hasLabel={true}
                                    onChange={this.props.handleChange}
                                    autoComplete="off"
                                    validations={[]}
                                    mask="111.111.111-11"
                                />
                            </div>
                        </Form>
                    ) : null
                }
                {
                    this.props.clientForm.state === 'error' ? (
                        <div className="ClientForm__error">
                            <p className="ClientForm__error__message text--quaternary text--error">Existe um cliente com dados iguais aos inseridos.</p>
                            <p className="ClientForm__error__action text--quaternary text--error">Volte e pesquise um cliente, ou adicione um novo cliente com dados diferentes.</p>
                        </div>
                    ) : ''
                }
                <div className="ClientForm__actions">
                    <Icon name="check" iconColor="white" width="24px" padding="20.5px 18px" bkgCircle={true} bkgColor="green-primary" clickable={true} inline={true} handleClick={this.props.handleSave.bind(this)}/>
                </div>
            </div>
        );
    }
}

ClientForm.propTypes = {
    clientForm: React.PropTypes.object,
    inputsDisabled: React.PropTypes.bool,
    handleSave: React.PropTypes.func,
    handleChange: React.PropTypes.func,
    closeClientForm: React.PropTypes.func
};

export default ClientForm;
