import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import Switcher from '../Switcher';
import {viewsActions, currentUserActions} from 'app/flux/Actions';
import {Icon, Line, Button, Card, InputText, Response} from 'app/screens/Components';
import {Form} from 'omz-react-validation/lib/build/validation.rc';

class AccountMenu extends React.Component {
    constructor (props) {
        super(props);
        this.handleChangePasswordSubmit = this.handleChangePasswordSubmit.bind(this);
        this.handleFileLoad = this.handleFileLoad.bind(this);
        this.handleBackButton = this.handleBackButton.bind(this);

        this.state = {
            notification: localStorage.getItem('notification') === 'on' ? true : false
        };
    }

    _save (formFields) {
        currentUserActions.changePassword(formFields);
    }

    handleChangePasswordSubmit (event) {
        event.preventDefault();

        const formFields = {
            id: this.props.currentUserStore.information.id,
            oldPassword: this.props.currentUserStore.passwordForm.oldPassword,
            newPassword: this.props.currentUserStore.passwordForm.newPassword
        };

        this._save(formFields);
    }

    handleBackButton () {
        viewsActions.closeAndResetAccountForms();
        currentUserActions.savePasswordForm({oldPassword: '', newPassword: '', newPasswordConfirmation: ''});
    }

    handleFileLoad () {
        const Reader = new FileReader();

        viewsActions.toggleChangeAvatarCropState();
        Reader.onload = (file) => {
            currentUserActions.changeAvatar(file.target.result);
        };

        Reader.readAsDataURL(ReactDOM.findDOMNode(this.refs.changeAvatarFile).files[0]);
    }

    _checkNotification () {
        if (Notification) {
            if (Notification.permission !== 'granted') {
                Notification.requestPermission();
            }
        }
    }

    handleNotificationToggle () {
        const status = localStorage.getItem('notification');

        if (status === 'off') {
            localStorage.setItem('notification', 'on');
            this.setState({
                notification: true
            });
            this._checkNotification();
        } else {
            localStorage.setItem('notification', 'off');
            this.setState({
                notification: false
            });
        }
    }

    handleConnectToggle () {
        if (this.props.currentUserStore.registerState === 'NOT_REGISTERED') {
            currentUserActions.turnOnSip(this.props.currentUserStore.information.account.id);
        }

        if (this.props.currentUserStore.registerState === 'REGISTERED') {
            currentUserActions.turningOffSip();
        }
    }

    handleInputChange () {
        const fields = {
            oldPassword: this.oldPassword.state.value,
            newPassword: this.newPassword.state.value,
            newPasswordConfirmation: this.newPasswordConfirmation.state.value
        };

        currentUserActions.savePasswordForm(fields);
    }

    removeFormError (field) {
        this.form.hideError(field);
    }

    openChangePassword () {
        viewsActions.toggleChangePasswordState();
    }

    _registeredState () {
        switch (this.props.currentUserStore.registerState) {
            case 'REGISTERED':
                return 'Conectado';
            case 'REGISTERING':
                return 'Conectando';
            case 'UNREGISTERING':
                return 'Desconectando';
            default:
                return 'Desconectado';
        }
    }

