import alt from 'app/flux/Alt';
import {officeHoursActions} from 'app/flux/Actions';
import {OfficeHoursModel} from 'app/flux/Model';
import _ from 'lodash';

class OfficeHoursStore {
    constructor () {
        this.state = {
            status: '',
            allChecked: false,
            officeHours: [],
            timezones: [],
            currentOfficeHour: {
                status: '',
                type: 'add',
                id: '',
                name: '',
                timezone: null,
                timezoneName: '',
                period: [
                    {
                        name: 'Domingo',
                        selected: false
                    },
                    {
                        name: 'Segunda',
                        selected: false
                    },
                    {
                        name: 'Terça',
                        selected: false
                    },
                    {
                        name: 'Quarta',
                        selected: false
                    },
                    {
                        name: 'Quinta',
                        selected: false
                    },
                    {
                        name: 'Sexta',
                        selected: false
                    },
                    {
                        name: 'Sábado',
                        selected: false
                    }
                ],
                hour: {
                    from: '',
                    to: ''
                },
                interval: {
                    from: '',
                    to: ''
                }
            }
        };

        this.bindActions(officeHoursActions);
    }

    onResettingAll () {
        this.state.officeHours = [];
        this.state.status = '';
    }

    onFetchingTimezones (params) {
        this.state.status = params.status;
    }

    onFetchedTimezones (params) {
        this.state.status = params.status;

        if (params.status === 'TIMEOUT' || params.status === 'ERROR') {
            return;
        }

        if (!params.results) {
            this.state.status = 'ENDED';
            return;
        }

        _.map(params.results, (timezone) => {
            const timezoneObj = {
                id: timezone.id,
                name: timezone.name
            };

            this.state.timezones.push(timezoneObj);
        });
    }

    onFetchingAll (params) {
        this.state.status = params.status;
    }

    onFetchedAll (params) {
        this.state.status = params.status;

        if (params.status === 'TIMEOUT' || params.status === 'ERROR') {
            return;
        }

        if (!params.results) {
            this.state.status = 'ENDED';
            return;
        }

        _.map(params.results.office_hours, (officeHour) => {
            this.state.officeHours.push(new OfficeHoursModel(officeHour));
        });
    }

    onTogglingState (params) {
        this.state.officeHours[params.officeHourKey].state = params.officeHour.state === 'INACTIVE' ? 'ACTIVE' : 'INACTIVE';
        this.setState({
            officeHours: this.state.officeHours
        });
    }

    onToggledState (params) {
        if (params.error) {
            this.state.officeHours[params.officeHourKey].state = params.officeHour.state === 'INACTIVE' ? 'ACTIVE' : 'INACTIVE';
            this.setState({
                officeHours: this.state.officeHours
            });
        }
    }

    onDeletingOfficeHours (params) {
        this.setState({
            status: params.status
        });
    }

    onDeletedOfficeHours (params) {
        if (params.error) {
            this.state.status = params.status;
        } else {
            this.state.status = '';
        }

        this.setState({
            status: this.state.status
        });
    }

    updatingOfficeHourCheck (params) {
        const changeCheck = (state) => {
            _.map(this.state.officeHours, (officeHour) => {
                officeHour.selected = state;
            });
        };

        if (params.officeHourIndex === -1) {
            if (params.allChecked) {
                changeCheck(false);
            } else {
                changeCheck(true);
            }
        } else {
            this.state.officeHours[params.officeHourIndex].selected = !this.state.officeHours[params.officeHourIndex].selected;
        }

        this.setState({
            officeHours: this.state.officeHours
        });
    }

    onUpdatingCurrentOfficeHour (officeHour) {
        this.state.currentOfficeHour.name = officeHour.name;
        this.state.currentOfficeHour.hour.from = officeHour.hour.from;
        this.state.currentOfficeHour.hour.to = officeHour.hour.to;
        this.state.currentOfficeHour.interval.from = officeHour.interval.from;
        this.state.currentOfficeHour.interval.to = officeHour.interval.to;

        this.setState({
            currentOfficeHour: this.state.currentOfficeHour
        });
    }

    onUpdatingSelectPeriods (day) {
        this.state.currentOfficeHour.period[day].selected = !this.state.currentOfficeHour.period[day].selected;

        this.setState({
            currentOfficeHour: this.state.currentOfficeHour
        });
    }

    onUpdatingSelectTimezones (timezoneId) {
        const timezoneName = this.state.timezones.filter((timezone) => timezone.id === timezoneId);

        this.state.currentOfficeHour.timezoneName = timezoneName[0].name;
        this.state.currentOfficeHour.timezone = timezoneId;

        this.setState({
            currentOfficeHour: this.state.currentOfficeHour
        });
    }

    onChangingCurrentOfficeHour (officeHour) {
        if (officeHour) {
            const timezoneName = this.state.timezones.filter((timezone) => timezone.id === officeHour.timezoneId);

            this.state.currentOfficeHour.id = officeHour.id;
            this.state.currentOfficeHour.name = officeHour.name;
            this.state.currentOfficeHour.type = 'edit';
            _.map(this.state.currentOfficeHour.period, (day, index) => {
                day.selected = officeHour.period[index];
            });
            this.state.currentOfficeHour.hour = {
                from: officeHour.startTime,
                to: officeHour.endTime
            };
            this.state.currentOfficeHour.interval = {
                from: officeHour.intervalStartTime,
                to: officeHour.intervalEndTime
            };
            this.state.currentOfficeHour.timezone = officeHour.timezoneId;
            this.state.currentOfficeHour.timezoneName = timezoneName[0].name;
            this.state.currentOfficeHour.action = 'Editar horário de atendimento';
        } else {
            this.state.currentOfficeHour = {
                status: '',
                type: 'add',
                id: '',
                name: '',
                timezone: null,
                timezoneName: '',
                period: [
                    {
                        name: 'Domingo',
                        selected: false
                    },
                    {
                        name: 'Segunda',
                        selected: false
                    },
                    {
                        name: 'Terça',
                        selected: false
                    },
                    {
                        name: 'Quarta',
                        selected: false
                    },
                    {
                        name: 'Quinta',
                        selected: false
                    },
                    {
                        name: 'Sexta',
                        selected: false
                    },
                    {
                        name: 'Sábado',
                        selected: false
                    }
                ],
                hour: {
                    from: '',
                    to: ''
                },
                interval: {
                    from: '',
                    to: ''
                }
            };
            this.state.currentOfficeHour.action = 'Cadastro de horário de atendimento';
        }

        this.setState({
            currentOfficeHour: this.state.currentOfficeHour
        });
    }

    onSaving (params) {
        this.state.currentOfficeHour.status = params.status;
    }

    onSaved (params) {
        this.state.currentOfficeHour.status = params.status;
    }
}

export default alt.createStore(OfficeHoursStore, 'officeHoursStore');
