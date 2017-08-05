import React from 'react';
import {CSSTransitionGroup} from 'react-transition-group';
import ClipboardCopy from '../ClipboardCopy';
import StateMessage from '../StateMessage';

class WidgetCode extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            codeCopied: false
        };

        this.timeout = null;
        this.handleCopy = this.handleCopy.bind(this);
    }

    handleCopy () {
        this.setState({
            codeCopied: true
        });
        this._startTimeout();
    }

    _startTimeout () {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        this.timeout = setTimeout(() => {
            this.setState({
                codeCopied: false
            }, () => {
                this.timeout = '';
            });
        }, 2000);
    }

    render () {
        const code = (
            '<!-- Início do script Omnize -->'
            + `\n<script>document.addEventListener(\'DOMContentLoaded\',function(){var JSLink=location.protocol+\'\/\/widget.omnize.com\',JSElement=document.createElement(\'script\');JSElement.async=!0;JSElement.charset=\'UTF-8\';JSElement.src=JSLink;JSElement.onload=OnceLoaded;document.getElementsByTagName(\'body\')[0].appendChild(JSElement);function OnceLoaded(){wOmz.init({id:${this.props.accountId}});}},false);</script>`
            + '\n<!-- Início do script Omnize -->'
        );

        return (
            <div className={`WidgetCode ${this.props.className}`}>
                <p className="WidgetCode__desc">
                    Copie o script abaixo e insira no rodapé do código-fonte HTML de seu site.
                    Este código deve ser inserido em todas as páginas em que você deseja exibir
                    o widget Omnize.
                </p>
                <ClipboardCopy text={code} onCopy={this.handleCopy}>
                    <div className="WidgetCode__code__container" data-clipboard-text={code}>
                        <CSSTransitionGroup
                            transitionName="slide-down"
                            transitionEnterTimeout={500}
                            transitionLeaveTimeout={300}
                        >
                            {
                                this.state.codeCopied ? (
                                    <StateMessage
                                        className="WidgetCode__code__alert"
                                        containerType="bubble"
                                        context="Copiado"
                                    />
                                ) : null
                            }
                        </CSSTransitionGroup>
                        <p className="WidgetCode__code__info">Clique para copiar</p>
                        <p className="WidgetCode__code__text">
                            {code}
                        </p>
                    </div>
                </ClipboardCopy>
            </div>
        );
    }
}

WidgetCode.propTypes = {
    className: React.PropTypes.string,
    accountId: React.PropTypes.number.isRequired
};

WidgetCode.defaultProps = {
    className: ''
};

export default WidgetCode;
