import React from 'react';
import Modal from 'react-modal';
import Response from '../Response';
import Button from '../Button';
import Icon from '../Icon';

class WelcomeMessage extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            isClosed: localStorage.getItem('sawWelcomeMessage') !== null || this.props.currentUser.account.id === 0 ? true : false
        };
    }

    componentDidUpdate () {
        if (localStorage.getItem('sawWelcomeMessage') === null && this.props.currentUser.account.id !== 0) {
            if (this.state.isClosed) {
                this._openWelcomeModal();
            }
        }
    }

    _openWelcomeModal () {
        this.setState({
            isClosed: false
        });
    }

    _closeWelcomeModal () {
        this.setState({
            isClosed: true
        });

        localStorage.setItem('sawWelcomeMessage', true);
    }

    render () {
        return (
            <Modal
                isOpen={!this.state.isClosed}
                onRequestClose={this._closeWelcomeModal.bind(this)}
                shouldCloseOnOverlayClick={true}
                overlayClassName="WelcomeMessage"
                className="WelcomeMessage__content"
                contentLabel="WelcomeMessage Modal"
                parentSelector={this.props.parentSelector}
            >
                <Response
                    title={
                        this.props.currentUser.licenseCode === 'PARTNER'
                            ? 'Bem vindo à plataforma de atendimento'
                            : 'Bem vindo à nova plataforma Omnize'
                    }
                    message={
                        this.props.currentUser.licenseCode !== 'PARTNER'
                        ? 'Mais funcionalidades e uma usabilidade muito melhor.'
                        : null
                    }
                    messageModifier="short"
                    hasAction={true}
                    actionName="COMEÇAR A USAR"
                    link={
                        this.props.currentUser.licenseCode !== 'PARTNER'
                        ? 'Entenda o que mudou'
                        : null
                    }
                    linkAddress={
                        this.props.currentUser.licenseCode !== 'PARTNER'
                        ? 'https://www.omnize.com.br/ajuda/nova-versao-omnize-atendimento'
                        : null
                    }
                    icon={
                        this.props.currentUser.licenseCode === 'PARTNER' ? (
                            <Icon
                                name="bell"
                                width="46px"
                                height="50px"
                                padding="32.5px 34px"
                                bkgColor="yellow-primary"
                                bkgCircle={true}
                            />
                        ) : (
                            <Icon name="hellowl"/>
                        )
                    }
                >
                    <Button className="rythm--margin-t-5" size="medium" full={true} handleOnClick={this._closeWelcomeModal.bind(this)}>COMEÇAR A USAR</Button>
                </Response>
            </Modal>
        );
    }
}

WelcomeMessage.PropTypes = {
    className: React.PropTypes.string,
    currentUser: React.PropTypes.object,
    parentSelector: React.PropTypes.func
};

export default WelcomeMessage;
