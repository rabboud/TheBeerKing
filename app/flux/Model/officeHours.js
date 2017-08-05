import _ from 'lodash';

class Model {
    constructor (officeHour) {
        this.id = officeHour && officeHour.id !== null ? officeHour.id : '';
        this.name = officeHour && officeHour.name !== null ? officeHour.name : '';

        this.periodLabel = officeHour ? this.parsePeriodLabel(officeHour) : '';
        this.period = officeHour ? this.parsePeriod(officeHour) : '';

        this.hour = officeHour && officeHour.startTime !== null && officeHour.endTime !== null
            ? this.parseHour(
                officeHour.startTime,
                officeHour.endTime
            )
            : '';
        this.startTime = officeHour && officeHour.startTime !== null
            ? officeHour.startTime
            : '';
        this.endTime = officeHour && officeHour.endTime !== null
            ? officeHour.endTime
            : '';
        this.interval = officeHour && officeHour.intervalStartTime !== null && officeHour.intervalEndTime !== null
            ? this.parseHour(
                officeHour.intervalStartTime,
                officeHour.intervalEndTime
            )
            : '';
        this.intervalStartTime = officeHour && officeHour.intervalStartTime !== null
            ? officeHour.intervalStartTime
            : '';
        this.intervalEndTime = officeHour && officeHour.intervalEndTime !== null
            ? officeHour.intervalEndTime
            : '';
        this.timezoneId = officeHour && officeHour.timezone !== null ? officeHour.timezone.id : '';
        this.state = officeHour && officeHour.ativo !== null
            ? this.parseState(officeHour.ativo)
            : 'INACTIVE';
        this.selected = false;
    }

    parseState (state) {
        switch (state) {
            case 1:
                return 'ACTIVE';
            case 0:
                return 'INACTIVE';
            default:
                return 'INACTIVE';
        }
    }

    parsePeriod (officeHour) {
        return ([
            officeHour.sunday,
            officeHour.monday,
            officeHour.tuesday,
            officeHour.wednesday,
            officeHour.thursday,
            officeHour.friday,
            officeHour.saturday
        ]);
    }

    parseNameDay (day) {
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
    }

    parseHour (startTime, endTime) {
        if (startTime && endTime) {
            return `${startTime} às ${endTime}`;
        }

        return 'Não informado';
    }

    parsePeriodLabel (officeHour) {
        const week = this.parsePeriod(officeHour);

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
                    period.push(this.parseNameDay(dayIndex));
                }

                if (validDay && week[dayIndex - 1] && week[dayIndex + 1]) {
                    hasSequel = true;
                }

                if (validDay && !week[dayIndex - 1] && !firstSequel) {
                    firstSequel = firstSequel ? '' : this.parseNameDay(dayIndex);
                }

                if (validDay && !week[dayIndex + 1] && !lastSequel) {
                    lastSequel = lastSequel ? '' : this.parseNameDay(dayIndex);
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
    }
}

export default Model;
