import React from 'react';
import _ from 'lodash';
import {InputText} from '../Form';
import {Form} from 'omz-react-validation/lib/build/validation.rc';
import ClientCard from '../ClientCard';
import AddClient from '../AddClient';
import InfiniteList from '../InfiniteList';
import Icon from '../Icon';
import Animated from '../Animated';
import ClientForm from '../ClientForm';
import Loader from '../Loader';

class InteractionClient extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            selectedKey: ''
        };
        this.isTyping = false;
        this.checkTypingTimeout = '';
        this.searchCustomer = '';
    }

    _selectClient (e, customer) {
        this.setState({
            selectedKey: customer.customerKey === this.state.selectedKey ? '' : customer.customerKey
        });
    }

    _save (e) {
        this.props.handleSaveCustomer(e);
        this.setState({
            selectedKey: ''
        });
    }

    _selectedInSearched () {
        const search = _.find(this.props.interaction.searchCustomer.customers, (customer) => {
            return customer.customerKey === this.props.interaction.customerInfo.customerKey;
        });

        return search;
    }

    _getSearchMessage () {
        let customersLength;

        if (this._selectedInSearched()) {
            customersLength = this.props.interaction.searchCustomer.customers.length - 1;
        } else {
            customersLength = this.props.interaction.searchCustomer.customers.length;
        }

        if (!customersLength) {
            return '';
        }

        return (
            <p className="text--quaternary text--gray rythm--margin-t-2 rythm--margin-b-1">
                {`${customersLength} cadastro${customersLength > 1 ? 's' : ''} encontrado${customersLength > 1 ? 's' : ''}`}
            </p>
        );
    }

    _searchCustomerChange (e) {
        this._checkTyping();
        if (this.state.selectedKey) {
            this.setState({
                selectedKey: ''
            });
        }
    }

    _onSubmitSearch (e) {
        e.preventDefault();
        this._searchCustomerChange();
    }

    _checkTyping () {
        this.isTyping = true;

        clearTimeout(this.checkTypingTimeout);
        clearTimeout(this.sendEmptyTimeout);

        this.checkTypingTimeout = setTimeout(() => {
            if (this.isTyping) {
                this.isTyping = false;

                this.searchCustomer = setTimeout(() => {
                    this.props.handleSearchCustomer();
                }, 500);
            }
        }, 700);
    }

    _clientIsEmpty () {
        if (this.props.interaction.customerInfo.name) {
            return false;
        }
        if (this.props.interaction.customerInfo.email) {
            return false;
        }
        if (this.props.interaction.customerInfo.phone) {
            return false;
        }
        if (this.props.interaction.customerInfo.cpf) {
            return false;
        }
        return true;
    }

    render () {
        const clientForm = (
            <div className="InteractionClient__form">
                <ClientForm
                    ref={(c) => this.clientForm = c}
                    closeClientForm={() => this.props.handleChangeClientFormState()}
                    clientForm={this.props.interaction.clientForm}
                    inputsDisabled={
                        this.props.interaction.clientForm.state !== 'add'
                        && this.props.interaction.clientForm.state !== 'fake-add'
                        && this.props.interaction.clientForm.state !== 'edit'
                    }
                    handleChange={this.props.handleClientFormChange}
                    handleSave={this._save.bind(this)}
                />
            </div>
        );

        return (
            <div className="InteractionClient">
                <Animated
                    className="full--height"
                    transition={true}
                    secondariesPanel={[clientForm]}
                    activePanelIndex={this.props.interaction.clientForm.state ? 0 : -1}
                >
                    <div className="InteractionClient__manage">
                        <Form onSubmit={this._onSubmitSearch.bind(this)}>
                            <InputText
                                name="searchField"
                                placeholder="Buscar cliente por nome ou e-mail"
                                value={this.props.interaction.searchCustomer.searchValue}
                                ref={(c) => {this.searchField = c;}}
                                className="input--rounded input--border-gray"
                                animation="input-animated"
                                hasLabel={true}
                                autoComplete="off"
                                search={true}
                                clear={true}
                                validations={[]}
                                onChange={this._searchCustomerChange.bind(this)}
                                onClear={this.props.handleClearSearch}
                                disabled={this.props.interaction.searchCustomer.state === 'LOADING' || this.props.interaction.type === 'offcontact'}
                            />
                        </Form>
                        <div className="InteractionClient__manage__search">
                            <InfiniteList className="InteractionClient__search__list" scrollDirection="vertical">
                                {
                                    !this._clientIsEmpty() ? (
                                        <div>
                                            <li>
                                                <p className="text--quaternary text--gray rythm--margin-t-2 rythm--margin-b-1">Cadastro do cliente</p>
                                            </li>
                                            <li className="rythm--margin-t-1">
                                                <ClientCard customer={this.props.interaction.customerInfo} action={this.props.interaction.searchCustomer.customers.length > 0 ? '' : 'edit'} history={this.props.interaction.history} handleSelect={this._selectClient.bind(this)} handleEdit={() => this.props.handleChangeClientFormState('edit')} handleViewHistory={this.props.handleViewHistory}/>
                                            </li>
                                        </div>
                                    ) : ''
                                }
                                {
                                    this.props.interaction.searchCustomer.state === 'LOADING' ? (
                                        <li className="rythm--margin-t-3">
                                            <Loader color="black"/>
                                        </li>
                                    ) : ''
                                }
                                {
                                    this.props.interaction.searchCustomer.customers.length ? (
                                        <li>
                                            {this._getSearchMessage()}
                                        </li>
                                    ) : ''
                                }
                                {
                                    _.map(this.props.interaction.searchCustomer.customers, (item, key) => {
                                        if (item.customerKey !== this.props.interaction.customerInfo.customerKey) {
                                            return (
                                                <li className="rythm--margin-t-1 InteractionClient__search__list__item" key={key}>
                                                    <ClientCard customer={item} action="select" handleSelect={this._selectClient.bind(this)} selected={this.state.selectedKey === item.customerKey}/>
                                                </li>
                                            );
                                        }
                                    })
                                }
                                {
                                    this.props.interaction.searchCustomer.searchValue && this.props.interaction.searchCustomer.state !== 'LOADING' ? (
                                        <li className="rythm--margin-t-1">
                                            <AddClient handleAdd={() => this.props.handleChangeClientFormState(this._clientIsEmpty() ? 'fake-add' : 'add')}/>
                                        </li>
                                    ) : ''
                                }
                            </InfiniteList>
                        </div>
                        <div className="InteractionClient__manage__actions">
                            {
                                this.state.selectedKey && this.state.selectedKey !== this.props.interaction.customerInfo.customerKey ? (
                                    <Icon name="change" iconColor="white" width="25px" padding="17.5px" bkgCircle={true} bkgColor="green-primary" clickable={true} inline={true} handleClick={(e) => {this.props.handleChangeClient(e, this.state.selectedKey);}}/>
                                ) : ''
                            }
                        </div>
                    </div>
                </Animated>
            </div>
        );
    }
}

InteractionClient.PropTypes = {
    interaction: React.PropTypes.object.isRequired,
    handleSearchCustomer: React.PropTypes.func.isRequired,
    handleChangeClient: React.PropTypes.func.isRequired,
    handleSaveCustomer: React.PropTypes.func.isRequired,
    handleClientFormChange: React.PropTypes.func.isRequired,
    handleChangeClientFormState: React.PropTypes.func.isRequired,
    handleClearSearch: React.PropTypes.func.isRequired,
    handleViewHistory: React.PropTypes.func
};

export default InteractionClient;
