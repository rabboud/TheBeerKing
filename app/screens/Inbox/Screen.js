import React from 'react';
import _ from 'lodash';
import {ENV} from 'app/services';
import {browserHistory} from 'react-router';
import {
    Avatar,
    Button,
    Card,
    MessageReplyBox,
    Message,
    Icon,
    StateMessage,
    OMZHelmet,
    OMZTable,
    Form,
    InputText,
    Notification,
    Text,
    Status,
    PeriodModal,
    ModalFilter,
    FloatButton,
    ClientCard,
    Tooltip
} from 'app/screens/Components';
import {TimeHelper} from 'app/helpers';

class View extends React.Component {
    constructor (props) {
        super(props);

        this.inboxStartDate = '';
        this.inboxEndDate = '';
        this.historyStartDate = '';
        this.historyEndDate = '';

        this._getParent = this._getParent.bind(this);
        this.handleLoadInteraction = this.handleLoadInteraction.bind(this);
        this.handleReply = this.handleReply.bind(this);
        this._handleSearchInbox = this._handleSearchInbox.bind(this);
        this._handleSearchHistory = this._handleSearchHistory.bind(this);
        this._changePeriodFilter = this._changePeriodFilter.bind(this);
        this._applyFilter = this._applyFilter.bind(this);
        this.clearFilter = this.clearFilter.bind(this);
        this._handleRowClick = this._handleRowClick.bind(this);
        this.discardInteractionsSelected = this.discardInteractionsSelected.bind(this);
        this.loadMessages = this.loadMessages.bind(this);
    }

    componentWillUnmount () {
        this.props.interactionActions.resetInbox();
        this.props.interactionActions.resetHistory('search');
        this.props.filterActions.clearAllSelecteds();
        this.props.tableActions.clearAllOrder();
        this.props.viewsActions.changeInboxTab(0);
        this.props.viewsActions.hideInboxUser();
        this.props.viewsActions.hideInteractionMessages();
        this._setCurrentIndex(null);
        this.inboxStartDate = '';
        this.inboxEndDate = '';
        this.historyStartDate = '';
        this.historyEndDate = '';
    }

    _getParent () {
        return document.querySelector('.inbox');
    }

    _getInbox () {
        this.props.interactionActions.getInbox(
            this.props.currentUserStore.information.account.id,
            this.props.currentUserStore.information.id,
            this.props.currentUserStore.information.subscription
        );
    }

    _getAgentHistory (reset = false) {
        const header = this.props.tableStore.history.selectedHeader;
        const getFrom = () => {
            if (this.activeTab === 0) {
                return this.inboxStartDate ? this.inboxStartDate : '';
            }
            return this.historyStartDate ? this.historyStartDate : '';
        };
        const getTo = () => {
            if (this.activeTab === 0) {
                return this.inboxEndDate ? this.inboxEndDate : '';
            }
            return this.historyEndDate ? this.historyEndDate : '';
        };

        if (!(this.props.interactionStore.status === 'ENDED' && !reset || this.props.interactionStore.status === 'LOADING')) {
            const params = {
                reset: reset,
                accountId: this.props.currentUserStore.information.account.id,
                agentId: this.props.currentUserStore.information.id,
                page: reset ? 0 : this.props.interactionStore.historyPage,
                headerId: header ? header.id : '',
                orderDirection: header ? header.direction : '',
                search: this.props.interactionStore.historySearch,
                departments: this.props.filterStore.department.selectedOptionsId,
                types: this.props.filterStore.channel.selectedOptionsId,
                from: getFrom() ? getFrom().format('YYYY-MM-DD 00:00:00') : '',
                to: getTo() ? getTo().format('YYYY-MM-DD 23:59:59') : ''
            };

            this.props.interactionActions.fetchAgentHistory(params);
        }
    }

    handleLoadInteraction (event, id) {
        const medias = ['offcontact', 'email', 'meli_qst'];

        event.preventDefault();
        this.props.interactionActions.fetchInbox(id);

        if (!medias.includes(this.props.interactionStore.inbox[id].type)) {
            this.props.interactionActions.fetchInboxMessages(id);
        }
    }

