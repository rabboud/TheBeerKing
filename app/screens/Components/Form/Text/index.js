import React from 'react';
import _ from 'lodash';
import {inputFactory} from 'omz-react-validation/lib/build/validation.rc';
import {ValidatorHelper} from 'app/helpers';
import Icon from '../../Icon';
import Sugestion from '../../Sugestion';

class InputText extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            selected: false,
            hasData: this.props.value ? true : false,
            disabled: false
        };
    }

    componentWillUpdate () {
        if (this.props.value && !this.state.hasData) {
            this.setState({
                hasData: true
            });
        }

        if (!this.props.value && this.state.hasData) {
            this.setState({
                hasData: false
            });
        }
    }

    componentDidUpdate () {
        if (this.props.disabled && !this.state.disabled) {
            this._setDisabled(true);
        }

        if (!this.props.disabled && this.state.disabled) {
            this._setDisabled(false);
        }
    }

    _setDisabled (status) {
        this.setState({
            disabled: status
        });

        if (!status) {
            this.input.focus();
        }
    }

    _onFocus (e) {
        this.setState({
            selected: true
        });
    }

    _onBlur (e) {
        this.setState({
            selected: false,
            hasData: this.props.value ? true : false
        });
    }

    _applyMaskOnChange (value) {
        let result = value;

        if (!(/^[a-zA-Z0-9]*$/).test(this.props.mask[result.length - 1])) {
            let index = result.length - 1;
            const lastValue = result[result.length - 1];

            while (!ValidatorHelper.isAlphanumeric(this.props.mask[index])) {
                result = result.substring(0, index) + this.props.mask[index];
                index = index + 1;
            }

            result = result + lastValue;
        }

        if (ValidatorHelper.isAlpha(this.props.mask[result.length - 1])) {
            if (!ValidatorHelper.isAlpha(result[result.length - 1])) {
                return result.substring(0, result.length - 1);
            }
            return result;
        }

        if (ValidatorHelper.isNumeric(this.props.mask[result.length - 1])) {
            if (!ValidatorHelper.isNumeric(result[result.length - 1])) {
                return result.substring(0, result.length - 1);
            }
            return result;
        }

        return result;
    }

    _onChange (e) {
        if (this.props.mask) {
            if (e.target.value && e.target.value > this.props.value) {
                if (e.target.value.length > this.props.mask.length) {
                    e.target.value = e.target.value.substring(0, this.props.mask.length);
                } else {
                    e.target.value = this._applyMaskOnChange(e.target.value);
                }
            }
        }

        if (this.props.maxLength) {
            e.target.value = e.target.value.substring(0, this.props.maxLength);
        }

        if (this.props.onChange) {
            this.props.onChange(e);
        }
    }

    render () {
        return (
            <div className={`input__container form-group ${this.props.containerClassName} ${this.props.avatarSubcontent ? 'input--has-subcontent' : ''} ${this.props.animation || ''} ${this.props.hint && 'has-error'}`} data-mode="false" data-select={this.props.type === 'select' ? true : false} data-subcontent={this.props.subcontent ? true : false} data-selected={this.state.selected} data-hasdata={this.state.hasData} data-search={this.props.search} data-disabled={this.props.disabled} onClick={this.props.onClick} >
                {
                    this.props.hasLabel ? (
                        <label
                            className="input__label control-label"
                            data-position="in"
                            htmlFor={this.props.name}
                        >
                            {this.props.hint || this.props.placeholder}
                        </label>
                    ) : ''
                }
                {
                    this.props.search ? (
                        <div className="input__icon">
                            <Icon name="search" width="15px" inline={true}/>
                        </div>
                    ) : ''
                }
                {
                    this.props.type === 'select' ? (
                        <div className="input__icon">
                            <Icon name="chevron" rotate="180" width="15px" inline={true} clickable={true}/>
                        </div>
                    ) : ''
                }
                {
                    this.props.subcontent ? (
                        <div className="input__subcontent">
                            {this.props.subcontent}
                        </div>
                    ) : ''
                }
                <input
                    ref={(c) => this.input = c}
                    type={this.props.type || 'text'}
                    name={this.props.name}
                    placeholder={this.props.placeholder}
                    value={this.props.value}
                    className={`input-text ${this.props.className || ''}`}
                    onFocus={(e) => {if (this.props.onFocus) {this.props.onFocus(e);} this._onFocus(e);}}
                    onBlur={(e) => {if (this.props.onBlur) {this.props.onBlur(e);} this._onBlur(e);}}
                    onChange={this._onChange.bind(this)}
                    onKeyPress={this.props.handleOnKeyPress}
                    autoComplete={this.props.autoComplete || 'on'}
                    data-lock={false}
                    disabled={this.props.disabled}
                />
                {
                    this.props.clear && this.props.value ? (
                        <div className="input__actions">
                            <div className="input__actions__item">
                                <Icon name="x-small" width="10px" strokeColor="gray-secondary" inline={true} clickable={true} handleClick={this.props.onClear}/>
                            </div>
                        </div>
                    ) : ''
                }
                {
                    this.props.actionIcons ? (
                        <div className="input__actions">
                            {_.map(this.props.actionIcons, (item, key) => (
                                <div className="input__actions__item" key={key}>
                                    {item}
                                </div>
                            ))}
                        </div>
                    ) : ''
                }
                {
                    this.props.action ? (
                        <div className="input__actions" />
                    ) : ''
                }
                {
                    this.props.sugestion ? (
                        <Sugestion className={this.props.sugestionClass} title={this.props.sugestionTitle} isOpen={this.props.sugestionOpen} onRequestClose={this.props.onCloseSugestion} direction={this.props.sugestionDirection}>
                            {this.props.sugestion}
                        </Sugestion>
                    ) : ''
                }
            </div>
        );
    }
}

InputText.propTypes = {
    name: React.PropTypes.string.isRequired,
    type: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    value: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number
    ]),
    avatarSubcontent: React.PropTypes.bool,
    onChange: React.PropTypes.func,
    onClick: React.PropTypes.func,
    onFocus: React.PropTypes.func,
    onBlur: React.PropTypes.func,
    handleOnKeyPress: React.PropTypes.func,
    className: React.PropTypes.string,
    animation: React.PropTypes.string,
    hasLabel: React.PropTypes.bool,
    autoComplete: React.PropTypes.string,
    actionIcons: React.PropTypes.array,
    validations: React.PropTypes.array,
    maxLength: React.PropTypes.number,
    mask: React.PropTypes.string,
    search: React.PropTypes.bool,
    clear: React.PropTypes.bool,
    onClear: React.PropTypes.func,
    disabled: React.PropTypes.bool,
    action: React.PropTypes.bool,
    sugestion: React.PropTypes.object,
    sugestionTitle: React.PropTypes.string,
    sugestionOpen: React.PropTypes.bool,
    sugestionClass: React.PropTypes.string,
    sugestionDirection: React.PropTypes.string,
    subcontent: React.PropTypes.object
};

InputText.defaultProps = {
    onClick: () => {}
};

export default inputFactory(InputText);
