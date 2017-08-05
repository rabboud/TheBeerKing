import React from 'react';
import _ from 'lodash';
import {
    ModalDefault,
    Card,
    Form,
    InputText,
    Button,
    InputCheckbox,
    Animated,
    Avatar,
    Icon
} from 'app/screens/Components';

class AddEditDepartment extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            activePanel: null,
            selectedAllChannels: false
        };

        this.close = this.close.bind(this);
        this.changeToUser = this.changeToUser.bind(this);
        this.handleSelectAllChannels = this.handleSelectAllChannels.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    componentDidUpdate () {
        this._checkAllSelectedsChannel();
    }

    close () {
        this.setState({
            activePanel: null
        });
        this.props.onClose();
    }

    changeToUser (e) {
        e.preventDefault();
        this.setState({
            activePanel: 0
        });
    }

    _changeToDepartment () {
        this.setState({
            activePanel: null
        });
    }

    _checkAllSelectedsChannel () {
        if (this.props.channels.length === 0) {
            return;
        }

        const selecteds = _.filter(this.props.channels, (channel) => {
            return channel.selected;
        });

        if (selecteds.length === this.props.channels.length && !this.state.selectedAllChannels) {
            this.setState({
                selectedAllChannels: true
            });
        }

        if (selecteds.length !== this.props.channels.length && this.state.selectedAllChannels) {
            this.setState({
                selectedAllChannels: false
            });
        }
    }

    _deselectAllChannels () {
        _.map(this.props.channels, (channel, key) => {
            if (channel.selected) {
                this.props.onChannelChange(key);
            }
        });
    }

    _selectAllChannels () {
        _.map(this.props.channels, (channel, key) => {
            if (!channel.selected) {
                this.props.onChannelChange(key);
            }
        });
    }

    handleSelectAllChannels () {
        if (this.state.selectedAllChannels) {
            this._deselectAllChannels();
            this.setState({
                selectedAllChannels: false
            });
        } else {
            this._selectAllChannels();
            this.setState({
                selectedAllChannels: true
            });
        }
    }

    handleSave (e) {
        this.setState({
            activePanel: null
        });
        this.props.onSave(e);
    }

    render () {
        const cardTitle = (
            <label>
                <Icon name="back" iconClass="icon--clickable icon--inline" width="20px" height="12.9px" handleClick={this._changeToDepartment.bind(this)}/>
                <p className="title title--card title--inline title--margin-l-1 title--quaternary">
                    {this.props.title}
                </p>
            </label>
        );
        const userDepartment = (
            <Card helpers="AddEditDepartment__container__card" contentPadded={true} title={cardTitle}>
                <Form>
                    <div className="card__content__header second">
                        <div className="row collapse">
                            <h4>Usuários cadastrados</h4>
                        </div>
                    </div>
                    <div className="card__content__container second">
                    {
                        this.props.agents.selectAll ? (
                            <div className="row collapse depto-line">
                                <div className="options columns large-1">
                                    <InputCheckbox
                                        id="dept-all"
                                        name="Todos"
                                        checked={
                                            this.props.agents.selectedOptionsId.length > 0
                                            && (this.props.agents.selectedOptionsId.split(',').length
                                            === this.props.agents.options.length)
                                        }
                                        onChange={
                                            () => this.props.onUserChange(
                                                this.props.agents.id,
                                                -1,
                                                this.props.agents.selectedOptionsId.length > 0
                                                && (this.props.agents.selectedOptionsId.split(',').length
                                                === this.props.agents.options.length)
                                            )
                                        }
                                    />
                                </div>
                                <div className="options__text columns large-9 padding_space">
                                    <label htmlFor="dept-all">Todos</label>
                                </div>
                                <div className="options__text columns large-2 no-margin">
                                    <div className="columns__usercount">
                                        <label htmlFor="usercount">{this.props.agents.options.length}</label>
                                    </div>
                                </div>
                            </div>
                        ) : null
                    }
                    {
                        _.map(this.props.agents.options, (agent, key) => (
                            <div className="row collapse depto-line" key={key}>
                                <div className="options columns large-1">
                                    <InputCheckbox
                                        id={`${agent.id}`}
                                        name={agent.name}
                                        checked={agent.selected}
                                        onChange={
                                            () => this.props.onUserChange(
                                                this.props.agents.id,
                                                key,
                                                this.props.agents.selectedOptionsId.length > 0
                                                && (this.props.agents.selectedOptionsId.split(',').length
                                                === this.props.agents.options.length)
                                            )
                                        }
                                    />
                                </div>
                                <div className="options__text columns large-9 padding_space">
                                    <label htmlFor={`${agent.id}`}>{agent.name}</label>
                                </div>
                                <div className="options__text columns large-2 no-margin">
                                    <Avatar src={agent.photo} size="small" noBorder={true}/>
                                </div>
                            </div>
                        ))
                    }
                    </div>
                    <div className="card__content__footer second">
                        <Button size="small" color="green-secondary" className="btn--large" full={true} handleOnClick={this.handleSave}>
                            {this.props.saveText}
                        </Button>
                    </div>
                </Form>
            </Card>
        );

        return (
            <div className={`AddEditDepartment ${this.props.className}`}>
                <ModalDefault
                    isOpen={this.props.isOpen}
                    onRequestClose={this.close.bind(this)}
                    shouldCloseOnOverlayClick={true} className="AddEditDepartment__modal"
                    parentSelector={this.props.modalParentSelector}
                    cardContent={true}
                    isCentralized={true}
                >
                    <div className="AddEditDepartment__container">
                        <Animated
                            className="full--height"
                            transition={true}
                            secondariesPanel={[userDepartment]}
                            activePanelIndex={this.state.activePanel}
                        >
                            <Card helpers="AddEditDepartment__container__card" contentPadded={true} title={this.props.title}>
                                <Form ref={(c) => this.departmentForm = c} onSubmit={this.changeToUser}>
                                    <div className="card__content__header">
                                        <InputText
                                            ref={(c) => this.name = c}
                                            type="text"
                                            value={this.props.name}
                                            name="name"
                                            placeholder="Nome"
                                            className="input--rounded input--border-gray"
                                            animation="input-animated"
                                            hasLabel={true}
                                            validations={['required']}
                                            onChange={this.props.onNameChange}
                                        />
                                        <h4>Canais de atendimento</h4>
                                    </div>
                                    <div className="card__content__container">
                                        <div className="row collapse">
                                            <div className="options columns large-1">
                                                <InputCheckbox
                                                    id="selectAllChannels"
                                                    name="selectAllChannels"
                                                    checked={this.state.selectedAllChannels}
                                                    onChange={this.handleSelectAllChannels}
                                                />
                                            </div>
                                            <div className="options__text columns large-11 padding_space">
                                                <label
                                                    className="card__content__container__label"
                                                    htmlFor="selectAll"
                                                    data-checked={this.state.selectedAllChannels}
                                                >
                                                    {this.props.selectAllText}
                                                </label>
                                            </div>
                                        </div>
                                        {
                                            _.map(this.props.channels, (channel, key) => (
                                                <div className="row collapse" key={key}>
                                                    <div className="options columns large-1">
                                                        <InputCheckbox
                                                            id={`${channel.id}`}
                                                            name={channel.label}
                                                            checked={channel.selected}
                                                            onChange={() => this.props.onChannelChange(key)}
                                                        />
                                                    </div>
                                                    <div className="options__text columns large-11 padding_space">
                                                        <label
                                                            className="card__content__container__label"
                                                            data-checked={channel.selected}
                                                            htmlFor={`${channel.id}`}
                                                        >
                                                            {channel.label}
                                                        </label>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                        <div className="row collapse">
                                            <div className="options columns large-1">
                                                <InputCheckbox
                                                    id="facebookMessenger"
                                                    name="facebookMessenger"
                                                    checked={true}
                                                    disabled={true}
                                                />
                                            </div>
                                            <div className="options__text columns large-11 padding_space">
                                                <label
                                                    className="card__content__container__label"
                                                    htmlFor="facebookMessenger"
                                                    data-deactive="true"
                                                >
                                                    {this.props.facebookCheckText}
                                                </label>
                                            </div>
                                        </div>
                                        <div className="row collapse">
                                            <div className="options columns large-1">
                                                <InputCheckbox
                                                    id="telegram"
                                                    name="telegram"
                                                    checked={true}
                                                    disabled={true}
                                                />
                                            </div>
                                            <div className="options__text columns large-11 padding_space">
                                                <label
                                                    className="card__content__container__label"
                                                    htmlFor="telegram"
                                                    data-deactive="true"
                                                >
                                                    {this.props.telegramCheckText}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card__content__footer">
                                        <Button size="small" color="green-secondary" className="btn--large" full={true} validate={true}>
                                            {this.props.chooseUserText}
                                        </Button>
                                    </div>
                                </Form>
                            </Card>
                        </Animated>
                    </div>
                </ModalDefault>
            </div>
        );
    }
}

AddEditDepartment.propTypes = {
    className: React.PropTypes.string,
    isOpen: React.PropTypes.bool.isRequired,
    channels: React.PropTypes.array.isRequired,
    agents: React.PropTypes.object.isRequired,
    title: React.PropTypes.string,
    saveText: React.PropTypes.string,
    chooseUserText: React.PropTypes.string,
    selectAllText: React.PropTypes.string,
    facebookCheckText: React.PropTypes.string,
    telegramCheckText: React.PropTypes.string,
    name: React.PropTypes.string.isRequired,
    modalParentSelector: React.PropTypes.func,
    onClose: React.PropTypes.func.isRequired,
    onSave: React.PropTypes.func.isRequired,
    onNameChange: React.PropTypes.func.isRequired,
    onChannelChange: React.PropTypes.func.isRequired,
    onUserChange: React.PropTypes.func.isRequired
};

AddEditDepartment.defaultProps = {
    className: '',
    title: 'Departamento',
    chooseUserText: 'Escolher usuário',
    saveText: 'Salvar',
    selectAllText: 'Todos',
    facebookCheckText: 'Messenger (configurar em canais)',
    telegramCheckText: 'Telegram (configurar em canais)'
};

export default AddEditDepartment;