    handleReply (event, id) {
        event.preventDefault();
        this.props.interactionActions.fetchInbox('');

        if (Object.keys(this.props.interactionStore.interactions).indexOf(id) > -1) {
            browserHistory.push(`/interaction?id=${id}`);
            return;
        }

        this.props.interactionActions.openInbox(id);
        this.props.viewsActions.hideInteractionMessages();
        browserHistory.push(`/interaction?id=${id}`);
    }

    _changeTab (key) {
        this.props.viewsActions.changeInboxTab(key);
        this._loadDataForTab(key);
        this._setCurrentIndex(null);
        this.props.viewsActions.hideInteractionMessages();
    }

    _loadDataForTab (key) {
        if (key === 0) {
            this._getInbox();
        }

        if (key === 1) {
            this._getAgentHistory();
        }
    }

    _handleSearchInbox (e) {
        e.preventDefault();
        this._getInbox();
    }

    _handleSearchHistory (e) {
        e.preventDefault();
        this._getAgentHistory(true);
    }

    _changePeriodFilter (startDate, endDate) {
        if (this.props.viewsStore.currentInboxTab === 0) {
            this.inboxStartDate = startDate && endDate ? startDate : '';
            this.inboxEndDate = startDate && endDate ? endDate : '';
        } else {
            this.historyStartDate = startDate && endDate ? startDate : '';
            this.historyEndDate = startDate && endDate ? endDate : '';
        }

        this._getAgentHistory(true);
        this.props.viewsActions.toggleModalState('showPeriod', 'inboxView');
    }

    _applyFilter () {
        this.props.viewsActions.toggleModalState('showFilter', 'inboxView');

        if (this.props.viewsStore.currentInboxTab === 0) {
            this._getInbox();
        } else {
            this._getAgentHistory(true);
        }
    }

    clearFilter () {
        this.props.filterActions.clearAllSelecteds();
        this.props.viewsActions.toggleModalState('showFilter', 'inboxView');

        if (this.props.viewsStore.currentInboxTab === 0) {
            this._getInbox();
        } else {
            this._getAgentHistory(true);
        }
    }

    _setCurrentIndex (index) {
        const table = this.props.viewsStore.currentInboxTab === 0 ? 'inbox' : 'history';
        let currentIndex = null;

        if (this.props.viewsStore.currentInboxTab === 0 && this.props.interactionStore.inboxCurrentIndex !== index) {
            currentIndex = index;
        }

        if (this.props.viewsStore.currentInboxTab === 1 && this.props.interactionStore.historyCurrentIndex !== index) {
            currentIndex = index;
        }

        this.props.interactionActions.setCurrentIndex(table, currentIndex);
    }

    _handleRowClick (index) {
        const inboxIndex = this.props.interactionStore.inboxCurrentIndex;
        const historyIndex = this.props.interactionStore.historyCurrentIndex;
        const isShowing = this.props.viewsStore.showInteractionMessages;

        if ((index === inboxIndex || index === historyIndex) && isShowing) {
            this.props.viewsActions.hideInteractionMessages();
        } else {
            this.props.viewsActions.showInteractionMessages();
        }

        this._setCurrentIndex(index);
        this.loadMessages(index);
    }

    loadMessages (index) {
        const medias = ['offcontact', 'email', 'meli_qst'];
        const listType = this.props.viewsStore.currentInboxTab === 0 ? 'inbox' : 'history';
        const interactionIndex = index !== null && typeof index !== 'undefined'
            ? index
            : this.props.interactionStore[`${listType}CurrentIndex`];

        if (medias.includes(this.props.interactionStore[listType][interactionIndex].type)
            || this.props.interactionStore[listType][interactionIndex].messages.status === 'ENDED') {
            return;
        }

        this.props.interactionActions.fetchInboxMessages(
            this.props.interactionStore[listType][interactionIndex].hash,
            this.props.interactionStore[listType][interactionIndex].messages.page,
            listType,
            interactionIndex
        );
    }