    render () {
        const accountPanelTitle = (
            <label>
                <Icon name="back" iconClass="icon--clickable icon--inline" width="20px" height="12.9px" handleClick={this.handleBackButton}/>
                <h3 className="title title--card title--inline title--margin-l-1 title--quaternary">
                    Alterar senha
                </h3>
            </label>
        );

        const accountHomePanel = (
            <article className="AccountMenu__pane" data-closed={this.props.viewsStore.changePasswordState === 'opened'}>
                <header className="AccountMenu__container__avatar">
                    {
                        this.props.currentUserStore.information.photo ? (
                            <div>
                                <img src={this.props.currentUserStore.information.photo} />
                                <div className="AccountMenu__container__avatar__change" onClick={this.props.viewsActions.toggleAvatarState}>
                                    <Icon name="change-avatar" width="13.7px" height="12px" />
                                </div>
                            </div>
                        ) : (
                            <div>
                                <Icon name="user-profile" iconClass="icon--bordered-2-white" width="78px" height="78px" />
                                <div className="AccountMenu__container__avatar__change" onClick={this.props.viewsActions.toggleAvatarState}>
                                    <Icon name="change-avatar" width="13.7px" height="12px" />
                                </div>
                            </div>
                        )
                    }
                </header>
                <label className="text--secondary columns">
                    {this.props.currentUserStore.information.name}
                </label>
                <i className="AccountMenu__container__kind">
                    {(this.props.currentUserStore.information.subscription === 'ADMIN') ? 'Administrador' : 'Atendente'}
                </i>
                <footer className="AccountMenu__container__actions-list large-12 column rythm--margin-t-1">
                    <div className="large-8 columns">
                        <span className="text--quaternary text--bold">{this._registeredState()}</span>
                    </div>
                    <div className="AccountMenu__container__actions-list__item--right large-4 columns">
                        <Switcher register={this.props.currentUserStore.registerState} onClick={this.handleConnectToggle.bind(this)} on={this.props.currentUserStore.registerState === 'REGISTERING' || this.props.currentUserStore.registerState === 'REGISTERED'}/>
                    </div>
                    <div className="AccountMenu__container__actions-list__item--mb6 large-12 columns">
                        <Line className="rythm--margin-t-1" />
                    </div>
                    <div className="large-10 columns end rythm--margin-b-1">
                        <Button link={true} inverse={true} handleOnClick={this.openChangePassword.bind(this)}>Alterar Senha</Button>
                    </div>
                    <div className="large-8 columns rythm--margin-b-1">
                        <span className="text--quaternary">Notificações</span>
                    </div>
                    <div className="AccountMenu__container__actions-list__item--right large-4 columns">
                        <Switcher onClick={this.handleNotificationToggle.bind(this)} on={this.state.notification}/>
                    </div>
                    {
                        this.props.currentUserStore.information.licenseCode !== 'PARTNER' ? (
                            <div className="large-10 columns end rythm--margin-b-1">
                                <a href="https://www.omnize.com.br/ajuda/nova-versao-omnize-atendimento" title="Ajuda" target="_blank">
                                    Ajuda
                                </a>
                            </div>
                        ) : null
                    }
                    <div className="large-10 columns end">
                        <Button link={true} inverse={true} handleOnClick={currentUserActions.signOut}>Sair</Button>
                    </div>
                </footer>
            </article>
        );

        const accountChangePasswordPanel = (
            <article className="AccountMenu__pane AccountMenu__pane--secondary" data-closed={this.props.viewsStore.changePasswordState === 'closed'}>
                <Card helpers="AccountMenu__pane__container" title={accountPanelTitle}>
                    {
                        !(this.props.viewsStore.changePasswordState === 'closed') ? (
                            <Form className="AccountMenu__pane__container__form columns rythm--margin-t-2" ref={(c) => {this.form = c;}}>
                                <InputText name="oldPassword" type="password" placeholder="Senha atual" value={this.props.currentUserStore.passwordForm.oldPassword} ref={(oldPassword) => {this.oldPassword = oldPassword;}} className="rythm--margin-b-1 input--rounded input--border-gray" animation="input-animated" hasLabel={true} onChange={this.handleInputChange.bind(this)} onFocus={() => {this.removeFormError('oldPassword');}} validations={['required']}/>
                                <InputText name="newPassword" type="password" placeholder="Nova Senha" value={this.props.currentUserStore.passwordForm.newPassword} ref={(newPassword) => {this.newPassword = newPassword;}} className="rythm--margin-b-1 input--rounded input--border-gray" animation="input-animated" hasLabel={true} onChange={this.handleInputChange.bind(this)} onFocus={() => {this.removeFormError('newPassword');}} validations={['required']}/>
                                <InputText name="newPasswordConfirmation" type="password" placeholder="Confirme a nova senha" value={this.props.currentUserStore.passwordForm.newPasswordConfirmation} ref={(newPasswordConfirmation) => {this.newPasswordConfirmation = newPasswordConfirmation;}} className="rythm--margin-b-1 input--rounded input--border-gray" animation="input-animated" hasLabel={true} onChange={this.handleInputChange.bind(this)} onFocus={() => {this.removeFormError('newPasswordConfirmation');}} validations={['required']}/>
                                <Button color="green" full={true} size="medium" handleOnClick={this.handleChangePasswordSubmit.bind(this)} validate={true}>Salvar alterações</Button>
                            </Form>
                        ) : ''
                    }
                </Card>
            </article>
        );

        const responseTitle = this.props.currentUserStore.changePasswordState.status === 'ERROR' ? 'Falha na alteração' : 'Altereção realizada';
        const responseFailed = this.props.currentUserStore.changePasswordState.status === 'ERROR';
        const accountPasswordResponsePanel = (
            <article className="AccountMenu__pane AccountMenu__pane--secondary AccountMenu__pane__response-container" data-closed={this.props.viewsStore.passwordResponseState === 'closed'}>
                <Response size="small" failed={responseFailed} title={responseTitle} message={this.props.currentUserStore.changePasswordState.message}>
                    <Button color="gray" size="big" full={true} handleOnClick={this.handleBackButton}>Voltar</Button>
                </Response>
            </article>
        );

        return (
            <section className="AccountMenu">
                <div className="AccountMenu__avatar" onClick={viewsActions.toggleAccountMenuState}>
                    {
                        this.props.currentUserStore.information.photo ? (
                            <img src={this.props.currentUserStore.information.photo} />
                        ) : (
                            <Icon name="user-profile" iconClass="icon--inline" width="40px" height="40px" />
                        )
                    }
                    {
                        this.props.viewsStore.hasInternetConnection ? (
                            <i className={`AccountMenu__avatar__status AccountMenu__avatar__status--${this.props.currentUserStore.registerState}`} />
                        ) : (
                            <i className={`AccountMenu__avatar__status AccountMenu__avatar__status--OFFLINE`} />
                        )
                    }
                </div>
                <Modal
                    isOpen={this.props.viewsStore.accountMenuState === 'opened'}
                    shouldCloseOnOverlayClick={true}
                    overlayClassName="AccountMenu__overlay"
                    className="AccountMenu__modal AccountMenu__container"
                    contentLabel="Menu de Usuário"
                    onRequestClose={viewsActions.toggleAccountMenuState}
                >
                    {accountHomePanel}
                    {accountChangePasswordPanel}
                    {accountPasswordResponsePanel}
                </Modal>
            </section>
        );
    }
}

export default AccountMenu;
