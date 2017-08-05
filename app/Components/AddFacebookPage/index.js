import React from 'react';
import {
    ModalDefault,
    Animated,
    Card,
    Form,
    Loader,
    Button,
    InputText,
    SimpleList,
    Avatar,
    Icon
} from 'app/screens/Components';

class AddFacebookPage extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            showSuggestionPage: false,
            showSuggestionDepto: false
        };
    }

    login (e) {
        e.preventDefault();
    }

    render () {
        const pageConnected = (
            <Card helpers="AddFacebookPage__container__card" contentPadded={true} title="Conectar Messenger">
                <Form>
                    <div className="AddFacebookPage__container__card__header">
                        <h4>Associar página ao departamento</h4>
                        <p>Selecione uma página e qual departamento irá receber as mensagens dessa página.</p>
                    </div>
                    <div className="AddFacebookPage__container__card__content">
                        {
                            this.props.pagesContainer.length === 0 ? (
                                <Loader
                                    color="black"
                                />
                            ) : (
                                <div>
                                    <InputText
                                        ref={(c) => this.page = c}
                                        type="select"
                                        placeholder="Página do Facebook"
                                        avatarSubcontent={true}
                                        subcontent={
                                            <Avatar src={this.props.data.page.photo} forcedCircle={true} size="small" noBorder={true}/>
                                        }
                                        name="page"
                                        className="input--rounded input--select input--border-gray input--initial-color text--wrap"
                                        animation="input-animated"
                                        disabled={true}
                                        sugestionOpen={this.state.showSuggestionPage}
                                        sugestion={
                                            <SimpleList
                                                paddingLeft="10px"
                                                container={this.props.pagesContainer}
                                                maxHeight="170px"
                                                onClick={this.props.pageChanged}
                                            />
                                        }
                                        sugestionClass="input__select"
                                        sugestionDirection="down"
                                        value={this.props.data.page.name}
                                        hasLabel={true}
                                        validations={[]}
                                        onClick={() => this.setState({showSuggestionPage: !this.state.showSuggestionPage})}
                                        onCloseSugestion={() => this.setState({showSuggestionPage: false})}
                                    />
                                    <InputText
                                        ref={(c) => this.depto = c}
                                        type="select"
                                        placeholder="Departamento"
                                        name="depto"
                                        className="input--rounded input--border-gray input--initial-color"
                                        animation="input-animated"
                                        disabled={true}
                                        sugestionOpen={this.state.showSuggestionDepto}
                                        sugestion={
                                            <SimpleList
                                                paddingLeft="10px"
                                                container={this.props.deptosContainer}
                                                maxHeight="120px"
                                                onClick={this.props.deptoChanged}
                                            />
                                        }
                                        sugestionClass="input__select"
                                        sugestionDirection="down"
                                        value={this.props.data.department.name}
                                        hasLabel={true}
                                        validations={[]}
                                        onClick={() => this.setState({showSuggestionDepto: !this.state.showSuggestionDepto})}
                                        onCloseSugestion={() => this.setState({showSuggestionDepto: false})}
                                    />
                                </div>
                            )
                        }
                    </div>
                    <div className="AddFacebookPage__container__card__footer">
                        <Button
                            size="small"
                            color="green-secondary"
                            className="btn--large"
                            full={true}
                            handleOnClick={this.props.onSave}
                        >
                            {this.props.saveText}
                        </Button>
                    </div>
                </Form>
            </Card>
        );

        return (
            <div className={`AddFacebookPage ${this.props.className}`}>
                <ModalDefault
                    isOpen={this.props.isOpen}
                    onRequestClose={this.props.onClose}
                    shouldCloseOnOverlayClick={true}
                    className="AddFacebookPage__modal"
                    parentSelector={this.props.modalParentSelector}
                    cardContent={true}
                    isCentralized={true}
                >
                    <Animated
                        className="full--height"
                        transition={true}
                        secondariesPanel={[pageConnected]}
                        activePanelIndex={this.props.activePanel === 0 ? null : 0}
                    >
                        <Card helpers="AddFacebookPage__container__card" contentPadded={true} title="Conectar Facebook Messenger">
                            <Form ref={(c) => this.facebookForm = c} onSubmit={this.login}>
                                <div className="AddFacebookPage__container__card__header">
                                    <h4>Conectar conta</h4>
                                    <p>Conecte a sua conta do Facebook para receber as mensagens na plataforma Omnize.</p>
                                </div>
                                <div className="AddFacebookPage__container__card__content">
                                    <Icon name="facebook-login" width="208px" />
                                </div>
                                <div className="AddFacebookPage__container__card__footer">
                                    <Button
                                        size="small"
                                        color="green-secondary"
                                        className="btn--large"
                                        disable={this.props.status === 'LOGGING IN'}
                                        full={true}
                                        handleOnClick={this.props.loginFacebook}
                                    >
                                        {this.props.status === 'LOGGING IN' ? 'Logando' : this.props.loginText}
                                    </Button>
                                </div>
                            </Form>
                        </Card>
                    </Animated>
                </ModalDefault>
            </div>
        );
    }
}

AddFacebookPage.PropTypes = {
    className: React.PropTypes.string,
    isOpen: React.PropTypes.bool.isRequired,
    onClose: React.PropTypes.func.isRequired,
    onSave: React.PropTypes.func.isRequired,
    data: React.PropTypes.object,
    activePanel: React.PropTypes.number,
    nextPanel: React.PropTypes.func,
    status: React.PropTypes.string,
    modalParentSelector: React.PropTypes.func,
    loginFacebook: React.PropTypes.func,
    pages: React.PropTypes.array,
    deptos: React.PropTypes.array,
    pagesContainer: React.PropTypes.array,
    deptosContainer: React.PropTypes.array,
    pageChanged: React.PropTypes.func.isRequired,
    deptoChanged: React.PropTypes.func.isRequired
};

AddFacebookPage.defaultProps = {
    className: '',
    saveText: 'Salvar',
    loginText: 'Login no Facebook'
};

export default AddFacebookPage;
