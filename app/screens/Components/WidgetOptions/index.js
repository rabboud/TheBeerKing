import React from 'react';
import _ from 'lodash';
import {Form} from '../Form';
import Switcher from '../Switcher';
import Line from '../Line';

class WidgetOptions extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <div className={`WidgetOptions ${this.props.className}`}>
                <Form>
                    <ul className="WidgetOptions__list">
                        {
                            _.map(this.props.options, (option, key) => (
                                <li className="WidgetOptions__item" key={key}>
                                    <div className="row collapse">
                                        <div className="large-10 columns">
                                            <p className="WidgetOptions__item__title">
                                                {option.title}
                                            </p>
                                        </div>
                                        <div className="large-2 columns WidgetOptions__item__action">
                                            {this.props.accountFree ? null : (
                                                <Switcher
                                                    on={option.value ? true : false}
                                                    onClick={() => this.props.onToggleOption(
                                                        option.id,
                                                        option.value
                                                    )}
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <Line color="gray-septenary"/>
                                </li>
                            ))
                        }
                    </ul>
                </Form>
            </div>
        );
    }
}

WidgetOptions.PropTypes = {
    className: React.PropTypes.string,
    options: React.PropTypes.array,
    onToggleOption: React.PropTypes.func,
    accountFree: React.PropTypes.boolean
};

export default WidgetOptions;
