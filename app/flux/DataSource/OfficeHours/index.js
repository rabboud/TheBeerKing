import Request from '../request';
import Settings from './settings';

const oldResource = Settings.URI;
const resource = Settings.URI_LIST;
const resourceChange = Settings.URI_CHANGE;
const resourceTimezones = Settings.URI_TIMEZONES;

class OfficeHoursDataSource {
    static fetchAll (receiveParams) {
        const params = {
            set: {
                'Content-Type': 'text/plain'
            }
        };

        return Request.do('GET', `${resource}?accountId=${receiveParams.accountId}`, params);
    }

    static fetchTimezones () {
        const params = {
            set: {
                'Content-Type': 'text/plain'
            }
        };

        return Request.do('GET', `${resourceTimezones}`, params);
    }

    static inactiveOfficeHour (officeHourId, agentId) {
        const params = {
            set: {
                'Content-Type': 'application/json'
            },
            send: {
                'agentId': agentId
            }
        };

        return Request.do('PUT', `${resourceChange}/${officeHourId}/inactive`, params);
    }

    static activeOfficeHour (officeHourId, agentId) {
        const params = {
            set: {
                'Content-Type': 'application/json'
            },
            send: {
                'agentId': agentId
            }
        };

        return Request.do('PUT', `${resourceChange}/${officeHourId}/active`, params);
    }

    static deleteOfficeHours (officeHourId, agentId) {
        const params = {
            set: {
                'Content-Type': 'application/json'
            },
            send: {
                'agentId': agentId
            }
        };

        return Request.do('DELETE', `${resourceChange}/${officeHourId}`, params);
    }

    static verify (id) {
        const params = {
            set: {
                'Content-Type': 'text/plain'
            }
        };

        return Request.do('GET', `${oldResource}/check/${id}`, params);
    }

    static create (accountId, officeHour, period) {
        const params = {
            set: {
                'Content-Type': 'application/json'
            },
            send: {
                accountId: accountId,
                timezone: officeHour.timezone,
                name: officeHour.name,
                sunday: period[0],
                monday: period[1],
                tuesday: period[2],
                wednesday: period[3],
                thursday: period[4],
                friday: period[5],
                saturday: period[6],
                startTime: officeHour.hour.from,
                endTime: officeHour.hour.to,
                intervalStartTime: officeHour.interval.from,
                intervalEndTime: officeHour.interval.to
            }
        };

        return Request.do('POST', `${resourceChange}`, params);
    }

    static edit (officeHour, period) {
        const params = {
            set: {
                'Content-Type': 'application/json'
            },
            send: {
                id: officeHour.id,
                timezone: officeHour.timezone,
                name: officeHour.name,
                sunday: period[0],
                monday: period[1],
                tuesday: period[2],
                wednesday: period[3],
                thursday: period[4],
                friday: period[5],
                saturday: period[6],
                startTime: officeHour.hour.from,
                endTime: officeHour.hour.to,
                intervalStartTime: officeHour.interval.from,
                intervalEndTime: officeHour.interval.to
            }
        };

        return Request.do('PUT', `${resourceChange}/${officeHour.id}`, params);
    }
}

export default OfficeHoursDataSource;
