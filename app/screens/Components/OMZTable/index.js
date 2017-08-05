import React from 'react';
import _ from 'lodash';
import Ordering from '../Ordering';
import {InputCheckbox} from '../Form';
import InfiniteList from '../InfiniteList';
import Loader from '../Loader';


class OMZTable extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            columnSizes: {}
        };
    }
    componentDidMount () {
        this._resizeColumns();
    }

    componentDidUpdate () {
        this._resizeColumns();
    }

    _resizeColumns () {
        if (!this.table.childNodes[0].childNodes.length) {
            return;
        }

        let hasChanged = false;
        const firstResize = _.isEmpty(this.state.columnSizes);
        const sizes = {};

        _.map(this.table.childNodes[0].childNodes[0].childNodes, (column, key) => {
            if (column.offsetWidth) {
                if (this.state.columnSizes[column.id] && this.state.columnSizes[column.id] !== column.offsetWidth) {
                    hasChanged = true;
                }

                sizes[column.id] = column.offsetWidth;
            }
        });

        if (hasChanged || firstResize) {
            this.setState({
                columnSizes: sizes
            });
        }
    }

    render () {
        const itemsSelected = _.filter(this.props.data.items, (item) => {
            return item.selected ? item : '';
        });

        return (
            <div className={`OMZTable ${this.props.className}`}>
                <div className="OMZTable__headers__container">
                    <table ref={(c) => this.headers = c} className="OMZTable__headers" cellSpacing="0">
                        <thead className="OMZTable__headers__head">
                            <tr className="OMZTable__headers__head__row">
                                {
                                    this.props.selectable ? (
                                        <th
                                            className="OMZTable__headers__head__row__header OMZTable__headers__head__row__header--small"
                                            style={
                                                this.state.columnSizes.tableCheckbox
                                                    ? {width: this.state.columnSizes.tableCheckbox}
                                                    : {}
                                            }
                                        >
                                            <InputCheckbox
                                                id="selectAll"
                                                name="tags"
                                                checked={
                                                    this.props.data.items.length > 0
                                                    && (itemsSelected.length === this.props.data.items.length)
                                                }
                                                onClick={(e) => e.stopPropagation()}
                                                onChange={
                                                    () => {
                                                        this.props.onCheck(
                                                            -1,
                                                            itemsSelected.length === this.props.data.items.length
                                                        );
                                                    }
                                                }
                                            />
                                        </th>
                                    ) : null
                                }
                                {
                                    _.map(this.props.data.headers, (item, key) => {
                                        if (this.props.hideColumns.indexOf(item.id) === -1) {
                                            return (
                                                <th
                                                    key={key}
                                                    className="OMZTable__headers__head__row__header"
                                                    style={
                                                        this.state.columnSizes[item.id]
                                                            ? {width: this.state.columnSizes[item.id]}
                                                            : {}
                                                    }
                                                    data-clickable={item.hasOrder}
                                                    onClick={
                                                        () => {
                                                            if (item.hasOrder) {
                                                                this.props.onHeaderClick(item.id);
                                                            }
                                                        }
                                                    }
                                                >
                                                    <span className="OMZTable__headers__name">{item.name}</span>
                                                    {
                                                        item.hasOrder ? (
                                                            <Ordering
                                                                className="OMZTable__headers__head__row__header__ordering rythm--center"
                                                                direction={item.direction}
                                                            />
                                                        ) : null
                                                    }
                                                </th>
                                            );
                                        }
                                    })
                                }
                                {
                                    this.props.hasActions ? (
                                        <th
                                            className="OMZTable__headers__head__row__header"
                                            style={
                                                this.state.columnSizes.actions
                                                    ? {width: this.state.columnSizes.actions}
                                                    : {}
                                            }
                                        />
                                    ) : null
                                }
                            </tr>
                        </thead>
                    </table>
                </div>
                <InfiniteList
                    className="OMZTable__content"
                    type="table"
                    scrollDirection="vertical"
                    handleBottomList={this.props.onTableBottom}
                >
                    <table
                        ref={(c) => this.table = c}
                        className="OMZTable__content__container"
                        cellSpacing="0"
                    >
                        <tbody>
                            {_.map(this.props.data.items, (row, rowKey) => (
                                <tr
                                    className="OMZTable__content__container__row"
                                    key={rowKey}
                                    data-clickable={this.props.rowClickable}
                                    onClick={
                                        () => {
                                            if (this.props.rowClickable) {
                                                this.props.onRowClick(rowKey);
                                            }
                                        }
                                    }
                                    data-is-active={this.props.activeIndex === rowKey}
                                >
                                    {
                                        this.props.selectable ? (
                                            <td
                                                id="tableCheckbox"
                                                className="OMZTable__content__container__row__data OMZTable__content__container__row__data--small"
                                            >
                                                <InputCheckbox
                                                    id={`${rowKey}`}
                                                    name="tableCheck"
                                                    checked={row.selected}
                                                    onClick={(e) => e.stopPropagation()}
                                                    onChange={
                                                        () => {
                                                            this.props.onCheck(
                                                                rowKey,
                                                                itemsSelected.length === this.props.data.items.length
                                                            );
                                                        }
                                                    }
                                                />
                                            </td>
                                        ) : null
                                    }
                                    {
                                        _.map(row.fields, (column, columnKey) => {
                                            if (this.props.hideColumns.indexOf(column.id) === -1) {
                                                return (
                                                    <td
                                                        id={column.id}
                                                        className={
                                                            `OMZTable__content__container__row__data ${column.type === 'action'
                                                                ? 'OMZTable__content__container__row__data__actions'
                                                                : ''}`
                                                        }
                                                        key={columnKey}
                                                        data-position={column.position}
                                                    >
                                                        {
                                                            column.type === 'action' ? (
                                                                <span>
                                                                {
                                                                    _.map(column.actions, (action, actionKey) => (
                                                                        <span
                                                                            className="OMZTable__content__container__row__data__actions__action"
                                                                            key={actionKey}
                                                                        >
                                                                            {action}
                                                                        </span>
                                                                    ))
                                                                }
                                                                </span>
                                                            ) : (
                                                                <span>{column.content}</span>
                                                            )
                                                        }
                                                    </td>
                                                );
                                            }
                                        })
                                    }
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {
                        this.props.loadingData ? (
                            <Loader color="black"/>
                        ) : null
                    }
                </InfiniteList>
            </div>
        );
    }
}

OMZTable.PropTypes = {
    className: React.PropTypes.string,
    selectable: React.PropTypes.bool,
    activeIndex: React.PropTypes.number,
    rowClickable: React.PropTypes.bool,
    columns: React.PropTypes.array,
    data: React.PropTypes.array.isRequired,
    loadingData: React.PropTypes.bool,
    hasActions: React.PropTypes.bool,
    hideColumns: React.PropTypes.array,
    onTableBottom: React.PropTypes.func,
    onRowClick: React.PropTypes.func,
    onHeaderClick: React.PropTypes.func,
    onCheck: React.PropTypes.func
};

OMZTable.defaultProps = {
    hideColumns: [],
    onHeaderClick: () => {}
};

export default OMZTable;
