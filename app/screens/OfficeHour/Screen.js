import React from 'react';
import _ from 'lodash';
import {
    Card,
    OMZTable,
    FloatButton,
    Button,
    Icon,
    Switcher,
    AddEditOfficeHour,
    InputCheckbox
} from 'app/screens/Components';

class View extends React.Component {
    constructor (props) {
        super(props);

        this.fetchAll = this.fetchAll.bind(this);
        this.getParent = this.getParent.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.toggleOfficeHourModal = this.toggleOfficeHourModal.bind(this);
        this.deleteOfficeHour = this.deleteOfficeHour.bind(this);
        this.saveOfficeHour = this.saveOfficeHour.bind(this);
    }

    componentWillUnmount () {
        this.props.officeHoursActions.resetAll();
    }

    getParent () {
        return document.querySelector('.office-hour');
    }

    fetchAll (reset = false) {
        const header = this.props.tableStore.officeHour.selectedHeader;

        if (!(this.props.officeHoursStore.status === 'ENDED' && !reset || this.props.officeHoursStore.status === 'LOADING')) {
            const params = {
                reset: reset,
                accountId: this.props.currentUserStore.information.account.id,
                headerId: header ? header.id : '',
                orderDirection: header ? header.direction : '',
                state: this.props.filterStore.state.selectedOptionsId
            };

            this.props.officeHoursActions.fetchAll(params);
        }
    }

    deleteOfficeHour (officeHourSelected) {
        const officeHours = [];

        if (officeHourSelected instanceof Object) {
            officeHours.push(officeHourSelected.id);
        } else {
            _.map(this.props.officeHoursStore.officeHours, (officeHour) => {
                if (officeHour.selected) {
                    officeHours.push(officeHour.id);
                }
            });
        }

        this.props.officeHoursActions.deleteOfficeHours(
            officeHours,
            this.props.currentUserStore.information.account.id,
            () => this.fetchAll(true)
        );
    }

    handleChange () {
        const officeHour = {
            name: this.addEditOfficeHour.name.state.value,
            hour: {
                from: this.addEditOfficeHour.hourFrom.state.value,
                to: this.addEditOfficeHour.hourTo.state.value
            },
            interval: {
                from: this.addEditOfficeHour.intervalFrom.state.value,
                to: this.addEditOfficeHour.intervalTo.state.value
            }
        };

        this.props.officeHoursActions.updateCurrentOfficeHour(officeHour);
    }

    toggleOfficeHourModal () {
        this.props.viewsActions.toggleModalState('showAddEdit', 'officeHourView');
    }

    handleClose () {
        this.props.officeHoursActions.changeCurrentOfficeHour(false);
        this.toggleOfficeHourModal();
    }

    saveOfficeHour (e) {
        e.preventDefault();

        this.props.officeHoursActions.save(
            this.props.currentUserStore.information.account.id,
            this.props.officeHoursStore.currentOfficeHour,
            () => this.fetchAll(true)
        );
        this.handleClose();
    }

