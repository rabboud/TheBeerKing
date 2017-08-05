import React from 'react';
import _ from 'lodash';
import Icon from '../Icon';
import Action from './Action';
import Loader from '../Loader';

class Component extends React.Component {
    render () {
        return (<div>
            {
                this.props.panel ? (
                    <div className="table__panel">
                        {this.props.panel}
                    </div>
                ) : ''
            }
            <table className="table" ref={(c) => this.table = c}>
                <thead>
                    <tr>
                        {_.map(this.props.cols, (label) => {
                            const tableHeader = this.props.handleFilterOnClick ? (<th className="table__title table__title--uppercase" key={label.key} onClick={(e) => this.props.handleFilterOnClick(e, label.key)}>
                                {label.label}
                                <div className="table__sort">
                                    <Icon name="chevron" iconClass="rythm--margin-b-1" width="6px" height="3px"/>
                                    <Icon name="chevron" width="6px" height="3px" rotate="180"/>
                                </div>
                            </th>) : (<th className="table__title {handleFilterOnClick ? 'table__title--uppercase' : ''}" key={label.key}>
                                {label.label}
                            </th>);

                            return tableHeader;
                        })}
                        {
                            this.props.actions ? (
                                <th className="table__title table__title--actions">
                                    {
                                        (this.props.cols.length <= 4 && this.props.headerActions) ? (<div className="table__nav">
                                            <Action actions={this.props.headerActions} />
                                        </div>) : (this.props.actionName || 'Ações')
                                    }
                                </th>
                            ) : ''
                        }
                    </tr>
                </thead>
                <tbody className="table__body">
                    {
                        (this.props.data.length === 0 && this.props.emptyText) ? (<tr className="table__row">
                            <td colSpan="7">{this.props.emptyText}</td>
                        </tr>) : (_.map(this.props.data, (item) => {
                            const cells = _.map(this.props.cols, (colData) => {
                                return <td key={colData.key} className="table__column">{item[colData.key]}</td>;
                            });
                            const actionList = this.props.actions ? (
                                <td>
                                    <Action id={item.id} actions={this.props.actions} />
                                </td>
                            ) : '';
                            const tableRow = this.props.handleOnClick ? (<tr className="table__row" data-clickable="true" key={item.id} onClick={(e) => this.props.handleOnClick(e, item.id)} data-selected={item.id === this.props.currentId}>
                                {cells}
                                {actionList}
                            </tr>) : (<tr className="table__row" key={item.id} ref="tableRow">
                                {cells}
                                {actionList}
                            </tr>);

                            return tableRow;
                        }))
                    }
                </tbody>
            </table>
            {
                this.props.loading ? (
                    <div className="table__loader-wrapper">
                        <Loader />
                    </div>
                ) : ''
            }
        </div>);
    }
}

Component.propTypes = {
    panel: React.PropTypes.element,
    labels: React.PropTypes.array,
    data: React.PropTypes.array,
    actions: React.PropTypes.array,
    headerActions: React.PropTypes.array,
    loading: React.PropTypes.bool,
    actionName: React.PropTypes.string,
    emptyText: React.PropTypes.string,
    handleOnClick: React.PropTypes.func,
    handleFilterOnClick: React.PropTypes.func,
    currentId: React.PropTypes.string
};

export default Component;
