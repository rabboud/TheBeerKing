import React from 'react';
import Modal from 'react-modal';
import {Avatar, Card, Response, Loader, Button, Timer, InputText} from 'app/screens/Components';
import {Form} from 'omz-react-validation/lib/build/validation.rc';
import _ from 'lodash';

class InteractionTransfer extends React.Component {
    constructor (props) {
        super(props);
    }

    handleRequestClose (cb) {
        if (this.props.status.flag === '' || this.props.status.flag === 'error') {
            cb();
        }
    }

    render () {
        const cardHeader = this.props.status.flag === 'success' ? false : (
            <label>
                <h3 className="title title--card">
                    {this.props.status.message}
                </h3>
            </label>
        );

        return (
            <Modal
                overlayClassName="InteractionTransfer"
                className="InteractionTransfer__container"
                isOpen={this.props.open === 'opened' ? true : false}
                contentLabel={''}
                onRequestClose={() => this.handleRequestClose(this.props.handleCloseModal)}
                parentSelector={this.props.parentSelector}
            >
                <Card
                    title={cardHeader}
                    helpers="card--full-size"
                    status={this.props.status.flag}
                    scrollable={true}
                >
                    {
                        this.props.status.flag === 'success' ? (
                            <section className="InteractionTransfer__content">
                                <Response className="columns rythm--margin-t-2" title="Transferido">
                                    Aguarde,
                                    <Timer seconds={5} callback={this.props.handleFinishInteraction} />
                                    segundos, estamos encerrando o atendimento.
                                    <Button className="rythm--margin-t-5" color="gray" size="big" full={true} handleOnClick={this.props.handleFinishInteraction}>Encerrar imediatamente</Button>
                                </Response>
                            </section>
                        ) : (
                            <section className="InteractionTransfer__content">
                                {
                                    this.props.status.flag !== 'waiting' ? (
                                        <div>
                                            <div className="InteractionTransfer__search">
                                                <Form className="InteractionTransfer__search__form" ref={(c) => {this.form = c;}}>
                                                    <InputText value={this.props.updateFilterValue} className="rythm--margin-b-2 input--rounded input--border-gray" placeholder="Buscar atendente" name="agentName" validations={[]} onChange={() => this.props.handleUpdateFilter(this.agentName)} animation="input-animated" hasLabel={true} ref={(c) => {this.agentName = c;}} />
                                                </Form>
                                            </div>
                                            <div className="InteractionTransfer__list__container">
                                                <ul className="InteractionTransfer__list">
                                                    {
                                                        _.map(this.props.departments, (department, departmentKey) => (
                                                            <li className="InteractionTransfer__list__item" data-selected={false} onClick={() => this.props.handleTransfer(event, 'department', department)} key={departmentKey}>
                                                                <div className="InteractionTransfer__list__item__label">
                                                                    <label>{department.name.length > 15 ? `${department.name.substring(0, 16)}...` : department.name}</label>
                                                                    <label className="text--quaternary text--blocked">{department.agents.length} {department.agents.length > 1 ? 'Atendentes' : 'Atendente'}</label>
                                                                </div>
                                                                <div className="InteractionTransfer__list__item__avatar">
                                                                    <ul className="Avatar__list">
                                                                        {
                                                                            _.map(department.agents, (agent, agentKey) => (
                                                                                <li className="Avatar__list__item" key={agentKey}>
                                                                                    <Avatar size="medium" noBorder={true} src={agent.photo} group={true} status={department.status} />
                                                                                </li>
                                                                            ))
                                                                        }
                                                                    </ul>
                                                                </div>
                                                            </li>
                                                        ))
                                                    }
                                                </ul>
                                                {
                                                    this.props.agents.length > 0 ? (
                                                        <ul className="InteractionTransfer__list">
                                                        {
                                                            _.map(this.props.agents, (agent, key) => {
                                                                if (this.props.currentUser.subscriber.username !== agent.username) {
                                                                    return (
                                                                        <li className="InteractionTransfer__list__item" onClick={() => this.props.handleTransfer(event, 'agent', agent)} key={key}>
                                                                            <div className="InteractionTransfer__list__item__label">
                                                                                <label>{agent.name.length > 15 ? `${agent.name.substring(0, 16)}..` : agent.name}</label>
                                                                                <label className="text--quaternary text--blocked">{agent.department.name}</label>
                                                                            </div>
                                                                            <div className="InteractionTransfer__list__item__avatar">
                                                                                <Avatar src={agent.photo} status={agent.status} />
                                                                            </div>
                                                                        </li>
                                                                    );
                                                                }
                                                            })
                                                        }
                                                        </ul>
                                                    ) : ''
                                                }
                                            </div>
                                        </div>
                                    ) : (
                                        <Loader color="black" className="rythm--margin-t-13" />
                                    )
                                }
                            </section>
                        )
                    }
                </Card>
            </Modal>
        );
    }
}

InteractionTransfer.PropTypes = {
    open: React.PropTypes.bool,
    status: React.PropTypes.object,
    agents: React.PropTypes.array,
    currentUser: React.PropTypes.object,
    departments: React.PropTypes.array,
    handleUpdateFilter: React.PropTypes.func,
    updateFilterValue: React.PropTypes.string,
    handleRetry: React.PropTypes.func,
    handleTransfer: React.PropTypes.func,
    handleCloseModal: React.PropTypes.func,
    handleFinishInteraction: React.PropTypes.func,
    parentSelector: React.PropTypes.func
};

export default InteractionTransfer;
