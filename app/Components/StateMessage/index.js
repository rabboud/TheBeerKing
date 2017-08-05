import React from 'react';
import {Loader, Icon} from '../';

class StateMessage extends React.Component {
    constructor (props) {
        super(props);
    }

    _getMainMessage () {
        if (this.props.messageState === 'ERROR') {
            if (this.props.context) {
                return `${this.props.context} falhou.`;
            }

            return 'Ocorreu algum erro.';
        }

        if (this.props.messageState === 'TIMEOUT') {
            if (this.props.context) {
                return `${this.props.context} demorou.`;
            }

            return 'Lentidão na solicitação.';
        }

        if (this.props.messageState === 'WAITING') {
            if (this.props.context) {
                return `${this.props.context}, aguarde...`;
            }

            return 'Por favor, aguarde...';
        }

        if (!this.props.messageState && this.props.context) {
            return this.props.context;
        }
    }

    render () {
        const getIconSize = () => {
            switch (this.props.size) {
                case 'medium':
                    return '50px';
                case 'small':
                    return '13px';
                default:
                    return '100px';
            }
        };

        const getIcon = () => {
            return (
                <Icon
                    name={this.props.icon}
                    width={getIconSize()}
                    iconColor={this.props.iconColor
                        ? this.props.iconColor !== 'default'
                            ? this.props.iconColor
                            : ''
                        : 'red-primary'
                    }
                    opacity="100"
                    inline={this.props.inline}
                />
            );
        };

        return (
            <div className={`StateMessage ${this.props.className}`} data-middle={this.props.middle} data-has-action={this.props.action !== 'undefined'} data-type={this.props.containerType} data-color={this.props.messageState === 'WAITING' ? 'yellow' : ''} data-inline={this.props.inline}>
                {
                    this.props.messageState === 'LOADING' && this.props.hasLoader ? (
                        <Loader color={this.props.loaderColor} full={this.props.loaderFull}/>
                    ) : (
                        <div className="centralize">
                            {
                                this.props.icon && !this.props.inline ? (
                                    <div className="StateMessage__icon">
                                        {getIcon()}
                                    </div>
                                ) : null
                            }
                            <div className="StateMessage__text">
                                {
                                    this.props.icon && this.props.inline ? (
                                        <div className="StateMessage__text__icon">
                                            {getIcon()}
                                        </div>
                                    ) : null
                                }
                                {
                                    this.props.context ? (
                                        <p className="StateMessage__text__context rythm--margin-t-1 text--quaternary text--gray--quinquennary centralize">
                                             {this._getMainMessage()}
                                        </p>
                                    ) : null
                                }
                                {
                                    this.props.subContent ? (
                                        <p className="StateMessage__text__context rythm--margin-t-1 text--quinquennary text--gray--quinquennary centralize">
                                             {this.props.subContent}
                                        </p>
                                    ) : null
                                }
                                {
                                    this.props.autoRetry ? (
                                        <p className="StateMessage__text__trying text--quaternary text--gray--quinquennary centralize">
                                            Tentando novamente...
                                        </p>
                                    ) : null
                                }
                                {
                                    this.props.action ? (
                                        <p className="StateMessage__text__action text--quaternary text--gray--quinquennary centralize">
                                            <span className="StateMessage__action" onClick={this.props.action}>Tente novamente</span> ou entre em contato.
                                        </p>
                                    ) : null
                                }
                                {
                                    this.props.back ? (
                                        <p className="StateMessage__text__action text--quaternary text--gray--quinquennary centralize">
                                            <span className="StateMessage__action" onClick={this.props.back}>Voltar</span>
                                        </p>
                                    ) : ''
                                }
                            </div>
                        </div>
                    )
                }
            </div>
        );
    }
}

StateMessage.PropTypes = {
    className: React.PropTypes.string,
    containerType: React.PropTypes.string,
    middle: React.PropTypes.bool,
    messageState: React.PropTypes.string,
    hasLoader: React.PropTypes.bool,
    loaderColor: React.PropTypes.string,
    loaderFull: React.PropTypes.bool,
    icon: React.PropTypes.string,
    inline: React.PropTypes.bool,
    iconColor: React.PropTypes.string,
    size: React.PropTypes.string,
    context: React.PropTypes.string,
    subContent: React.PropTypes.element,
    autoRetry: React.PropTypes.bool,
    action: React.PropTypes.func,
    back: React.PropTypes.func
};

export default StateMessage;
