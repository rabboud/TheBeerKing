import React from 'react';
import {DateRangePicker} from 'react-dates';

class DatePicker extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <div className={`DatePicker ${this.props.className}`}>
                <DateRangePicker
                    startDate={this.props.startDate}
                    endDate={this.props.endDate}
                    onDatesChange={({startDate, endDate}) => this.props.onChange({startDate, endDate})}
                    focusedInput={this.props.focusedDate}
                    onFocusChange={this.props.onFocusChange}
                    numberOfMonths={1}
                    showDefaultInputIcon={true}
                    keepOpenOnDateSelect={true}
                    isOutsideRange={() => false}
                    daySize={30}
                    startDatePlaceholderText="Data inicial"
                    endDatePlaceholderText="Data final"
                />
            </div>
        );
    }
}

DatePicker.PropTypes = {
    className: React.PropTypes.string,
    focusedDate: React.PropTypes.object.isRequired,
    startDate: React.PropTypes.object.isRequired,
    endDate: React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func.isRequired,
    onFocusChange: React.PropTypes.func.isRequired
};

export default DatePicker;
