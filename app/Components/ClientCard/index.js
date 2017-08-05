import React from 'react';
import Avatar from '../Avatar';
import Icon from '../Icon';
import Moment from 'moment';

class ClientCard extends React.Component {
    constructor (props) {
        super(props);
    }

    _getAction (action, selected) {
        if (action === 'edit') {
            return (
                <Icon name="pencil" iconColor="gray-primary" hover="gray-primary" width="12px" height="12px" padding="9px" bkgCircle={true} clickable={true} handleClick={(e) => {this.props.handleEdit(e, this.props.customer);}}/>
            );
        }

        if (action === 'select') {
            if (selected) {
                return (
                    <Icon name="check" iconColor="white" width="11px" padding="3px 5.5px" bkgCircle={true} bkgColor="gray-primary" clickable={true} handleClick={(e) => {this.props.handleSelect(e, this.props.customer);}}/>
                );
            }

            return (
                <Icon name="dashed-circle" iconColor="gray-primary" width="22px" height="22px" clickable={true} handleClick={(e) => {this.props.handleSelect(e, this.props.customer);}}/>
            );
        }

        return '';
    }

    _getFirstContact () {
        if (!this.props.history) {
            return this.props.customer.firstContact
                ? this.props.customer.firstContact.format('DD.MM.YYYY')
                : '--/--/---';
        }

        if (this.props.history.length) {
            return this.props.history[this.props.history.length - 1].startTime.format('DD.MM.YYYY');
        }

        return Moment().format('DD.MM.YYYY');
    }

    render () {
        const emptyField = 'Não informado';
        const getHistoryText = () => {
            if (!this.props.history && !this.props.customer.historyCount) {
                return '--';
            }

            if (this.props.history) {
                return `${this.props.history.length} atendimento${this.props.history.length > 1 ? 's' : null}`;
            }

            if (this.props.customer.historyCount) {
                return `${this.props.customer.historyCount} atendimento${this.props.customer.historyCount > 1 ? 's' : null}`;
            }
        };

        return (
            <div className={`ClientCard ${this.props.className}`}>
                <div className="ClientCard__container">
                    <div className="ClientCard__avatar">
                        <Avatar src={this.props.customer.photo || null} size="medium"/>
                    </div>

                    <div className="ClientCard__data">

                        <div className="ClientCard__data__row">
                            <div className="ClientCard__data__row__item">
                                <p className="ClientCard__data__row__item__title text--senary text--gray-secondary">Nome</p>
                                <p className="text--quinquennary text--gray text--bold text--wrap">{this.props.customer.name || emptyField}</p>
                            </div>
                            <div className="ClientCard__data__row__item">
                                <p className="ClientCard__data__row__item__title text--senary text--gray-secondary">Primeiro contato</p>
                                <p className="text--quinquennary text--gray text--wrap">{this._getFirstContact()}</p>
                            </div>
                        </div>

                        <div className="ClientCard__data__row">
                            <div className="ClientCard__data__row__item">
                                <p className="ClientCard__data__row__item__title text--senary text--gray-secondary">E-mail</p>
                                <p className="text--quinquennary text--gray text--wrap">{this.props.customer.email || emptyField}</p>
                            </div>
                            <div className="ClientCard__data__row__item">
                                <p className="ClientCard__data__row__item__title text--senary text--gray-secondary">Telefone</p>
                                <p className="text--quinquennary text--gray text--wrap">{this.props.customer.phone || emptyField}</p>
                            </div>
                        </div>

                        <div className="row ClientCard__data__row">
                            <div className="ClientCard__data__row__item">
                                <p className="ClientCard__data__row__item__title text--senary text--gray-secondary">CPF</p>
                                <p className="text--quinquennary text--gray text--wrap">{this.props.customer.cpf || emptyField}</p>
                            </div>
                            {
                                !this.props.hideHistory ? (
                                    <div className="ClientCard__data__row__item">
                                        <p className="ClientCard__data__row__item__title text--senary text--gray-secondary">Histórico</p>
                                        <p
                                            className="ClientCard__data__row__item__desc text--quinquennary text--gray text--wrap"
                                            data-clickable={this.props.handleViewHistory ? 'true' : 'false'}
                                            onClick={this.props.handleViewHistory || ''}
                                        >
                                            {getHistoryText()}
                                        </p>
                                    </div>
                                ) : null
                            }
                        </div>
                    </div>
                </div>

                <div className="ClientCard__action">
                    {this._getAction(this.props.action, this.props.selected)}
                </div>
            </div>
        );
    }
}

ClientCard.PropTypes = {
    className: React.PropTypes.string,
    customer: React.PropTypes.object,
    action: React.PropTypes.string,
    selected: React.PropTypes.bool,
    history: React.PropTypes.array,
    hideHistory: React.PropTypes.bool,
    handleEdit: React.PropTypes.func,
    handleSelect: React.PropTypes.func,
    handleViewHistory: React.PropTypes.func
};

export default ClientCard;
