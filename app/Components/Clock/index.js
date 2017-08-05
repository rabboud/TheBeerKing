import React from 'react';
import Icon from '../Icon';
import {TimeHelper} from 'app/helpers';

class Clock extends React.Component {
    constructor (props) {
        super(props);

        const label = this._staticLabel();

        this.state = {
            clockLabel: label
        };

        this.firstTimeUpdate = false;
    }

    componentDidMount () {
        if (this.props.options.countTime) {
            this._timer();
            this.interval = setInterval(this._timer.bind(this), 1000);
        }
    }

    componentWillUpdate () {
        if (this.props.options.countTime) {
            if (!this.firstTimeUpdate) {
                this._timer();
                this.firstTimeUpdate = true;
            }
        } else {
            this.firstTimeUpdate = false;
        }
    }

    componentWillUnmount () {
        clearInterval(this.interval);
        this.firstTimeUpdate = false;
    }

    _timer () {
        if (this.props.startTime) {
            if (!this.props.endTime) {
                const currentDuration = TimeHelper.getDiffFromNow(this.props.startTime);

                this.setState({
                    clockLabel: TimeHelper.parseDuration(currentDuration)
                });
            } else {
                const finalDuration = TimeHelper.getDiff(this.props.startTime, this.props.endTime);

                this.setState({
                    clockLabel: TimeHelper.parseDuration(finalDuration)
                });
            }
        } else {
            this.setState({
                clockLabel: TimeHelper.parseDuration(0)
            });
        }
    }

    _staticLabel () {
        const format = this.props.options.format;
        let label;
        let interval;

        switch (this.props.options.show) {
            case 'startTime' :
                label = TimeHelper.formatDate(this.props.startTime, format);
                break;
            case 'endTime' :
                label = TimeHelper.formatDate(this.props.endTime, format);
                break;
            case 'intervalFromStart' :
                interval = TimeHelper.getDiffFromNow(this.props.startTime);
                label = TimeHelper.parseDateInterval(interval, format);
                break;
            case 'intervalFromEnd' :
                interval = TimeHelper.getDiffFromNow(this.props.endTime);
                label = TimeHelper.parseDateInterval(interval, format);
                break;
            default :
                label = TimeHelper.parseDuration(0);
                break;
        }

        return label;
    }

    render () {
        const options = this.props.options;
        const iconClass = options.background ? 'icon--rounded icon--bkg-opaque' : 'Clock--table icon--gray-primary';
        const sizeCSS = {};

        switch (options.size) {
            case 'normal':
                sizeCSS.width = '20px';
                sizeCSS.height = '20px';
                break;
            case 'small':
                sizeCSS.width = '12px';
                sizeCSS.height = '12px';
                break;
            default:
                sizeCSS.width = '20px';
                sizeCSS.height = '20px';
        }

        return (
            <Icon
                name="clock"
                iconClass={`icon--inline icon--margin ${iconClass}`}
                textClass={`icon-text--inline icon-text--vmiddle Clock__font-${this.props.size}`}
                width={sizeCSS.width}
                height={sizeCSS.height}
                padding="9px"
                iconText={this.state.clockLabel}
            />
        );
    }
}

Clock.PropTypes = {
    startTime: React.PropTypes.object,
    countTime: React.PropTypes.func,
    endTime: React.PropTypes.object,
    opaqueBkg: React.PropTypes.bool,
    options: React.PropTypes.object
};

export default Clock;
