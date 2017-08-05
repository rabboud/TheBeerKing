import React from 'react';
import {InputText, Button, Card, Icon, InfoLabel, Loader} from 'app/screens/Components';
import {currentUserActions} from 'app/flux/Actions';
import {Form} from 'omz-react-validation/lib/build/validation.rc';

class View extends React.Component {
    constructor (props) {
        super(props);
        this.handleSubmitLogin = this.handleSubmitLogin.bind(this);
    }

    handleSubmitLogin (event) {
        event.preventDefault();
        currentUserActions.signIn(this.email.state.value, this.password.state.value);
    }

    removeFormError (field) {
        this.form.hideError(field);
    }

    render () {
        return (
            <section className="login full--screen">
                    <div className="rythm--center large-10 columns large-centered">
                        <Card helpers="centralize small-6 large-5 small-centered large-centered columns rythm--49">
                            <Icon
                                iconClass="rythm--margin-t-7"
                                name="logo"
                                width="200px"
                            />
                            {this.props.currentUserStore.loginState.status === 'WAITING' ? (
                                <div className="columns rythm--margin-t-6 rythm--margin-b-5 large-9 small-9 large-centered small-centered">
                                    <Loader color="black" />
                                </div>
                            ) : (
                                <Form
                                    className="columns rythm--margin-t-4 rythm--margin-b-5 large-9 small-9 large-centered small-centered"
                                    ref={(c) => {this.form = c;}}
                                >
                                    <InfoLabel
                                        className="rythm--margin-b-2"
                                        kind="error"
                                        content={this.props.currentUserStore.loginState.message}
                                    />
                                    <InputText
                                        name="email"
                                        placeholder="E-mail"
                                        value=""
                                        className="rythm--margin-b-2 input--rounded input--border-gray"
                                        animation="input-animated"
                                        hasLabel={true}
                                        ref={(c) => {this.email = c;}}
                                        onFocus={() => {this.removeFormError('email');}}
                                        validations={['required', 'email']}
                                    />
                                    <InputText
                                        type="password"
                                        name="password"
                                        placeholder="Senha"
                                        value=""
                                        className="rythm--margin-b-2 input--rounded input--border-gray"
                                        animation="input-animated"
                                        hasLabel={true}
                                        ref={(c) => {this.password = c;}}
                                        onFocus={() => {this.removeFormError('password');}}
                                        validations={['required']}
                                    />
                                    <Button
                                        className="btn--tall-40"
                                        color="red"
                                        full={true}
                                        validate={true}
                                        size="big"
                                        handleOnClick={this.handleSubmitLogin}
                                    >
                                        Entrar
                                    </Button>
                                    <div className="rythm--margin-t-3 rythm--margin-b-7">
                                        <a
                                            href="https://login.omnize.com.br/omz/public/newpasswd/sendnewpasswd.html"
                                            target="_blank"
                                        >
                                            <span className="text--tertiary">Esqueci minha senha</span>
                                        </a>
                                    </div>
                                </Form>
                            )}
                        </Card>
                    </div>
            </section>
        );
    }
}

export default View;
