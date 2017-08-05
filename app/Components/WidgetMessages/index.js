import React from 'react';
import _ from 'lodash';
import {Form, InputText} from '../Form';

class WidgetMessages extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <div className={`WidgetMessages ${this.props.className}`}>
                <Form>
                    <ul className="WidgetMessages__list">
                        {
                            _.map(this.props.messages, (message, key) => (
                                <li className="WidgetMessages__item" key={key}>
                                    <p className="WidgetMessages__item__title">
                                        {message.title}
                                    </p>
                                    <InputText
                                        type="text"
                                        name="mainTitle"
                                        className="input--rounded input--border-gray input--tall"
                                        value={message.value}
                                        ref={message.id}
                                        onChange={() => this.props.onChange(message.id)}
                                        onBlur={() => this.props.onBlur(message.id)}
                                        validations={[]}
                                    />
                                </li>
                            ))
                        }
                    </ul>
                </Form>
            </div>
        );
    }
}

WidgetMessages.PropTypes = {
    className: React.PropTypes.string,
    messages: React.PropTypes.array.isRequired,
    onChange: React.PropTypes.func.isRequired,
    onBlur: React.PropTypes.func.isRequired
};

export default WidgetMessages;
