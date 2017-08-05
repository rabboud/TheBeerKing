import React from 'react';

class Timer extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            timeValue: props.seconds
        };

        this.timerObj = setInterval(() => this._handleCallback(props.callback), 1000);
    }

    _handleCallback (cb) {
        if (this.state.timeValue === 0) {
            clearInterval(this.timerObj);
            Reflect.apply(cb, {}, []);
        } else {
            this.setState({
                timeValue: this.state.timeValue - 1
            });
        }
    }

    componentWillUnmount () {
        clearInterval(this.timerObj);
    }

    render () {
        return (
            <div className={`Timer ${this.props.className || ''}`}>{this.state.timeValue}</div>
        );
    }
}

Timer.PropTypes = {
    className: React.PropTypes.string,
    seconds: React.PropTypes.number,
    callback: React.PropTypes.func
};

export default Timer;