    render () {
        const tableData = {
            headers: this.props.tableStore.officeHour.headers,
            allChecked: this.props.officeHoursStore.allChecked
        };
        const officeHoursSelected = _.filter(this.props.officeHoursStore.officeHours, (officeHour) => {
            if (officeHour.selected) {
                return officeHour;
            }
        });

        tableData.items = _.map(this.props.officeHoursStore.officeHours, (officeHourItem, index) => {
            const row = {
                selected: officeHourItem.selected,
                fields: [
                    {
                        id: 'name',
                        type: 'data',
                        content: (
                            <span className="OMZTable__content__container__row__data__text">
                                {officeHourItem.name}
                            </span>
                        )
                    },
                    {
                        id: 'period',
                        type: 'data',
                        content: (
                            <span className="OMZTable__content__container__row__data__text">
                                {officeHourItem.periodLabel}
                            </span>
                        )
                    },
                    {
                        id: 'hour',
                        type: 'data',
                        content: (
                            <span className="OMZTable__content__container__row__data__text">
                                {officeHourItem.hour}
                            </span>
                        )
                    },
                    {
                        id: 'interval',
                        type: 'data',
                        content: (
                            <span className="OMZTable__content__container__row__data__text">
                                {officeHourItem.interval}
                            </span>
                        )
                    },
                    {
                        id: 'state',
                        type: 'data',
                        content: (
                            <Switcher
                                on={officeHourItem.state === 'ACTIVE'}
                                onClick={() => this.props.officeHoursActions.toggleState(
                                    officeHourItem,
                                    index,
                                    this.props.currentUserStore.information.id
                                )}
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
                                handleClick={() => {
                                    this.props.officeHoursActions.changeCurrentOfficeHour(officeHourItem);
                                    this.toggleOfficeHourModal();
                                }}
                            />,
                            <Icon
                                name="trash"
                                width="14px"
                                height="15px"
                                padding="8px 10.5px"
                                iconColor="blue"
                                bkgColor="white"
                                bkgCircle={true}
                                bkgBorder="gray-octonary"
                                inline={true}
                                clickable={true}
                                handleClick={() => this.deleteOfficeHour(officeHourItem)}
                            />
                        ]
                    }
                ]
            };

            return row;
        });

        const parsedTimezones = () => {
            const timezones = [];

            _.map(this.props.officeHoursStore.timezones, (timezone, key) => {
                timezones.push({
                    id: timezone.id,
                    selected: false,
                    content: (
                        <p className="text--tertiary">{timezone.name}</p>
                    )
                });
            });
            return timezones;
        };

        const parsedPeriods = () => {
            const periods = [];

            _.map(this.props.officeHoursStore.currentOfficeHour.period, (day, dayKey) => {
                periods.push({
                    id: dayKey,
                    selected: false,
                    content: (
                        <div className="row">
                            <div className="options__text columns large-2">
                                <InputCheckbox
                                    id={`check-${day.name}`}
                                    name={day.name}
                                    checked={day.selected}
                                    onChange={() => this.props.officeHoursActions.updateSelectPeriods(dayKey)}
                                />
                            </div>
                            <div className="options__text columns large-10">
                                <label htmlFor={`check-${day.name}`}>{day.name}</label>
                            </div>
                        </div>
                    )
                });
            });
            return periods;
        };

        const parseNameDay = (day) => {
            switch (day) {
                case 0 :
                    return 'Domingo';
                case 1 :
                    return 'Segunda';
                case 2 :
                    return 'Terça';
                case 3 :
                    return 'Quarta';
                case 4 :
                    return 'Quinta';
                case 5 :
                    return 'Sexta';
                case 6 :
                    return 'Sábado';
            }
        };

        const parsePeriodLabel = (officeHour) => {
            const week = [];

            _.map(officeHour, (day) => {
                week.push(day.selected);
            });

            if (week.indexOf(true) > -1) {
                if (week.every((day) => day === true)) {
                    return 'Todos os dias';
                }

                const period = [];
                let hasSequel = false;
                let firstSequel;
                let lastSequel;

                _.map(week, (validDay, dayIndex) => {
                    if (validDay) {
                        period.push(parseNameDay(dayIndex));
                    }

                    if (validDay && week[dayIndex - 1] && week[dayIndex + 1]) {
                        hasSequel = true;
                    }

                    if (validDay && !week[dayIndex - 1] && !firstSequel) {
                        firstSequel = firstSequel ? '' : parseNameDay(dayIndex);
                    }

                    if (validDay && !week[dayIndex + 1] && !lastSequel) {
                        lastSequel = lastSequel ? '' : parseNameDay(dayIndex);
                    }
                });

                if (period.length > 2 && hasSequel) {
                    const periodLabel = [];
                    const sequelLabel = `${firstSequel} à ${lastSequel}`;
                    let onSequel = false;

                    _.map(period, (day, index) => {
                        if (day === firstSequel) {
                            onSequel = true;
                        }

                        if (onSequel) {
                            if (periodLabel.indexOf(sequelLabel) === -1) {
                                periodLabel.push(sequelLabel);
                            }
                        } else {
                            periodLabel.push(day);
                        }

                        if (day === lastSequel) {
                            onSequel = false;
                        }
                    });

                    return periodLabel.join(', ');
                }

                return period.join(', ');
            }

            return null;
        };

        const periodLabel = parsePeriodLabel(this.props.officeHoursStore.currentOfficeHour.period);

        return (
            <section className="office-hour">
                <div className="office-hour__container">
                    <Card
                        helpers="card--full-height card--header-padding"
                        contentPadded={true}
                        title="Horário de atendimento"
                    >
                        <div className="row">
                            <div className="large-8 columns rythm--margin-b-1">
                                <span className="card__description">
                                    Ao definir um horário de atendimento, seu cliente será informado sobre a
                                    disponibilidade de sua equipe.
                                </span>
                            </div>
                            <div className="large-2 columns text-right rythm--margin-b-1">
                                <Button
                                    className="vTop"
                                    size="big"
                                    color="green"
                                    handleOnClick={this.toggleOfficeHourModal}
                                >
                                    <Icon
                                        name="add-clock"
                                        padding="2px 0"
                                        width="28px"
                                        inline={true}
                                    />
                                </Button>
                            </div>
                        </div>
                        <AddEditOfficeHour
                            ref={(c) => this.addEditOfficeHour = c}
                            isOpen={this.props.viewsStore.modal.officeHourView.showAddEdit}
                            data={this.props.officeHoursStore.currentOfficeHour}
                            period={periodLabel ? periodLabel : ''}
                            periodContainer={parsedPeriods()}
                            timezones={this.props.officeHoursStore.timezones}
                            timezonesContainer={parsedTimezones()}
                            timezoneChanged={this.props.officeHoursActions.updateSelectTimezones}
                            onChange={this.handleChange}
                            onClose={this.handleClose}
                            onSave={this.saveOfficeHour}
                            modalParentSelector={this.getParent}
                        />
                        <OMZTable
                            selectable={true}
                            data={tableData}
                            loadingData={this.props.officeHoursStore.status === 'LOADING'}
                            hasActions={true}
                            onTableBottom={this.fetchAll}
                            onCheck={(rowIndex, allChecked) => (
                                this.props.officeHoursActions.updateOfficeHourCheck(rowIndex, allChecked)
                            )}
                        />
                        {
                            officeHoursSelected.length ? (
                                <FloatButton
                                    position="bottom-right"
                                    handleClick={this.deleteOfficeHour}
                                />
                            ) : ''
                        }
                    </Card>
                </div>
            </section>
        );
    }
}

export default View;
