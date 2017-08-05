import Alt from 'app/flux/Alt';
import _ from 'lodash';
import {visitorTrackerActions} from 'app/flux/Actions';

class VisitorTrackerStore {
    constructor () {
        this.state = {
            state: '',
            customerId: '',
            visitors: [],
            details: {
                state: '',
                data: []
            },
            filter: {
                key: '',
                order: 'asc'
            },
            invite: {
                state: '',
                departments: [],
                department: {},
                message: ''
            },
            showInvite: false,
            showDetails: false,
            total: {
                status: '',
                data: 0
            }
        };
        this.bindActions(visitorTrackerActions);
    }

    filterVisitors (data, type) {
        const filteredData = _.map(data, (item) => {
            const navigations = _.map(item.navigations, (navigation) => {
                navigation.pageUrlMin = navigation.pageUrl.split('/').pop();

                return navigation;
            });

            switch (item.interactionState.toLowerCase()) {
                case 'n':
                    item.interactionState = 'Navegando';
                    break;
                case 'c':
                    item.interactionState = 'Convidado';
                    break;
                case 'i':
                    item.interactionState = 'Em atendimento';
                    break;
                default:
                    item.interactionState = 'Navegando';
                    break;
            }

            item.navigations = navigations;

            return item;
        });

        return filteredData;
    }

    onGettingVisitors () {
        this.setState({
            state: 'LOADING'
        });
    }

    onGettedVisitors (result) {
        if (result.error) {
            this.setState({
                state: result.error
            });
            return;
        }

        this.setState({
            state: '',
            visitors: this.filterVisitors(result.data.items, 'visitors')
        });
        this.onUpdatingFilter(this.state.filter);
        this.onApplyingFilter();
    }

    onGettingVisitorDetails () {
        this.state.details.state = 'LOADING';
        this.setState({
            details: this.state.details
        });
    }

    onGettedVisitorDetails (request) {
        if (request.error) {
            this.setState({
                details: {
                    state: request.error,
                    data: []
                }
            });
            return;
        }

        this.setState({
            details: {
                state: '',
                data: this.filterVisitors(request.data.items, 'detail')
            }
        });
    }

    onUpdatingFilter (filter) {
        this.setState({
            filter: {
                key: filter.key,
                order: filter.order
            }
        });
    }

    onApplyingFilter () {
        const dataSorted = _.orderBy(this.state.visitors, [this.state.filter.key], [this.state.filter.order]);

        this.setState({
            visitors: dataSorted
        });
    }

    onUpdatingInvite (display) {
        this.state.invite.send = false;
        this.setState({
            showInvite: display,
            invite: this.state.invite
        });
    }

    onUpdatingDetails (display) {
        this.setState({
            showDetails: display
        });
    }

    onSettingCustomerId (customerId) {
        this.setState({
            customerId: customerId
        });
    }

    onGettingInviteData () {
        this.state.invite.state = 'LOADING';
        this.setState({
            invite: this.state.invite
        });
    }

    onGettedInviteData (response) {
        if (response.error) {
            this.state.invite.state = response.error;
            this.setState({
                invite: this.state.invite
            });
            return;
        }

        _.map(response.departments, (department, key) => {
            department.value = department.name;
            return department;
        });

        this.state.invite.state = '';
        this.state.invite.departments = response.departments;
        this.state.invite.department = response.departments[0];
        this.state.invite.message = response.message;

        this.setState({
            invite: this.state.invite
        });
    }

    onUpdatingInviteMessage (message) {
        this.state.invite.message = message;
        this.setState({
            invite: this.state.invite
        });
    }

    onUpdatingInviteDepartment (department) {
        this.state.invite.department = department;
        this.setState({
            invite: this.state.invite
        });
    }

    onInvitingVisitor () {
        this.state.invite.state = 'LOADING';
        this.state.invite.send = true;
        this.setState({
            invite: this.state.invite
        });
    }

    onInvitedVisitorError (error) {
        this.state.invite.state = error;
        this.setState({
            invite: this.state.invite
        });
    }

    onFetchingTotalCount (params) {
        this.state.total.status = params.status;
    }

    onFetchedTotalCount (params) {
        this.state.total.status = params.status;
        this.state.total.data = params.data.total;
    }
}

export default Alt.createStore(VisitorTrackerStore, 'visitorTrackerStore');
