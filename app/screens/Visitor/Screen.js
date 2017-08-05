import React from 'react';
import _ from 'lodash';
import {Card, Detail, Invite, Table, Icon, StateMessage, OMZHelmet, WelcomeMessage} from 'app/screens/Components';
import {TimeHelper} from 'app/helpers';

const tableColumnsFull = [
    {key: 'customerName', label: 'Nome'},
    {key: 'visits', label: 'Visitas'},
    {key: 'pagesAccessed', label: 'Páginas acessadas'},
    {key: 'dateAccess', label: 'Tempo no site'},
    {key: 'pageUrl', label: 'Link'},
    {key: 'interactionState', label: 'Status'}
];
const findByKey = (key) => {
    return _.find(tableColumnsFull, {key: key});
};
const tableColumnsPartial = [
    findByKey('customerName'),
    findByKey('pagesAccessed'),
    findByKey('dateAccess'),
    findByKey('interactionState')
];

class View extends React.Component {
    constructor (props) {
        super(props);
        this.intervalVisitors = null;
        this.intervalDetails = null;
        this.state = {
            countFilter: 0,
            tableColumns: tableColumnsFull
        };
    }

    componentDidMount () {
        this._createVisitorInterval();
    }

    componentDidUpdate () {
        this._checkForWindowFocused();
    }

    componentWillUnmount () {
        clearInterval(this.intervalVisitors);
        clearInterval(this.intervalDetails);
    }

    _createVisitorInterval () {
        this.intervalVisitors = setInterval(() => {
            this._visitorTracker(this.props.currentUserStore.information.account.id);
        }, 5000);
    }

    _checkForWindowFocused () {
        if (!this.props.viewsStore.isWindowFocused && this.intervalVisitors) {
            clearInterval(this.intervalVisitors);
            this.intervalVisitors = null;
        }

        if (this.props.viewsStore.isWindowFocused && !this.intervalVisitors) {
            this._createVisitorInterval();
        }
    }

    handleUpdateDetails (e, id) {
        e.preventDefault();
        const visitor = this.props.visitorTrackerStore.visitors.filter((item, index, array) => item.id === id)[0];

        this._visitorTrackerDetail(visitor.id);
        this.props.visitorTrackerActions.setCustomerId(id);
        this.props.visitorTrackerActions.updateDetailsDisplay(true);

        clearInterval(this.intervalDetails);

        this.setState({
            tableColumns: this.props.visitorTrackerStore.showDetails ? this.state.tableColumns : tableColumnsPartial
        });

        this.intervalDetails = setInterval(() => {
            const display = this.props.visitorTrackerStore.visitors.length > 0 ? true : false;

            this._visitorTrackerDetail(visitor.id);
            this.props.visitorTrackerActions.updateDetailsDisplay(display);

            if (!display) {
                clearInterval(this.intervalDetails);
            }
        }, 2000);
    }

    handleOpenDetails (e) {
        this.props.visitorTrackerActions.setCustomerId('');
        this.props.visitorTrackerActions.updateDetailsDisplay(true);
    }

    handleCloseDetails (e) {
        clearInterval(this.intervalDetails);
        this.props.visitorTrackerActions.setCustomerId('');
        this.props.visitorTrackerActions.updateDetailsDisplay(false);
        this.setState({
            tableColumns: tableColumnsFull
        });
    }

    handleBackColumns (e) {
        const tableColumns = [
            findByKey('customerName'),
            findByKey('visits'),
            findByKey('pagesAccessed'),
            findByKey('dateAccess')
        ];

        this.setState({
            tableColumns: tableColumns
        });
    }

    handleNextColumns (e) {
        const tableColumns = [
            findByKey('dateAccess'),
            findByKey('pageUrl'),
            findByKey('interactionState')
        ];

        this.setState({
            tableColumns: tableColumns
        });
    }

    handleFilter (e, key) {
        const order = this.state.countFilter !== 0 ? 'desc' : 'asc';

        this.setState({
            countFilter: this.state.countFilter !== 0 ? 0 : 1
        });

        this.props.visitorTrackerActions.updateFilter({
            key: key,
            order: order
        });
        this.props.visitorTrackerActions.applyFilter();
    }

    handleGetStatus (customerId) {
        const visitor = this.props.visitorTrackerStore.visitors.filter((item, index, array) => item.id === customerId)[0];

        if (!visitor) {
            return 'enabled';
        }

        return visitor.interactionState === 'Navegando' ? 'enabled' : 'disabled';
    }

    _visitorTracker (accountId) {
        this.props.visitorTrackerActions.getVisitors(accountId);
    }

    _visitorTrackerDetail (customerId) {
        this.props.visitorTrackerActions.getVisitorDetails(customerId);
    }

    _parseVisitorsData (visitors) {
        return _.map(visitors, (visitor) => {
            const visitorData = {};

            _.forIn(visitor, (value, key) => {
                visitorData[key] = visitor[key];

                if (key === 'id') {
                    return;
                }

                if (key === 'interactionState') {
                    _.map(this.props.interactionStore.interactions, (interaction) => {
                        if (interaction.customerInfo.customerKey === visitor.customerId) {
                            if (interaction.state === 'TALKING') {
                                visitorData[key] = 'Em atendimento';
                            }
                        }
                    });
                    return;
                }

                if (key === 'pageUrl') {
                    visitorData[key] = visitor[key].replace(/https?:\/\/[^\/]+/i, '');
                    return;
                }

                if (key === 'dateAccess') {
                    visitorData[key] = TimeHelper.getDiffFromNow(visitor[key], true, 'HH[h] mm [min]');
                }
            });
            return visitorData;
        });
    }

    _getParent () {
        return document.querySelector('.main-wrapper__child');
    }

