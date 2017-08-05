import React from 'react';
import _ from 'lodash';
import Tag from '../Tag';

class MultiSelect extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            options: this.props.options,
            results: [],
            selecteds: this.props.selecteds ? this.props.selecteds : [],
            resizeInput: 0,
            resizeContainer: 30,
            lastSizes: []
        };
    }

    componentDidMount () {
        this._updateSelecteds();
    }

    componentDidUpdate () {
        if (_.difference(this.props.selecteds, this.state.selecteds).length) {
            this._updateSelecteds();
        }
        this._resizeItems();
    }

    _resizeItems () {
        _.map(this.resultList.children, (item, key) => {
            if (item.clientHeight > 20) {
                if (item.className.indexOf('tall') === -1) {
                    item.className = item.className + ' MultiSelect__results__item--tall';
                }
            }
        });
    }

    _updateSelecteds () {
        this.setState(
            {
                resizeInput: 0,
                resizeContainer: 30,
                lastSizes: [],
                selecteds: this.props.selecteds
            },
            () => this._resizeInput('addAll')
        );
    }

    _showAllResults () {
        if (this.searchField.value) {
            return;
        }

        if (this.props.viewResults && !this.state.results.length) {
            this.setState({
                results: this.state.options
            });
            this.searchField.focus();
            return;
        }

        if (!this.props.viewResults && this.state.results.length) {
            this.setState({
                results: []
            });
        }
    }

    _searchValues () {
        const searchValue = this.searchField.value;

        this.setState({
            results: _.filter(this.state.options, (option) => {
                if (searchValue) {
                    if (option.value.toLowerCase().includes(searchValue.toLowerCase())) {
                        return option;
                    }
                }
            })
        });

        this.props.handleSearchChange();
    }

    _resizeInput (type, key) {
        if (type === 'addAll') {
            let total = this.searchField.clientWidth;

            _.map(this.selectedList.childNodes, (child) => {
                let size = total - child.clientWidth - 10;


                if (size < 0) {
                    this.state.lastSizes.push(total);
                    size = this.container.clientWidth - child.clientWidth - 10;

                    this.setState({
                        resizeInput: size,
                        resizeContainer: this.state.resizeContainer + 30,
                        lastSizes: this.state.lastSizes
                    });
                } else {
                    total = size;
                    this.setState({
                        resizeInput: size
                    });
                }
            });
            return;
        }

        if (type === 'add') {
            let size = this.searchField.clientWidth - this.selectedList.childNodes[this.state.selecteds.length - 1].clientWidth - 10;

            if (size < 0) {
                this.state.lastSizes.push(this.searchField.clientWidth);
                size = this.container.clientWidth - this.selectedList.childNodes[this.state.selecteds.length - 1].clientWidth - 10;

                this.setState({
                    resizeInput: size,
                    resizeContainer: this.state.resizeContainer + 41,
                    lastSizes: this.state.lastSizes
                });
                return;
            }

            this.setState({
                resizeInput: size
            });
            return;
        }

        if (type === 'remove') {
            if ((this.state.selecteds.length - 1) === 0) {
                this.setState({
                    resizeInput: 0,
                    resizeContainer: 30,
                    lastSizes: []
                });
                return;
            }

            let size = this.searchField.clientWidth + this.selectedList.childNodes[key].clientWidth + 10;

            if (size >= this.container.clientWidth) {
                size = this.state.lastSizes.pop();

                this.setState({
                    resizeInput: size,
                    resizeContainer: this.state.resizeContainer - 30,
                    lastSizes: this.state.lastSizes
                });
                return;
            }

            this.setState({
                resizeInput: size
            });
            return;
        }
    }

    _select (key) {
        this.searchField.value = '';
        this.props.handleSearchChange();

        if (this.props.viewResults) {
            this.state.selecteds.push(this.props.options[key]);
        } else {
            this.state.selecteds.push(this.state.results[key]);
        }

        this.setState(
            {
                selecteds: this.state.selecteds,
                results: []
            },
            () => this._resizeInput('add')
        );

        this.searchField.focus();

        if (this.props.handleChange) {
            this.props.handleChange(this.state.selecteds);
        }
    }

    _excludeSelected (key) {
        this._resizeInput('remove', key);
        _.pullAt(this.state.selecteds, [key]);

        this.setState({
            selecteds: this.state.selecteds
        });

        this.searchField.focus();

        if (this.props.handleChange) {
            this.props.handleChange(this.state.selecteds);
        }
    }

    _handleKeyDown (e) {
        if (e.keyCode === 27) {
            if (this.searchField.value && this.state.results || this.props.viewResults) {
                this._handleCloseResults();
            }
        }

        if (!this.state.selecteds.length || this.searchField.value) {
            return;
        }

        if (e.keyCode === 8) {
            this._resizeInput('remove', this.state.selecteds.length - 1);
            _.pullAt(this.state.selecteds, [this.state.selecteds.length - 1]);

            this.setState({
                selecteds: this.state.selecteds
            });
        }
    }

    _handleCloseResults () {
        if (this.props.viewResults) {
            this.props.handleCloseResults();
        }
        this.setState({
            results: []
        });
        this.searchField.value = '';
    }

    render () {
        const containerStyle = {
            height: this.state.resizeContainer ? `${this.state.resizeContainer}px` : '30px'
        };

        const inputStyle = {
            width: this.state.resizeInput ? `${this.state.resizeInput}px` : '100%'
        };

        const resultsStyle = {
            top: this.state.resizeContainer ? `${this.state.resizeContainer + 10}px` : '40px'
        };

        const results = this.props.viewResults ? this.props.options : this.state.results;

        return (
            <div className={`MultiSelect ${this.props.className || ''}`} ref={(c) => this.container = c} style={containerStyle}>
                <ul className="MultiSelect__selecteds" ref={(c) => this.selectedList = c}>
                    {
                        _.map(this.state.selecteds, (selected, key) => (
                            <li className="MultiSelect__selecteds__item" key={key}>
                                <Tag className="MultiSelect__selecteds__value" color={selected.baseColor} removable={true} title={selected.value} handleClick={() => this._excludeSelected(key)}/>
                            </li>
                        ))
                    }
                </ul>
                <input className="MultiSelect__input" ref={(c) => this.searchField = c} placeholder={this.state.selecteds.length ? '' : this.props.placeholder} type="text" onChange={this._searchValues.bind(this)} onKeyDown={this._handleKeyDown.bind(this)} value={this.props.currentValue} style={inputStyle}/>
                {
                    this.props.viewResults || this.state.results.length ? (
                        <div className="MultiSelect__results__container" ref={(c) => this.resultsContainer = c} onClick={this._handleCloseResults.bind(this)} onKeyDown={this._handleCloseResults.bind(this)}></div>
                    ) : ''
                }
                <ul className="MultiSelect__results" style={resultsStyle} ref={(c) => this.resultList = c}>
                    {
                        _.map(results, (result, key) => {
                            if (this.props.unique && _.map(this.state.selecteds, (selected) => {return selected.id;}).indexOf(results[key].id) === -1) {
                                return (
                                    <li className="MultiSelect__results__item" key={key} onClick={() => this._select(key)}>
                                      <Tag className="MultiSelect__results__item__value" color={result.baseColor} title={result.value}/>
                                    </li>
                                );
                            }
                        })
                    }
                </ul>
            </div>
        );
    }
}

MultiSelect.PropTypes = {
    className: React.PropTypes.string,
    selecteds: React.PropTypes.array,
    placeholder: React.PropTypes.string,
    options: React.PropTypes.array,
    viewResults: React.PropTypes.bool,
    unique: React.PropTypes.bool,
    currentValue: React.PropTypes.string,
    handleSearchChange: React.PropTypes.func,
    handleChange: React.PropTypes.func,
    handleCloseResults: React.PropTypes.func
};

export default MultiSelect;
