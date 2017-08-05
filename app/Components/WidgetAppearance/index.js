import React from 'react';
import {Form, InputRadiobutton, InputText} from '../Form';
import Icon from '../Icon';
import ChromePicker from '../ChromePicker';

class WidgetAppearance extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            showColorPicker: false
        };
    }

    render () {
        return (
            <div className={`WidgetAppearance ${this.props.className}`}>
                <Form>
                    <div className="WidgetAppearance__session">
                        <p className="WidgetAppearance__session__title">Widget minimizado</p>
                        <div className="row collapse">
                            <div className="large-4 columns">
                                <div className="row collapse">
                                    <div className="large-offset-2 large-10">
                                        <div className="WidgetAppearance__session__icon">
                                            <Icon
                                                name="widget-bar"
                                                width="35px"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row collapse">
                                    <div className="large-2 columns">
                                        <InputRadiobutton
                                            className="WidgetAppearance__session__input"
                                            id="widget-bar"
                                            name="widget-bar"
                                            checked={this.props.version === '1.0'}
                                            onChange={this.props.onBarSelected}
                                        />
                                    </div>
                                    <div className="large-10 columns">
                                        <label className="WidgetAppearance__session__label" htmlFor="widget-bar">
                                            Barra
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="large-4 columns">
                                <div className="row collapse">
                                    <div className="large-offset-2 large-10">
                                        <div className="WidgetAppearance__session__icon">
                                            <Icon
                                                iconClass="WidgetAppearance__session__icon"
                                                name="widget-bubble"
                                                width="35px"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row collapse">
                                    <div className="large-2 columns">
                                        <InputRadiobutton
                                            className="WidgetAppearance__session__input"
                                            id="widget-bubble"
                                            name="widget-bubble"
                                            checked={this.props.version === '1.5'}
                                            onChange={this.props.onBubbleSelected}
                                        />
                                    </div>
                                    <div className="large-10 columns">
                                        <label className="WidgetAppearance__session__label" htmlFor="widget-bubble">
                                            Bolha
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="large-4 columns"/>
                        </div>
                    </div>
                    <div className="WidgetAppearance__session">
                        <p className="WidgetAppearance__session__title">Cor base</p>
                        <div className="WidgetAppearance__session__input">
                            <InputText
                                className="input--rounded input--border-gray"
                                ref={(c) => this.color = c}
                                type="text"
                                value={this.props.color}
                                name="color"
                                placeholder="Código hexa"
                                animation="input-animated"
                                hasLabel={true}
                                actionIcons={[
                                    <Icon
                                        name="color-wheel"
                                        width="30px"
                                        height="30px"
                                        inline={true}
                                        clickable={true}
                                        onMouseDown={
                                            () => this.setState({
                                                showColorPicker: !this.state.showColorPicker
                                            })
                                        }
                                    />
                                ]}
                                validations={['required', 'hexColor']}
                                onChange={this.props.onColorChange}
                                onBlur={this.props.onColorBlur}
                            />
                            {
                                this.state.showColorPicker ? (
                                    <ChromePicker
                                        className="WidgetAppearance__color-picker"
                                        color={this.props.color}
                                        onChange={this.props.onColorBlur}
                                        onClose={
                                            () => this.setState({
                                                showColorPicker: false
                                            })
                                        }
                                    />
                                ) : null
                            }
                        </div>
                    </div>
                    <div className="WidgetAppearance__session">
                        <p className="WidgetAppearance__session__title">Posição na página</p>
                        <div className="row collapse">
                            <div className="large-4 columns">
                                <div className="row collapse">
                                    <div className="large-offset-2 large-10">
                                        <div className="WidgetAppearance__session__icon">
                                            <Icon
                                                name="widget-left"
                                                width="35px"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row collapse">
                                    <div className="large-2 columns">
                                        <InputRadiobutton
                                            className="WidgetAppearance__session__input"
                                            id="widget-left"
                                            name="widget-left"
                                            checked={this.props.position === 'LEFT_DOWN' || this.props.position === 'LEFT'}
                                            onChange={this.props.onLeftSelected}
                                        />
                                    </div>
                                    <div className="large-10 columns">
                                        <label className="WidgetAppearance__session__label" htmlFor="widget-left">
                                            Esquerda
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="large-4 columns">
                                <div className="row collapse">
                                    <div className="large-offset-2 large-10">
                                        <div className="WidgetAppearance__session__icon">
                                            <Icon
                                                iconClass="WidgetAppearance__session__icon"
                                                name="widget-right"
                                                width="35px"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row collapse">
                                    <div className="large-2 columns">
                                        <InputRadiobutton
                                            className="WidgetAppearance__session__input"
                                            id="widget-right"
                                            name="widget-right"
                                            checked={this.props.position === 'RIGHT_DOWN' || this.props.position === 'RIGHT'}
                                            onChange={this.props.onRightSelected}
                                        />
                                    </div>
                                    <div className="large-10 columns">
                                        <label className="WidgetAppearance__session__label" htmlFor="widget-right">
                                            Direita
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="large-4 columns"/>
                        </div>
                    </div>

                    <div className="WidgetAppearance__session">
                        <p className="WidgetAppearance__session__title">Ícone</p>
                        <div className="rythm--margin-b-2">
                            <div className="row collapse">
                                <div className="large-3 columns">
                                    <InputRadiobutton
                                        className="WidgetAppearance__session__input"
                                        id="icon-omnize-logo"
                                        name="icon-omnize-logo"
                                        checked={this.props.icon === 'omnize-logo'}
                                        onChange={() => this.props.onIconChange('omnize-logo')}
                                    />
                                    <label htmlFor="icon-omnize-logo">
                                        <Icon
                                            name="omnize-logo"
                                            width="35px"
                                            height="26px"
                                            padding="12px 15px"
                                            iconColor="white"
                                            bkgColor={this.props.color}
                                            bkgCircle={true}
                                            inline={true}
                                            clickable={true}
                                        />
                                    </label>
                                </div>
                                <div className="large-3 columns">
                                    <InputRadiobutton
                                        className="WidgetAppearance__session__input"
                                        id="icon-balloon-2"
                                        name="icon-balloon-2"
                                        checked={this.props.icon === 'balloon-2'}
                                        onChange={() => this.props.onIconChange('balloon-2')}
                                    />
                                    <label htmlFor="icon-balloon-2">
                                        <Icon
                                            name="balloon-2"
                                            width="35px"
                                            height="26px"
                                            padding="18px 15px"
                                            bkgColor={this.props.color}
                                            bkgCircle={true}
                                            inline={true}
                                            clickable={true}
                                        />
                                    </label>
                                </div>
                                <div className="large-3 columns">
                                    <InputRadiobutton
                                        className="WidgetAppearance__session__input"
                                        id="icon-speech-bubble-3"
                                        name="icon-speech-bubble-3"
                                        checked={this.props.icon === 'speech-bubble-3'}
                                        onChange={() => this.props.onIconChange('speech-bubble-3')}
                                    />
                                    <label htmlFor="icon-speech-bubble-3">
                                        <Icon
                                            name="speech-bubble-3"
                                            width="33px"
                                            height="30px"
                                            padding="16px"
                                            bkgColor={this.props.color}
                                            bkgCircle={true}
                                            inline={true}
                                            clickable={true}
                                        />
                                    </label>
                                </div>
                                <div className="large-3 columns"/>
                            </div>
                        </div>
                        <div className="row collapse">
                            <div className="large-3 columns">
                                <InputRadiobutton
                                    className="WidgetAppearance__session__input"
                                    id="icon-live-chat-3"
                                    name="icon-live-chat-3"
                                    checked={this.props.icon === 'live-chat-3'}
                                    onChange={() => this.props.onIconChange('live-chat-3')}
                                />
                                <label htmlFor="icon-live-chat-3">
                                    <Icon
                                        name="live-chat-3"
                                        width="42px"
                                        height="27px"
                                        padding="17.5px 11.5px"
                                        bkgColor={this.props.color}
                                        bkgCircle={true}
                                        inline={true}
                                        clickable={true}
                                    />
                                </label>
                            </div>
                            <div className="large-3 columns">
                                <InputRadiobutton
                                    className="WidgetAppearance__session__input"
                                    id="icon-speech-bubble-2"
                                    name="icon-speech-bubble-2"
                                    checked={this.props.icon === 'speech-bubble-2'}
                                    onChange={() => this.props.onIconChange('speech-bubble-2')}
                                />
                                <label htmlFor="icon-speech-bubble-2">
                                    <Icon
                                        name="speech-bubble-2"
                                        width="27px"
                                        height="25px"
                                        padding="18.5px 19px"
                                        bkgColor={this.props.color}
                                        bkgCircle={true}
                                        inline={true}
                                        clickable={true}
                                    />
                                </label>
                            </div>
                            <div className="large-3 columns">
                                <InputRadiobutton
                                    className="WidgetAppearance__session__input"
                                    id="icon-speech-bubble"
                                    name="icon-speech-bubble"
                                    checked={this.props.icon === 'speech-bubble'}
                                    onChange={() => this.props.onIconChange('speech-bubble')}
                                />
                                <label htmlFor="icon-speech-bubble">
                                    <Icon
                                        name="speech-bubble"
                                        width="31px"
                                        height="28px"
                                        padding="17px"
                                        bkgColor={this.props.color}
                                        bkgCircle={true}
                                        inline={true}
                                        clickable={true}
                                    />
                                </label>
                            </div>
                            <div className="large-3 columns"/>
                        </div>
                    </div>

                </Form>
            </div>
        );
    }
}

WidgetAppearance.propTypes = {
    className: React.PropTypes.string,
    color: React.PropTypes.string,
    version: React.PropTypes.string,
    position: React.PropTypes.string,
    icon: React.PropTypes.string,
    onBarSelected: React.PropTypes.func,
    onBubbleSelected: React.PropTypes.func,
    onColorChange: React.PropTypes.func,
    onColorBlur: React.PropTypes.func,
    onLeftSelected: React.PropTypes.func,
    onRightSelected: React.PropTypes.func,
    onIconChange: React.PropTypes.func.isRequired
};

WidgetAppearance.defaultProps = {
    color: '#565151',
    onChange: () => {}
};

export default WidgetAppearance;