    handleOpenInvite (e, id) {
        if (typeof(e) === 'object') {
            e.stopPropagation();
        }

        const customerId = id ? id : this.props.visitorTrackerStore.customerId;

        if (this.handleGetStatus(customerId) === 'disabled') {
            return;
        }

        const agentId = this.props.currentUserStore.information.id;

        this.props.visitorTrackerActions.setCustomerId(customerId);
        this.props.visitorTrackerActions.getInviteData(agentId);
    }

    handleCloseInvite (e) {
        this.props.visitorTrackerActions.setCustomerId('');
        this.props.visitorTrackerActions.updateInviteDisplay(false);
    }

    handleInviteDepartmentChange (e) {
        const index = this.refs.invite.department.refs.comboSelect.selectedIndex;

        this.props.visitorTrackerActions.updateInviteDepartment(this.props.visitorTrackerStore.invite.departments[index]);
    }

    handleInviteMessageChange () {
        const message = this.refs.invite.message.refs.textArea.value;

        this.props.visitorTrackerActions.updateMessage(message);
    }

    handleInvite (e) {
        e.preventDefault();
        const message = this.props.visitorTrackerStore.invite.message;
        const departmentId = this.props.visitorTrackerStore.invite.department.id;
        const customerId = this.props.visitorTrackerStore.customerId;
        const subscriberId = this.props.currentUserStore.information.subscriber.id;

        this.props.visitorTrackerActions.inviteVisitor(customerId, subscriberId, departmentId, message);
    }

    render () {
        const tableRowActions = [
            {
                icon: 'balloon',
                type: 'circle',
                width: '20px',
                height: '15.5px',
                status: this.handleGetStatus.bind(this),
                handler: this.handleOpenInvite.bind(this)
            }
        ];
        const tableHeaderActions = [
            {
                icon: 'chevron',
                type: 'rounded',
                color: 'white',
                rotate: '90',
                width: '10px',
                height: '15px',
                handler: this.handleBackColumns.bind(this)
            },
            {
                icon: 'chevron',
                type: 'rounded',
                color: 'white',
                rotate: '270',
                width: '10px',
                height: '15px',
                handler: this.handleNextColumns.bind(this)
            }
        ];
        const emptyText = 'Nenhum visitante online no momento';
        const onlineVisitors = () => {
            const quantity = this.props.visitorTrackerStore.visitors.length;
            const text = `Exibindo ${quantity} ${quantity > 1 ? 'visitantes' : 'visitante'} no momento`;

            return (quantity > 0) ? text : emptyText;
        };
        const title = (<h3 className="title title--card">Visitantes online</h3>);
        const subtitle = onlineVisitors();
        const visitorsList = this.props.visitorTrackerStore.visitors;

        // Customer Needs - Hiding on going and invited interaction on Visitor Tracker screens
        const notShowOnGoing = [6, 4873, 4913, 5007, 5137];

        if (notShowOnGoing.indexOf(this.props.currentUserStore.information.account.id) > -1) {
            _.remove(visitorsList, (visitor) => {
                return visitor.interactionState === 'Em atendimento' || visitor.interactionState === 'Convidado';
            });
        }

        const parsedData = this._parseVisitorsData(visitorsList);
        const mainContent = () => {
            if (parsedData.length > 0) {
                return (
                    <Table
                        cols={this.state.tableColumns}
                        data={parsedData}
                        actions={tableRowActions}
                        actionName="CONVIDE"
                        headerActions={tableHeaderActions}
                        handleOnClick={this.handleUpdateDetails.bind(this)}
                        handleFilterOnClick={this.handleFilter.bind(this)}
                        currentId={this.props.visitorTrackerStore.customerId}
                    />
                );
            }

            if (this.props.visitorTrackerStore.state === 'ERROR' || this.props.visitorTrackerStore.state === 'TIMEOUT') {
                return (
                    <StateMessage
                        messageState={this.props.visitorTrackerStore.state}
                        middle={true}
                        icon="viewers"
                        context={'Busca de visitantes online'}
                        autoRetry={true}
                    />
                );
            }

            return (
                <div className="rythm--center centralize">
                    <Icon name="viewers" width="100px" iconColor="gray-secondary"/>
                    <p className="rythm--margin-t-1 text--quaternary text--gray--quinquennary centralize">
                         Não há nenhum visitante online.
                    </p>
                </div>
            );
        };

        return (
            <section className="visitor">
                <OMZHelmet title="Omnize - Visitantes online"/>
                <div className="visitor__container">
                    <Invite
                        ref="invite"
                        isOpen={this.props.visitorTrackerStore.showInvite}
                        invite={this.props.visitorTrackerStore.invite}
                        handleInvite={this.handleInvite.bind(this)}
                        handleClose={this.handleCloseInvite.bind(this)}
                        handleDepartmentChange={this.handleInviteDepartmentChange.bind(this)}
                        handleMessageChange={this.handleInviteMessageChange.bind(this)}
                        parentSelector={this._getParent.bind(this)}
                        user={this.props.currentUserStore}
                    />
                    <Card
                        helpers={`card--full-height ${this.props.visitorTrackerStore.showDetails ? 'card--col-7' : 'card--col-12'}`}
                        title={title}
                        subtitle={subtitle}
                        scrollable={true}
                    >
                    {mainContent()}
                    </Card>
                    <Detail
                        user={this.props.visitorTrackerStore.details}
                        show={this.props.visitorTrackerStore.showDetails}
                        handleOpenInvite={this.handleOpenInvite.bind(this)}
                        handleCloseDetails={this.handleCloseDetails.bind(this)}
                    />
                </div>
                <WelcomeMessage
                    parentSelector={this._getParent.bind(this)}
                    currentUser={this.props.currentUserStore.information}
                />
            </section>
        );
    }
}

export default View;
