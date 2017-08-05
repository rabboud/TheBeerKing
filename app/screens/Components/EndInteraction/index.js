import React from 'react';
import Modal from 'react-modal';
import Icon from '../Icon';
import Response from '../Response';
import Button from '../Button';


class EndInteraction extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <Modal
                isOpen={this.props.data.open}
                onAfterOpen={this.props.willOpen}
                onRequestClose={this.props.onClose}
                shouldCloseOnOverlayClick={this.props.data.type === 'message-sent' ? false : true}
                overlayClassName="end-interaction"
                className="end-interaction__content"
                contentLabel="Example Modal"
                parentSelector={this.props.parentSelector}
            >
                {
                    this.props.data.type === 'message-sent' ? (
                        <Response
                            title="Mensagem enviada"
                            hasAction={true}
                            actionName="Encerrar imediatamente"
                        >
                            <Button className="rythm--margin-t-5" size="medium" color="gray" full={true} handleOnClick={this.props.handleClose}>Encerrar imediatamente</Button>
                        </Response>
                    ) : (
                        <div>
                            <h3 className="end-interaction__content__title">Encerrar o atendimento?</h3>
                            <p className="end-interaction__content__text">Desconecte o cliente para continuar editando ou conclua o atendimento.</p>
                            <div className="end-interaction__content__actions">
                                {
                                    this.props.postponed ? (
                                        <div className="end-interaction__content__actions__finish" onClick={this.props.handlePostponed}>
                                            <div className="end-interaction__content__actions__finish__content">
                                                <div className="end-interaction__content__actions__finish__content__container">
                                                    <Icon name="send-inbox" iconClass="icon--circle icon--blue-secondary" padding="13px 11px 14px 12px" width="22px" height="18px"/>
                                                </div>
                                                <span className="end-interaction__content__actions__finish__content__label">Pendente</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="end-interaction__content__actions__finish" onClick={this.props.handleEnd}>
                                            <div className="end-interaction__content__actions__finish__content">
                                                <div className="end-interaction__content__actions__finish__content__container">
                                                    <Icon name="pencil" iconClass="icon--circle icon--blue-secondary" padding="15px" width="16px" height="16.3px"/>
                                                </div>
                                                <span className="end-interaction__content__actions__finish__content__label">Finalizar/Editar</span>
                                            </div>
                                        </div>
                                    )
                                }
                                <div className="end-interaction__content__actions__end">
                                    <div className="end-interaction__content__actions__end__content" onClick={this.props.handleFinish}>
                                        <div className="end-interaction__content__actions__end__content__container">
                                            <Icon name="out" iconClass="icon--circle icon--bkg-green" padding="12.5px 15px" width="23.4px" height="20px"/>
                                        </div>
                                        <span className="end-interaction__content__actions__end__content__label">Finalizar</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </Modal>
        );
    }
}

EndInteraction.propTypes = {
    data: React.PropTypes.object,
    willOpen: React.PropTypes.func,
    onClose: React.PropTypes.func,
    clickOverlay: React.PropTypes.func,
    pressedEsc: React.PropTypes.func,
    handleFinish: React.PropTypes.func,
    handleEnd: React.PropTypes.func,
    postponed: React.PropTypes.bool,
    handlePostponed: React.PropTypes.func,
    parentSelector: React.PropTypes.func,
    handleClose: React.PropTypes.func
};

export default EndInteraction;