    discardInteractionsSelected () {
        const agentId = this.props.currentUserStore.information.id;

        this.props.viewsActions.hideInteractionMessages();
        _.map(this.props.interactionStore.inbox, (interaction) => {
            if (interaction.selected) {
                if (interaction.type === 'offcontact') {
                    this.props.interactionActions.discardOffcontact(interaction.hash, agentId);
                }

                if (interaction.type === 'telegram' || interaction.type === 'facebook') {
                    const target = interaction.departmentUri;

                    this.props.currentUserStore.OmzSip.profile.finishPostponed(interaction.hash, target, agentId);
                }
            }
        });
    }

    render () {
        const _getIconType = (type) => {
            switch (type) {
                case 'TELEGRAM':
                case 'telegram':
                    return {name: 'telegram', width: '25px', height: '25px', class: '', color: ''};
                case 'facebook':
                case 'FACEBOOK':
                    return {name: 'messenger', width: '25px', height: '25px', class: '', color: ''};
                case 'email':
                case 'EMAIL':
                case 'offcontact':
                case 'OFFCONTACT':
                    return {name: 'mail', width: '25px', height: '15px', class: 'rythm--margin-t-1', color: 'gray-primary'};
                case 'AUDIO':
                    return {name: 'voice', width: '15px', height: '25px', color: 'gray-primary'};
                case 'VIDEO':
                    return {name: 'video', width: '25px', height: '15px', color: 'gray-primary'};
                case 'PHONE':
                    return {name: 'phone', width: '25px', height: '15px', color: 'gray-primary'};
                case 'meli_qst':
                case 'MELI_QST':
                case 'meli_msg':
                case 'MELI_MSG':
                    return {name: 'meli', width: '32px', height: '23px', class: ''};
                default:
                    return {name: 'ballon-secondary', width: '25px', height: '25px', class: '', color: 'gray-primary'};
            }
        };

        const _getStatusColor = (status) => {
            switch (status) {
                case 'OPENED':
                    return 'green';
                case 'POSTPONED':
                    return 'yellow';
                case 'PENDING':
                    return 'red';
                default:
                    return 'gray';
            }
        };

        const _getStatusName = (status) => {
            switch (status) {
                case 'OPENED':
                    return 'Em atendimento';
                case 'POSTPONED':
                    return 'Pendente';
                case 'PENDING':
                    return 'Novo';
                default:
                    return 'Pendente';
            }
        };

        const inboxTableData = {
            status: '',
            allChecked: false,
            headers: this.props.tableStore.inbox.headers
        };

        let hasInteractionSelected = false;

        inboxTableData.items = _.map(this.props.interactionStore.inbox, (interaction, interactionKey) => {
            const interactionTypeIcon = _getIconType(interaction.type);

            if (interaction.selected) {
                hasInteractionSelected = true;
            }

            const row = {
                highlight: false,
                selected: interaction.selected,
                fields: [
                    {
                        id: 'type',
                        type: 'data',
                        content: (
                            <Icon
                                name={interactionTypeIcon.name}
                                iconColor={interactionTypeIcon.color}
                                width="20px"
                                height="20px"
                                inline={true}
                            />
                        )
                    },
                    {
                        id: 'name',
                        type: 'data',
                        content: (
                            <Text
                                content={interaction.customerInfo.name}
                            />
                        )
                    },
                    {
                        id: 'message',
                        type: 'data',
                        content: (
                            <Text
                                rightPadding="20"
                                content={interaction.messages.data[interaction.messages.data.length - 1].content}
                                wrap={true}
                            />
                        )
                    },
                    {
                        id: 'tags',
                        type: 'data',
                        content: (
                            <Text
                                iconName="tag-outline"
                                iconWidth="12px"
                                content={Object.keys(interaction.tags).length}
                            />
                        )
                    },
                    {
                        id: 'department',
                        type: 'data',
                        content: (
                            <Text
                                content={interaction.department}
                            />
                        )
                    },
                    {
                        id: 'date',
                        type: 'data',
                        content: (
                            <Text
                                iconName="calendar"
                                iconWidth="12px"
                                iconColor="gray-secondary"
                                content={
                                    interaction.messages.data[interaction.messages.data.length - 1].time
                                        ? interaction.messages.data[interaction.messages.data.length - 1].time.format('DD/MM/YYYY')
                                        : ''
                                }
                            />
                        )
                    },
                    {
                        id: 'duration',
                        type: 'data',
                        content: (
                            <Text
                                iconName="clock"
                                iconWidth="12px"
                                iconColor="gray-secondary"
                                content={TimeHelper.getDiffFromNowHumanized(interaction.startTime)}
                            />
                        )
                    },
                    {
                        id: 'state',
                        type: 'data',
                        position: '20l',
                        content: (
                            <Tooltip
                                header={(
                                    <Status color={_getStatusColor(interaction.state)}/>
                                )}
                            >
                                <p className="text--quinquennary">
                                    {_getStatusName(interaction.state)}
                                </p>
                            </Tooltip>
                        )
                    }
                ]
            };

            return row;
        });

        const historyTableData = {
            status: '',
            allChecked: false,
            headers: this.props.tableStore.history.headers
        };

        historyTableData.items = _.map(this.props.interactionStore.history, (interaction, interactionKey) => {
            const interactionTypeIcon = _getIconType(interaction.type);
            const row = {
                highlight: false,
                fields: [
                    {
                        id: 'media',
                        type: 'data',
                        content: (
                            <Icon
                                name={interactionTypeIcon.name}
                                iconColor={interactionTypeIcon.color}
                                width="20px"
                                height="20px"
                                inline={true}
                            />
                        )
                    },
                    {
                        id: 'client_name',
                        type: 'data',
                        content: (
                            <Text
                                content={interaction.customerInfo.name}
                            />
                        )
                    },
                    {
                        id: 'message',
                        type: 'data',
                        content: (
                            <Text
                                rightPadding="20"
                                content={interaction.messages.data[interaction.messages.data.length - 1].content}
                                wrap={true}
                            />
                        )
                    },
                    {
                        id: 'tags',
                        type: 'data',
                        content: (
                            <Text
                                iconName="tag-outline"
                                iconWidth="12px"
                                content={Object.keys(interaction.tags).length}
                            />
                        )
                    },
                    {
                        id: 'department',
                        type: 'data',
                        content: (
                            <Text
                                content={interaction.department}
                            />
                        )
                    },
                    {
                        id: 'created_time',
                        type: 'data',
                        content: (
                            <Text
                                iconName="calendar"
                                iconWidth="12px"
                                iconColor="gray-secondary"
                                content={interaction.startTime.format('DD/MM/YYYY')}
                            />
                        )
                    },
                    {
                        id: 'last_message_date',
                        type: 'data',
                        content: (
                            <Text
                                iconName="calendar"
                                iconWidth="12px"
                                iconColor="gray-secondary"
                                content={
                                    interaction.messages.data[interaction.messages.data.length - 1].time
                                        ? interaction.messages.data[interaction.messages.data.length - 1].time.format('DD/MM/YYYY')
                                        : ''
                                }
                            />
                        )
                    },
                    {
                        id: 'agent_name',
                        type: 'data',
                        content: (
                            <Avatar
                                name={interaction.agent.name}
                                src={interaction.agent.photo} size="small"
                            />
                        )
                    }
                ]
            };

            return row;
        });

        const getFrom = () => {
            if (this.activeTab === 0) {
                return this.inboxStartDate ? this.inboxStartDate : '';
            }
            return this.historyStartDate ? this.historyStartDate : '';
        };
        const getTo = () => {
            if (this.activeTab === 0) {
                return this.inboxEndDate ? this.inboxEndDate : '';
            }
            return this.historyEndDate ? this.historyEndDate : '';
        };

        let exportUrl = `${ENV.BODYLIFT}/interactions/export?accountId=${this.props.currentUserStore.information.account.id}&agentId=${this.props.currentUserStore.information.id}`;

        if (this.props.interactionStore.historySearch) {
            exportUrl = exportUrl + `&search=${this.props.interactionStore.historySearch}`;
        }

        if (this.props.filterStore.department.selectedOptionsId) {
            exportUrl = exportUrl + `&departments=${this.props.filterStore.department.selectedOptionsId}`;
        }

        if (this.props.filterStore.channel.selectedOptionsId) {
            exportUrl = exportUrl + `&search=${this.props.filterStore.channel.selectedOptionsId}`;
        }

        if (this.props.interactionStore.historySearch) {
            exportUrl = exportUrl + `&types=${this.props.interactionStore.historySearch}`;
        }

        if (getFrom()) {
            exportUrl = exportUrl + `&from=${getFrom().format('YYYY-MM-DD 00:00:00')}`;
        }

        if (getTo()) {
            exportUrl = exportUrl + `&to=${getTo().format('YYYY-MM-DD 23:59:59')}`;
        }

        const mainInboxContent = (tab) => {
            if (this.props.viewsStore.currentInboxTab === 0 && (Object.keys(this.props.interactionStore.inbox).length > 0 || this.props.interactionStore.status === 'LOADING')) {
                return (
                    <div className="full--height">
                        <OMZTable
                            loadingData={this.props.interactionStore.status === 'LOADING'}
                            selectable={true}
                            rowClickable={true}
                            activeIndex={this.props.interactionStore.inboxCurrentIndex}
                            data={inboxTableData}
                            hideColumns={this.props.viewsStore.showInteractionMessages
                                ? ['message', 'tags', 'department', 'date']
                                : []
                            }
                            onRowClick={this._handleRowClick}
                            onCheck={(rowIndex, allChecked) => this.props.interactionActions.updateInboxCheck(rowIndex, allChecked)}
                        />
                    </div>
                );
            }

            if (this.props.viewsStore.currentInboxTab === 1) {
                return (
                    <div className="full--height">
                        <div className="row collapse">
                            <div className="large-6 columns rythm--margin-b-2">
                                <Form onSubmit={this._handleSearchHistory}>
                                    <InputText
                                        ref={(c) => {this.searchHistory = c;}}
                                        type="text"
                                        search={true}
                                        name="search"
                                        placeholder="Busca"
                                        className="input--rounded input--border-gray"
                                        animation="input-animated"
                                        hasLabel={true}
                                        validations={[]}
                                        onFocus={this.props.viewsActions.hideInteractionMessages}
                                        value={this.props.interactionStore.historySearch}
                                        onChange={() => this.props.interactionActions.changeSearch('history', this.searchHistory.state.value)}
                                    />
                                </Form>
                            </div>

                            <div className="large-5 columns text-right rythm--margin-b-2">
                                <a href={exportUrl} target="_blank">
                                    <Button
                                        className="vTop alpha-10"
                                        size="big"
                                        color="blue"
                                        handleOnClick={this.downloadHistory}
                                    >
                                        <Icon
                                            name="download"
                                            iconColor="white"
                                            width="20px"
                                            inline={true}
                                        />
                                    </Button>
                                </a>
                                <Notification
                                    show={this.historyStartDate && this.historyEndDate ? true : false}
                                    notificationIcon={<Icon name="check" iconColor="white" width="10px"/>}
                                >
                                    <Button
                                        className="vTop alpha-10 datePickerButton"
                                        size="big"
                                        color={this.historyStartDate && this.historyEndDate ? 'white' : 'blue'}
                                        handleOnClick={() => {
                                            this.props.viewsActions.toggleModalState('showPeriod', 'inboxView');
                                            this.props.viewsActions.hideInteractionMessages();
                                        }}
                                    >
                                        <Icon
                                            name="calendar"
                                            iconColor={this.historyStartDate && this.historyEndDate ? '' : 'white'}
                                            width="23px"
                                            inline={true}
                                        />
                                    </Button>
                                </Notification>
                                <Notification
                                    show={
                                        (this.props.filterStore.department.selectedOptionsId
                                        || this.props.filterStore.channel.selectedOptionsId)
                                        && !this.props.viewsStore.modal.inboxView.showFilter
                                            ? true
                                            : false
                                    }
                                    notificationIcon={<Icon name="check" iconColor="white" width="10px"/>}
                                >
                                    <Button
                                        className="vTop alpha-10"
                                        size="big"
                                        color={
                                            (this.props.filterStore.department.selectedOptionsId
                                            || this.props.filterStore.channel.selectedOptionsId)
                                            && !this.props.viewsStore.modal.inboxView.showFilter
                                                ? 'white'
                                                : 'blue'
                                        }
                                        handleOnClick={() => {
                                            this.props.viewsActions.toggleModalState('showFilter', 'inboxView');
                                            this.props.viewsActions.hideInteractionMessages();
                                        }}
                                    >
                                        <Icon
                                            name="filter-options"
                                            iconColor={
                                                (this.props.filterStore.department.selectedOptionsId
                                                || this.props.filterStore.channel.selectedOptionsId)
                                                && !this.props.viewsStore.modal.inboxView.showFilter
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
                        <OMZTable
                            loadingData={this.props.interactionStore.status === 'LOADING'}
                            data={historyTableData}
                            rowClickable={true}
                            activeIndex={this.props.interactionStore.historyCurrentIndex}
                            hideColumns={this.props.viewsStore.showInteractionMessages
                                ? ['message', 'tags', 'department', 'agent_name']
                                : []
                            }
                            onRowClick={this._handleRowClick}
                            onTableBottom={this._getAgentHistory.bind(this)}
                            onHeaderClick={(id) => {
                                this.props.tableActions.changeTableOrder('history', id);
                                this._getAgentHistory(true);
                            }}
                        />
                    </div>
                );
            }

            if (this.props.interactionStore.status === '') {
                return (
                    <div className="rythm--center centralize">
                        <Icon name={`${this.props.viewsStore.currentInboxTab === 0 ? 'inbox' : 'history'}`} width="100px" iconColor="gray-secondary"/>
                        <p className="rythm--margin-t-1 text--quaternary text--gray--quinquennary centralize">
                            {`Não há itens ${ this.props.viewsStore.currentInboxTab === 0 ? 'na sua caixa de entrada' : 'no histórico de atendimento'}`}
                        </p>
                    </div>
                );
            }

            return (
                <StateMessage
                    messageState={this.props.interactionStore.status}
                    middle={true}
                    icon={`${this.props.viewsStore.currentInboxTab === 0 ? 'inbox' : 'history'}`}
                    context={`Carregamento ${this.props.viewsStore.currentInboxTab === 0 ? 'da caixa de entrada' : 'do histórico de atendimento'}`}
                    autoRetry={false}
                    action={this.props.viewsStore.currentInboxTab === 0 ? this._getInbox.bind(this) : this._getAgentHistory.bind(this)}
                />
            );
        };

        const tabs = [
            {
                title: !this.props.viewsStore.showInteractionMessages
                    ? <Text content="Caixa de Entrada" inline={true} textColor={this.props.viewsStore.currentInboxTab === 0 ? 'black' : 'white'}/>
                    : null,
                icon: <Icon name="inbox" width="22px" iconColor={this.props.viewsStore.currentInboxTab === 0 ? 'gray-primary' : 'white'} inline={true}/>,
                active: true
            },
            {
                title: !this.props.viewsStore.showInteractionMessages
                    ? <Text content="Histórico de atendimento" inline={true} textColor={this.props.viewsStore.currentInboxTab === 1 ? 'black' : 'white'}/>
                    : null,
                icon: <Icon name="history" width="20px" iconColor={this.props.viewsStore.currentInboxTab === 1 ? 'gray-primary' : 'white'} inline={true}/>,
                active: false
            }
        ];

        const getCurrentInteraction = () => {
            if (this.props.viewsStore.currentInboxTab === 0 && this.props.interactionStore.inboxCurrentIndex !== null) {
                return this.props.interactionStore.inbox[this.props.interactionStore.inboxCurrentIndex];
            }

            if (this.props.viewsStore.currentInboxTab === 1 && this.props.interactionStore.historyCurrentIndex !== null) {
                return this.props.interactionStore.history[this.props.interactionStore.historyCurrentIndex];
            }

            return null;
        };

        const currentInteraction = getCurrentInteraction();

        const cardInboxMessageHeader = (customer, department, type) => (
            <div className="row collapse">
                <div className="large-11 columns">
                    <Icon name={_getIconType(type).name} width={_getIconType(type).width} height={_getIconType(type).height} iconClass={`icon--inline icon--pull pull--left ${_getIconType(type).class}`} />
                    <h3 className="title title--quaternary">{customer.name || 'Nome desconhecido'}</h3>
                    <div className="interaction__info__department title--card-subtitle--secondary">{department}</div>
                </div>
                <div className="large-1 columns">
                    <Tooltip
                        noHeaderBkg={true}
                        position="left"
                        header={(
                            <Avatar
                                className="pull--right"
                                src="default"
                                size="medium"
                            />
                        )}
                    >
                        <ClientCard
                            customer={customer}
                            hideHistory={true}
                        />
                    </Tooltip>
                </div>
            </div>
        );

        return (
            <section className="inbox">
                <OMZHelmet title="Omnize - Caixa de entrada"/>
                <div className="row collapse">
                    <div className={`${this.props.viewsStore.showInteractionMessages ? 'large-6' : 'large-12'} columns`}>
                        <Card
                            helpers={`card--full-height ${this.props.viewsStore.showInteractionMessages ? 'pr10' : ''}`}
                            headerSize="small"
                            tabList={tabs}
                            tabIndex={this.props.viewsStore.currentInboxTab}
                            contentPadded={true}
                            onTabClick={this._changeTab.bind(this)}
                        >
                        <div className="full--height">
                            {mainInboxContent(this.props.viewsStore.currentInboxTab)}
                        </div>
                        {
                            hasInteractionSelected && this.props.viewsStore.currentInboxTab === 0 ? (
                                <FloatButton
                                    position="bottom-right"
                                    handleClick={this.discardInteractionsSelected}
                                />
                            ) : ''
                        }
                        </Card>
                    </div>
                    <PeriodModal
                        isOpen={this.props.viewsStore.modal.inboxView.showPeriod}
                        modalParentSelector={this._getParent}
                        onApplyFilter={(startDate, endDate) => this._changePeriodFilter(startDate, endDate)}
                        onClearFilter={() => this._changePeriodFilter()}
                        onCloseModal={() => this.props.viewsActions.toggleModalState('showPeriod', 'inboxView')}
                    />
                    <ModalFilter
                        isOpen={this.props.viewsStore.modal.inboxView.showFilter}
                        modalParentSelector={this._getParent.bind(this)}
                        handleOnChange={(filterId, optionIndex, all) => this.props.filterActions.updateFilter(filterId, optionIndex, all)}
                        filters={[
                            this.props.filterStore.department,
                            this.props.filterStore.channel
                        ]}
                        handleFilterClick={this._applyFilter}
                        onCloseModal={() => this.props.viewsActions.toggleModalState('showFilter', 'inboxView')}
                        onClearFilter={this.clearFilter}
                    />
                    <div className="large-6 columns">
                        {
                            this.props.viewsStore.showInteractionMessages && currentInteraction ? (
                                <Card
                                    title={cardInboxMessageHeader(
                                        currentInteraction.customerInfo,
                                        currentInteraction.department,
                                        currentInteraction.type
                                    )}
                                    helpers="card--full-height"
                                    titleSize="small"
                                >
                                    <Message
                                        interaction={currentInteraction}
                                        ref="message"
                                        hasReducer={false}
                                        agentPhoto={this.props.currentUserStore.information.photo || 'default'}
                                        clientPhoto="default"
                                        handleTopList={() => this.loadMessages()}
                                        messageState={this.props.interactionStore.loadingMessages}
                                    >
                                        {
                                            this.props.viewsStore.currentInboxTab === 0 ? (
                                                <MessageReplyBox>
                                                    <Avatar className="zeta" size="small" src={this.props.currentUserStore.information.photo} />
                                                    {
                                                        this.props.currentUserStore.registerState === 'REGISTERED' || currentInteraction.type === 'offcontact' ? (
                                                            <span>Clique aqui para <Button link={true} textColor="gray" handleOnClick={(event) => this.handleReply(event, currentInteraction.id)}>Responder</Button></span>
                                                        ) : (
                                                            <span>Para poder responder, fique online.</span>
                                                        )
                                                    }
                                                </MessageReplyBox>
                                            ) : null
                                        }
                                    </Message>
                                </Card>
                            ) : (
                                <div className="MessageList__empty-side centralize">
                                    <div className="MessageList__empty-side__label rythm--center rythm--4">Nenhuma Conversa Selecionada</div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </section>
        );
    }
}

export default View;
