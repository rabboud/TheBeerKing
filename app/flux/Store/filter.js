import alt from 'app/flux/Alt';
import _ from 'lodash';
import {filterActions} from 'app/flux/Actions';

class FilterStore {
    constructor () {
        this.state = {
            status: '',
            date: {
                startDate: '',
                endDate: ''
            },
            agents: {
                id: 'agents',
                name: 'administrador',
                multiple: true,
                selectAll: true,
                selectedOptionsId: '',
                options: []
            },
            state: {
                id: 'state',
                name: 'status',
                multiple: false,
                selectedOptionsId: '',
                options: [
                    {
                        id: '',
                        name: 'Todos',
                        selected: false
                    },
                    {
                        id: 'ACTIVE',
                        name: 'Ativo',
                        selected: false
                    },
                    {
                        id: 'INACTIVE',
                        name: 'Inativo',
                        selected: false
                    }
                ]
            },
            department: {
                id: 'department',
                name: 'departamento',
                multiple: true,
                selectAll: true,
                selectedOptionsId: '',
                options: []
            },
            channel: {
                id: 'channel',
                name: 'canal',
                multiple: true,
                selectAll: true,
                selectedOptionsId: '',
                options: [
                    {
                        id: 'TEXT',
                        name: 'Chat',
                        selected: false
                    },
                    {
                        id: 'VIDEO',
                        name: 'Video',
                        selected: false
                    },
                    {
                        id: 'AUDIO',
                        name: 'Audio',
                        selected: false
                    },
                    {
                        id: 'OFFCONTACT',
                        name: 'Recado',
                        selected: false
                    },
                    {
                        id: 'FACEBOOK',
                        name: 'Facebook',
                        selected: false
                    },
                    {
                        id: 'TELEGRAM',
                        name: 'Telegram',
                        selected: false
                    }
                ]
            }
        };

        this.bindActions(filterActions);
    }

    onFetchingFilter () {
        this.setState({
            status: 'LOADING'
        });
    }

    onFetchedAgentsFilter (result) {
        this.state.agents.options = [];

        _.map(result, (agent) => {
            this.state.agents.options.push({
                id: agent.id,
                name: agent.name,
                photo: agent.photo,
                selected: false
            });
        });
    }

    onFetchedDepartmentsFilter (result) {
        this.state.department.options = [];

        _.map(result, (department) => {
            this.state.department.options.push({
                id: department.id,
                name: department.name,
                selected: false
            });
        });
    }

    onSettingSelectedOptions (filterId, id) {
        const filter = {};

        if (this.state[filterId].selectedOptionsId) {
            const selectedOptionsId = this.state[filterId].selectedOptionsId.split(',');

            selectedOptionsId.push(id);
            this.state[filterId].selectedOptionsId = selectedOptionsId.join(',');
        } else {
            this.state[filterId].selectedOptionsId = id.toString();
        }

        filter[filterId] = this.state[filterId];
        this.setState(filter);
    }

    onRemovingSelectedOptions (filterId, id) {
        const filter = {};
        const selectedOptionsId = _.remove(this.state[filterId].selectedOptionsId.split(','), (optionId) => {
            return optionId !== id.toString();
        });


        this.state[filterId].selectedOptionsId = selectedOptionsId.join(',');

        filter[filterId] = this.state[filterId];
        this.setState(filter);
    }

    onRemovingAllSelectedOptions (filterId) {
        const filter = {};

        this.state[filterId].selectedOptionsId = '';
        filter[filterId] = this.state[filterId];
        this.setState(filter);
    }

    onUpdatingFilter (params) {
        const filter = {};

        if (params.optionIndex === -1) {
            _.map(this.state[params.filterId].options, (option, key) => {
                this.state[params.filterId].options[key].selected = params.all ? false : true;

                if (params.all) {
                    this.onRemovingAllSelectedOptions(params.filterId);
                } else {
                    this.onSettingSelectedOptions(params.filterId, this.state[params.filterId].options[key].id);
                }
            });
            filter[params.filterId] = this.state[params.filterId];
            this.setState(filter);
            return;
        }

        if (this.state[params.filterId].multiple) {
            this.state[params.filterId].options[params.optionIndex].selected = !this.state[params.filterId].options[params.optionIndex].selected;

            if (this.state[params.filterId].options[params.optionIndex].selected) {
                this.onSettingSelectedOptions(params.filterId, this.state[params.filterId].options[params.optionIndex].id);
            } else {
                this.onRemovingSelectedOptions(params.filterId, this.state[params.filterId].options[params.optionIndex].id);
            }
        } else {
            _.map(this.state[params.filterId].options, (option, key) => {
                if (key === params.optionIndex) {
                    this.state[params.filterId].options[key].selected = true;
                    this.onSettingSelectedOptions(params.filterId, this.state[params.filterId].options[key].id);
                } else {
                    this.state[params.filterId].options[key].selected = false;
                    this.onRemovingSelectedOptions(params.filterId, this.state[params.filterId].options[key].id);
                }
            });
        }

        filter[params.filterId] = this.state[params.filterId];
        this.setState(filter);
    }

    onClearingAllSelecteds (filter) {
        if (filter) {
            if (this.state[filter].options && this.state[filter].options.length) {
                this.state[filter].selectedOptionsId = '';
                _.map(this.state[filter].options, (option) => {
                    option.selected = false;
                });
            }
        } else {
            _.map(this.state, (type) => {
                if (type.options && type.options.length) {
                    type.selectedOptionsId = '';
                    _.map(type.options, (option) => {
                        option.selected = false;
                    });
                }
            });
        }
    }
}


export default alt.createStore(FilterStore, 'FilterStore');
