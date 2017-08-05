import React from 'react';
import Response from '../Response';
import Icon from '../Icon';
import Button from '../Button';
import ModalDefault from '../ModalDefault';
import {Card} from '../Card';


class OfflineModal extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            counter: 5
        };
        this.interval = null;
        this.timeout = null;
    }

    componentDidUpdate () {
        if (!this.props.viewsStore.hasInternetConnection && !this.interval && !this.timeout) {
            this.interval = setInterval(this._checkConnection.bind(this), 1000);
        }
    }

    _checkConnection () {
        if (this.state.counter === 0) {
            if (this.props.viewsStore.hasInternetConnection) {
                this.props.viewsActions.closeOfflineModal();
                this.props.currentUserActions.turnOnSip(this.props.currentUserStore.information.account.id);
                clearInterval(this.interval);
                this.interval = null;
            } else {
                this.setState({
                    counter: 5
                });
            }
        } else {
            this._checkSipConnection();
            this.setState({
                counter: this.state.counter - 1
            });
        }
    }

    _checkSipConnection () {
        if (this.props.currentUserStore.registerState === 'REGISTERED' && !this.props.viewsStore.hasInternetConnection) {
            this.props.currentUserActions.turnOffSip();
        }
    }

    _checkConnectionNow () {
        if (this.timeout) {
            return;
        }

        clearInterval(this.interval);
        this.interval = null;
        this.setState({
            counter: 0
        });

        this.timeout = setTimeout(() => {
            if (this.props.viewsStore.hasInternetConnection) {
                this.props.viewsActions.closeOfflineModal();
                this.props.currentUserActions.turnOnSip(this.props.currentUserStore.information.account.id);
            } else {
                this.setState({
                    counter: 5
                });
                this.interval = setInterval(this._checkConnection.bind(this), 1000);
                this.timeout = null;
            }
        }, 1000);
    }

    render () {
        const errorIcon = (
            <Icon name="offline" iconClass="icon--circle icon--white icon--red" padding="35px 0 40px 0" width="53.5px" height="40px"/>
        );

        return (
            <ModalDefault
                isOpen={this.props.viewsStore.offlineModalState === 'opened'}
                shouldCloseOnOverlayClick={true}
                className="OfflineModal"
                contentLabel="OfflineModal"
            >
                <Card>
                    <Response
                        size="big"
                        title="Conexão perdida"
                        failed={true}
                        icon={errorIcon}
                        message={this.state.counter === 0 ? 'Conectando...' : `Tentando conectar em ${this.state.counter} segundos`}
                    >
                        <Button
                            full={true}
                            color="gray"
                            size="medium"
                            handleOnClick={this._checkConnectionNow.bind(this)}
                        >
                            RECONECTAR AGORA
                        </Button>
                    </Response>
                </Card>
            </ModalDefault>
        );
    }
}

OfflineModal.PropTypes = {
    className: React.PropTypes.string
};

export default OfflineModal;
