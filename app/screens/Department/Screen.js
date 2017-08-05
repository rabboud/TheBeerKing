import React from 'react';
import _ from 'lodash';
import {
    Card,
    OMZTable,
    Form,
    Button,
    Avatar,
    Icon,
    Switcher,
    InputText,
    ModalFilter,
    AddEditDepartment,
    Notification,
    Tooltip
} from 'app/screens/Components';

class View extends React.Component {
    constructor (props) {
        super(props);

        this.fetchAll = this.fetchAll.bind(this);
        this.getParent = this.getParent.bind(this);
        this.addDepartment = this.addDepartment.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentWillUnmount () {
        this.props.departmentActions.resetAll();
        this.props.filterActions.clearAllSelecteds();
        this.props.tableActions.clearAllOrder();
    }

    getParent () {
        return document.querySelector('.department');
    }

    fetchAll (reset = false) {
        const header = this.props.tableStore.department.selectedHeader;

        if (!(this.props.departmentStore.status === 'ENDED' && !reset || this.props.departmentStore.status === 'LOADING')) {
            const params = {
                reset: reset,
                accountId: this.props.currentUserStore.information.account.id,
                page: reset ? 0 : this.props.departmentStore.page,
                headerId: header ? header.id : '',
                orderDirection: header ? header.direction : '',
                search: this.props.departmentStore.search,
                state: this.props.filterStore.state.selectedOptionsId
            };

            this.props.departmentActions.fetchAll(params);
        }
    }

    _selectAgents (agents) {
        _.map(this.props.filterStore.agents.options, (option, key) => {
            _.map(agents, (agent) => {
                if (option.id === agent.id) {
                    this.props.filterActions.updateFilter('agents', key, false);
                }
            });
        });
    }

    _selectChannels (channels) {
        _.map(this.props.channelStore.channels, (channel, key) => {
            _.map(channels, (departmentChannel) => {
                if (channel.id === departmentChannel.id) {
                    if (!channel.selected) {
                        this.props.channelActions.toggleSelection(key);
                    }
                }
            });
        });
    }

    editDepartment (department) {
        this._selectAgents(department.agents);
        this._selectChannels(department.channels);
        this.props.departmentActions.changeCurrent(department);
        this.props.viewsActions.toggleModalState('showAddEdit', 'departmentView');
    }

    handleNameChange () {
        const name = this.AddEditDepartment.name.state.value;

        this.props.departmentActions.changeCurrentName(name);
    }

    addDepartment () {
        this.props.departmentActions.changeCurrent();
        this.props.viewsActions.toggleModalState('showAddEdit', 'departmentView');
    }

    _saveDepartment (e) {
        e.preventDefault();
        this.props.departmentActions.save(
            this.props.currentUserStore.information.account.id,
            this.props.departmentStore.currentDepartment,
            this.props.channelStore.channels,
            this.props.filterStore.agents.options,
            () => this.fetchAll(true)
        );
        this.props.channelActions.clearSelection();
        this.props.filterActions.clearAllSelecteds('agents');
        this.props.viewsActions.toggleModalState('showAddEdit', 'departmentView');
    }

    handleClose () {
        this.props.channelActions.clearSelection();
        this.props.filterActions.clearAllSelecteds('agents');
        this.props.viewsActions.toggleModalState('showAddEdit', 'departmentView');
    }

    render () {
        const tableData = {
            headers: this.props.tableStore.department.headers
        };

        const getIcon = (channelType) => {
            switch (channelType) {
                case 'VIDEO':
                    return {
                        name: 'video',
                        width: '20px',
                        color: 'gray-primary'
                    };
                case 'VOICE':
                    return {
                        name: 'voice',
                        width: '13px',
                        color: 'gray-primary'
                    };
                case 'FACEBOOK':
                    return {
                        name: 'messenger',
                        width: '20px'
                    };
                case 'TELEGRAM':
                    return {
                        name: 'telegram',
                        width: '20px'
                    };
                default:
                    return {
                        name: 'balloon',
                        width: '20px',
                        color: 'gray-primary'
                    };
            }
        };
        const getAvatars = (agent, agentKey, agents) => {
            if (agentKey === 6) {
                return (
                    <Tooltip
                        key={agentKey}
                        className="gama"
                        active={true}
                        header={(
                            <Avatar
                                key={agentKey}
                                count={agents.length - 6}
                            />
                        )}
                    >
                        {
                            _.map(agents.slice(6, agents.length), (subAgent, key) => (
                                <Avatar
                                    key={key}
                                    src={subAgent.photo}
                                    name={subAgent.name}
                                    size="small"
                                    noBorder={true}
                                />
                            ))
                        }
                    </Tooltip>
                );
            }

            if (agentKey < 6) {
                return (
                    <Tooltip
                        key={agentKey}
                        className="gama"
                        header={(
                            <Avatar
                                key={agentKey}
                                src={agent.photo ? agent.photo : ''}
                                size="small"
                                noBorder={true}
                            />
                        )}
                    >
                        <p className="text--quinquennary">{agent.name}</p>
                    </Tooltip>
                );
            }
        };

        tableData.items = _.map(this.props.departmentStore.departments, (departmentItem, index) => {
            const row = {
                selected: departmentItem.selected,
                fields: [
                    {
                        id: 'name',
                        type: 'data',
                        content: (
                            <span className="OMZTable__content__container__row__data__text">
                                {departmentItem.name}
                            </span>
                        )
                    },
                    {
                        id: 'channels',
                        type: 'data',
                        content: _.map(departmentItem.channels, (channel, channelKey) => {
                            const icon = getIcon(channel.name);

                            return (
                                <Icon
                                    name={icon.name}
                                    width={icon.width}
                                    key={channelKey}
                                    iconClass="icon--vMiddle"
                                    iconColor={departmentItem.state === 'INACTIVE'
                                        ? 'gray-secondary'
                                        : icon.color
                                    }
                                    padding="0 7.5px"
                                    inline={true}
                                />
                            );
                        })
                    },
                    {
                        id: 'agents',
                        type: 'data',
                        content: _.map(departmentItem.agents, (agent, agentKey) => (
                            getAvatars(agent, agentKey, departmentItem.agents)
                        ))
                    },
                    {
                        id: 'state',
                        type: 'data',
                        content: (
                            <Switcher
                                on={departmentItem.state === 'ACTIVE'}
                                onClick={() => {
                                    this.props.departmentActions.toggleState(
                                        departmentItem,
                                        index,
                                        this.props.currentUserStore.information.id
                                    );
                                }}
                            />
                        )
                    },
                    {
                        id: 'action',
                        type: 'action',
                        actions: [
                            <Icon
                                name="pencil"
                                width="14px"
                                height="15px"
                                padding="9px 10.5px"
                                iconColor="blue"
                                bkgColor="white"
                                bkgCircle={true}
                                bkgBorder="gray-octonary"
                                inline={true}
                                clickable={true}
                                handleClick={() => this.editDepartment(departmentItem)}
                            />
                        ]
                    }
                ]
            };

            return row;
        });

        return (
            <section className="department">
                <div className="department__container">
                    <Card
                        helpers="card--full-height card--header-padding"
                        contentPadded={true}
                        title="Departamentos"
                    >
                        <div className="row">
                            <div className="large-5 columns rythm--margin-b-2">
                                <Form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        this.fetchAll(true);
                                    }}
                                >
                                    <InputText
                                        ref={(c) => {this.searchField = c;}}
                                        type="text"
                                        search={true}
                                        name="search"
                                        value=""
                                        placeholder="Busca"
                                        className="input--rounded input--border-gray"
                                        animation="input-animated"
                                        hasLabel={true}
                                        validations={[]}
                                        onChange={() =>
                                            this.props.departmentActions.changeSearch(
                                                this.searchField.state.value
                                            )
                                        }
                                    />
                                </Form>
                            </div>
                            <div className="large-3 columns text-right rythm--margin-b-2">
                                {
                                    this.props.viewsStore.accountFree ? '' : (
                                        <Button
                                            className="vTop alpha-10"
                                            size="big"
                                            color="green"
                                            handleOnClick={this.addDepartment}
                                        >
                                            <Icon
                                                name="x-small"
                                                width="14px"
                                                padding="0 2px"
                                                rotate="45"
                                                inline={true}
                                            />
                                        </Button>
                                    )
                                }

                                <Notification
                                    show={
                                        this.props.filterStore.state.selectedOptionsId
                                         && !this.props.viewsStore.modal.departmentView.showFilter
                                            ? true
                                            : false
                                    }
                                    notificationIcon={
                                        <Icon name="check" iconColor="white" width="10px"/>
                                    }
                                >
                                    <Button
                                        className="vTop alpha-10"
                                        size="big"
                                        handleOnClick={() => {
                                            this.props.viewsActions.toggleModalState('showFilter', 'departmentView');
                                        }}
                                        color={
                                            this.props.filterStore.state.selectedOptionsId
                                            && !this.props.viewsStore.modal.departmentView.showFilter
                                                ? 'white'
                                                : 'blue'
                                        }
                                    >
                                        <Icon
                                            name="filter-options"
                                            iconColor={
                                                this.props.filterStore.state.selectedOptionsId
                                                && !this.props.viewsStore.modal.departmentView.showFilter
                                                    ? 'blue'
                                                    : 'white'
                                            }
                                            width="23px"
                                            inline={true}
                                        />
                                    </Button>
                                </Notification>
                            </div>
                        </div>
                        <AddEditDepartment
                            ref={(c) => this.AddEditDepartment = c}
                            isOpen={this.props.viewsStore.modal.departmentView.showAddEdit}
                            title="Departamento"
                            name={this.props.departmentStore.currentDepartment.name}
                            channels={this.props.channelStore.channels}
                            agents={this.props.filterStore.agents}
                            onUserChange={(filterId, optionIndex, all) => this.props.filterActions.updateFilter(filterId, optionIndex, all)}
                            onChannelChange={(channelIndex) => this.props.channelActions.toggleSelection(channelIndex)}
                            onNameChange={this.handleNameChange.bind(this)}
                            onClose={this.handleClose}
                            onSave={this._saveDepartment.bind(this)}
                            modalParentSelector={this.getParent.bind(this)}
                        />
                        <OMZTable
                            selectable={false}
                            data={tableData}
                            loadingData={this.props.departmentStore.status === 'LOADING'}
                            hasActions={true}
                            onHeaderClick={(id) => {
                                this.props.tableActions.changeTableOrder('department', id);
                                this.fetchAll(true);
                            }}
                            onTableBottom={this.fetchAll}
                        />
                        <ModalFilter
                            isOpen={this.props.viewsStore.modal.departmentView.showFilter}
                            modalParentSelector={this.getParent}
                            filters={[
                                this.props.filterStore.state
                            ]}
                            handleOnChange={(filterId, optionIndex, all) => {
                                this.props.filterActions.updateFilter(filterId, optionIndex, all);
                            }}
                            handleFilterClick={() => {
                                this.props.viewsActions.toggleModalState('showFilter', 'departmentView');
                                this.fetchAll(true);
                            }}
                            onCloseModal={() => {
                                this.props.viewsActions.toggleModalState('showFilter', 'departmentView');
                            }}
                            onClearFilter={() => {
                                this.props.filterActions.clearAllSelecteds();
                                this.props.viewsActions.toggleModalState('showFilter', 'departmentView');
                                this.fetchAll(true);
                            }}
                        />
                    </Card>
                </div>
            </section>
        );
    }
}

export default View;
