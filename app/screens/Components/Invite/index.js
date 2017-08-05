import React from 'react';
import Modal from 'react-modal';
import _ from 'lodash';
import {Button, Combo, Textarea, Card, StateMessage} from 'app/screens/Components';

const maxChars = 140;

class Component extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        const departments = _.filter(this.props.invite.departments, (department) => !department.informative);
        const departmentsCombo = _.map(departments, (department) => {
            return {name: department.name, value: department.name, id: department.id};
        });

        return (
            <Modal
                isOpen={this.props.isOpen}
                contentLabel="Visitantes online"
                overlayClassName="invite"
                className="invite__content"
                shouldCloseOnOverlayClick={true}
                parentSelector={this.props.parentSelector}
                onRequestClose={this.props.handleClose}
            >
                <Card
                    title="Convite"
                >
                    <div className="invite__container">
                        {
                            this.props.invite.state === '' ? (
                                <form className="invite__form">
                                    <Combo className="rythm--margin-t-1" label="Departamento" animation="input-animated" options={departmentsCombo} handleOnChange={this.props.handleDepartmentChange} ref={(c) => this.department = c} value={this.props.invite.department ? this.props.invite.department.value : ''}/>
                                    <Textarea className="rythm--margin-t-1" value={this.props.invite.message} handleOnChange={this.props.handleMessageChange} maxLength={maxChars} size="big" resize="false" ref={(c) => this.message = c}/>
                                    {
                                        this.props.user.registerState === 'REGISTERED' ? (
                                            <Button className="rythm--margin-t-1" color="green" size="medium" full={true} handleOnClick={this.props.handleInvite}>Convidar</Button>
                                        ) : (
                                            <p className="rythm--margin-t-1 text--quaternary">Para poder convidar, fique online</p>
                                        )
                                    }
                                </form>
                            ) : (
                                <StateMessage
                                    messageState={this.props.invite.state}
                                    hasLoader={true}
                                    loaderColor="black"
                                    icon="viewers"
                                    size="medium"
                                    context={this.props.invite.send ? 'Convite' : 'Busca de dados do convite'}
                                    autoRetry={false}
                                />
                            )
                        }
                    </div>
                </Card>
            </Modal>
        );
    }
}

Component.propTypes = {
    isOpen: React.PropTypes.bool,
    invite: React.PropTypes.object,
    user: React.PropTypes.object,
    handleDepartmentChange: React.PropTypes.func,
    handleMessageChange: React.PropTypes.func,
    handleInvite: React.PropTypes.func,
    handleClose: React.PropTypes.func,
    parentSelector: React.PropTypes.func
};

export default Component;
