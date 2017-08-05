import React from 'react';
import ReactDOMServer from 'react-dom/server';
import * as d3 from 'd3';
import c3 from 'c3';
import _ from 'lodash';
import Moment from 'moment';

class ChartArea extends React.Component {
    constructor (props) {
        super(props);
    }

    componentDidMount () {
        this._renderChart();
    }

    componentDidUpdate () {
        if (this.chart) {
            this.chart.load({
                columns: this.props.data
            });
        }
    }

    _renderChart () {
        const localized = {
            'decimal': ',',
            'thousands': '.',
            'grouping': [3],
            'currency': ['R$', ''],
            'dateTime': '%d/%m/%Y %H:%M:%S',
            'date': '%d/%m/%Y',
            'time': '%H:%M:%S',
            'periods': ['AM', 'PM'],
            'days': ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
            'shortDays': ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
            'months': ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            'shortMonths': ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
        };

        d3.timeFormatDefaultLocale(localized);

        this.chart = c3.generate({
            bindto: `#${this.props.name}`,
            data: {
                x: 'date',
                xFormat: '%Y-%m-%dT%H:%M:%S',
                columns: this.props.data,
                types: {
                    'Atendidos': 'area-spline',
                    'Não Atendidos': 'area-spline'
                },
                colors: {
                    'Atendidos': '#4ea2e0',
                    'Não Atendidos': '#c96dd8'
                }
            },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        outer: false,
                        format: d3.timeFormat('%a'),
                        count: 7
                    }
                },
                y: {
                    type: 'categorized',
                    tick: {
                        outer: false,
                        format: d3.format('.0f'),
                        fit: true,
                        count: 4
                    }
                }
            },
            grid: {
                y: {
                    show: true
                }
            },
            legend: {
                position: 'right'
            },
            tooltip: {
                contents: (d, defaultTitleFormat, defaultValueFormat, color) => {
                    return ReactDOMServer.renderToString(
                        <div className="ChartArea__tooltip">
                            {_.map(d, (data, key) => {
                                return (
                                    <p
                                        className="ChartArea__tooltip__text"
                                        key={key}
                                    >
                                        {data.value} {data.name}
                                    </p>
                                );
                            })}
                            <p
                                className="ChartArea__tooltip__date"
                            >
                                {Moment(d[0].x).format('DD/MM HH:mm')}
                            </p>
                        </div>
                    );
                }
            }
        });
    }

    render () {
        return (
            <div id={this.props.name} className={`ChartArea ${this.props.className}`} ref={(c) => this.container = c}/>
        );
    }
}

ChartArea.propTypes = {
    className: React.PropTypes.string,
    name: React.PropTypes.string,
    data: React.PropTypes.array
};

ChartArea.defaultProps = {
    className: '',
    name: 'ChartArea',
    data: []
};

export default ChartArea;
