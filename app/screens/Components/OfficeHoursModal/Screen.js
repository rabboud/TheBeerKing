import React from 'react';
import {
    Icon,
    Button,
    Response,
    ModalDefault
} from 'app/screens/Components';

class OfficeHoursModal extends React.Component {
    constructor (props) {
        super(props);
    }

    _closeModal () {
        this.props.viewsActions.closeOfficeHoursModal();
    }

    _getParent () {
        return document.querySelector('.main-wrapper');
    }

    render () {
        const clock = (
            <Icon name="clock" iconClass="icon--circle icon--white icon--red" padding="28px 0 40px 0" width="60px" height="47px"/>
        );

        return (
            <ModalDefault
                isOpen={this.props.viewsStore.officeHoursModalState === 'opened'}
                onRequestClose={() => this.props.viewsActions.closeOfficeHoursModal()}
                shouldCloseOnOverlayClick={true} className="OfficeHoursModal"
                parentSelector={this._getParent.bind(this)}
                cardContent={true}
                isCentralized={true}
            >
                <Response
                    size="big"
                    title="Horário de atendimento"
                    failed={true}
                    icon={clock}
                    message={'Sua empresa está fora do horário de atendimento.'}
                >
                    <Button
                        full={true}
                        color="gray"
                        size="medium"
                        handleOnClick={this._closeModal.bind(this)}
                    >
                        OK, OBRIGADO
                    </Button>
                </Response>
            </ModalDefault>
        );
    }
}

OfficeHoursModal.PropTypes = {
    className: React.PropTypes.string
};

export default OfficeHoursModal;
