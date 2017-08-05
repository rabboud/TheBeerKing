import React from 'react';
import OMZModal from '../OMZModal';
import Response from '../Response';
import Icon from '../Icon';
import Button from '../Button';

const AttachamentModal = ({className, isOpen, parentSelector, handleCloseModal, error, showOwl}) => {
    const getMessages = () => {
        switch (error) {
            case 'SIZE':
                return 'Tamanho do arquivo, excede o limite de 15 MB.';
            case 'TIMEOUT':
                return 'Envio de arquivo está demorando. Tente novamente mais tarde ou entre em contato.';
            default:
                return 'Tente novamente mais tarde ou entre em contato.';
        }
    };

    return (
        <OMZModal
            isOpen={isOpen}
            shouldCloseOnOverlayClick={true}
            parentSelector={parentSelector}
            onRequestClose={handleCloseModal}
        >
            <Response
                title="Falha no envio de anexo"
                message={getMessages()}
                messageModifier="short"
                hasAction={true}
                actionName="OK"
                icon={
                    showOwl ? (
                        <Icon name="sadowl"/>
                    ) : (
                        <Icon
                            name="cloud-error"
                            width="54px"
                            height="40px"
                            padding="37.5px 30px"
                            bkgColor="red-primary"
                            bkgCircle={true}
                        />
                    )
                }
            >
                <Button className="rythm--margin-t-5" size="medium" full={true} handleOnClick={handleCloseModal}>OK</Button>
            </Response>
        </OMZModal>
    );
};

AttachamentModal.propTypes = {
    className: React.PropTypes.string,
    isOpen: React.PropTypes.bool.isRequired,
    showOwl: React.PropTypes.bool,
    handleCloseModal: React.PropTypes.func.isRequired
};

AttachamentModal.defaultProps = {
    className: '',
    showOwl: false
};

export default AttachamentModal;
