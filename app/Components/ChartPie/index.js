import React from 'react';
import c3 from 'c3';
import _ from 'lodash';

class ChartPie extends React.Component {
    constructor (props) {
        super(props);
        this.colors = {
            text: '#0B73C2',
            voice: '#2C8AD3',
            video: '#74B7EB',
            offcontact: '#FF33FF',
            email: '#6DEDB6',
            phone: '#22D88A',
            facebook: '#ADADF6',
            telegram: '#8080EE',
            meliMsg: '#6363D6',
            meliQst: '#AA1122'
        };
    }

    componentDidMount () {
        this._renderChart();
    }

    componentDidUpdate () {
        this._updateChart();
    }

    _updateChart () {
        if (this.chart) {
            const parsedData = this._parseData(this.props.data);

            if (_.isEmpty(parsedData.json)) {
                return;
            }

            this.chart.load({
                json: parsedData.json
            });
            this.chart.data.names(parsedData.names);
        }
    }

    _parseData (data) {
        const json = {};
        const names = {};
        const colors = {};

        _.map(data, (value, key) => {
            names[key] = `${this._getName(key)} - ${value}`;
            json[key] = parseInt(value, 10);
            colors[key] = this.colors[key];
        });

        return {
            json: json,
            names: names,
            colors: colors
        };
    }

    _getName (name) {
        switch (name) {
            case 'text':
                return 'Chat';
            case 'offcontact':
                return 'Recado';
            case 'voice':
                return 'Voz';
            case 'meliQst':
                return 'ML Pergunta';
            case 'meliMsg':
                return 'ML Mensagem';
            case 'phone':
                return 'Telecom';
            default:
                return name.charAt(0).toUpperCase() + name.slice(1);
        }
    }

    _renderChart () {
        this.chart = c3.generate({
            bindto: `#${this.props.name}`,
            data: {
                type: 'pie',
                json: [],
                keys: {
                    value: Object.keys(this.props.data)
                },
                colors: this.colors,
                names: {}
            },
            pie: {
                label: {
                    show: false
                }
            },
            legend: {
                position: 'right',
                item: {
                    tile: {
                        width: 10,
                        height: 10
                    }
                }
            },
            tooltip: {
                contents: (d, defaultTitleFormat, defaultValueFormat, color) => {
                    const percent = (d[0].ratio * 100).toFixed(2);

                    return `<div class=\"ChartPie__tooltip\"><p class=\"ChartPie__tooltip__text\">${percent}%</p></div>`;
                }
            }
        });
    }

    render () {
        return (
            <div id={this.props.name} className={`ChartPie ${this.props.className}`} ref={(c) => this.container = c}/>
        );
    }
}

ChartPie.PropTypes = {
    className: React.PropTypes.string,
    name: React.PropTypes.string,
    data: React.PropTypes.object
};

ChartPie.defaultProps = {
    className: '',
    name: 'ChartPie',
    data: {}
};

export default ChartPie;
