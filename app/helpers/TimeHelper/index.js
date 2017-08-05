import Moment from 'moment';

class TimeHelper {

    static getDiffFromNow (timestamp, utc = false, format) {
        const start = Moment(timestamp);
        const now = Moment();
        const diff = now.diff(start);
        const time = utc ? Moment.utc(diff) : diff;
        let formatted = '';

        if (format) {
            const timeString = `${time.hours() > 0 ? time.hours() + 'h' : ''} ${time.minutes()} min`;

            formatted = format !== 'HH[h] mm[min]' ? time.format(format) : timeString;
        }

        return formatted !== '' ? formatted : time;
    }

    static getDiff (start, end) {
        const startTime = start instanceof Moment ? start : Moment(start);
        const endTime = end instanceof Moment ? end : Moment(end);

        return endTime.diff(startTime);
    }

    static parseDuration (duration) {
        const time = {
            hours: Math.floor(duration / 1000 / 60 / 60),
            minutes: Math.floor(duration / 1000 / 60 % 60),
            seconds: Math.floor(duration / 1000 % 60)
        };

        Object.keys(time).map((key, index) => {
            time[key] = time[key] < 10 ? `0${time[key]}` : `${time[key]}`;
        });

        return `${time.hours}:${time.minutes}:${time.seconds}`;
    }

    static formatDate (date, format) {
        let editedDate = '';

        if (!format) {
            editedDate = Moment(date).format('DD-MM-YYYY');
        } else {
            editedDate = Moment(date).format(format);
        }

        return editedDate.replace(/\-/g, '/');
    }

    static parseDateInterval (duration) {
        const durationSec = duration / 1000;

        return Moment.duration(durationSec, 'seconds').humanize();
    }

    static getDiffFromNowHumanized (date) {
        return this.parseDateInterval(this.getDiffFromNow(date));
    }
 }

export default TimeHelper;
