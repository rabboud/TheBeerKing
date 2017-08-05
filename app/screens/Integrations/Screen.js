import React from 'react';
import _ from 'lodash';
import {CSSTransitionGroup} from 'react-transition-group';
import ClipboardCopy from 'Components/ClipboardCopy';
import StateMessage from 'Components/StateMessage';
import {
    Card,
    OMZTable,
    Button,
    FloatButton,
    Icon,
    Switcher,
    OMZHelmet,
    Text,
    Form,
    InputText,
    AddWebhook,
    Loader
} from 'app/screens/Components';

class View extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            codeCopied: false
        };

        this.fetchAll = this.fetchAll.bind(this);
        this.getParent = this.getParent.bind(this);
        this.deleteWebhooks = this.deleteWebhooks.bind(this);
        this.handleRowClick = this._handleRowClick.bind(this);
        this.changeTab = this._changeTab.bind(this);
        this.changeActivePanel = this._changeActivePanel.bind(this);
        this.changePrevPanel = this._prevActivePanel.bind(this);
        this.clientGenerateToken = this._clientGenerateToken.bind(this);
        this.clientSaveLink = this._clientSaveLink.bind(this);
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

    componentWillUnmount () {
        this.props.webhookActions.resetAll();
        this.props.filterActions.clearAllSelecteds();
        this.props.tableActions.clearAllOrder();
        this.props.viewsActions.changeIntegrationTab(0);
    }

    getParent () {
        return document.querySelector('.Integration');
    }

    _handleRowClick (index) {
        this.props.viewsActions.changeIntegrationTab(index);
    }

    _changeTab (index) {
        this.props.viewsActions.changeIntegrationTab(index);

        if (index === 1) {
            this.props.accountActions.fetchInfo(this.props.currentUserStore.information.account.id);
        }
        if (index === 2) {
            this.props.rdstationActions.fetchInfo(this.props.currentUserStore.information.account.id);
        }
    }

    fetchAll (reset = false) {
        const header = this.props.tableStore.webhook.selectedHeader;

        if (!(this.props.webhookStore.status === 'ENDED' && !reset || this.props.webhookStore.status === 'LOADING')) {
            const params = {
                reset: reset,
                accountId: this.props.currentUserStore.information.account.id,
                page: reset ? 0 : this.props.webhookStore.page,
                headerId: header ? header.id : '',
                orderDirection: header ? header.direction : '',
                search: this.props.webhookStore.search,
                state: this.props.filterStore.state.selectedOptionsId
            };

            this.props.webhookActions.fetchAll(params);
        }
    }

    deleteWebhooks (webhookSelected) {
        const webhooks = [];

        if (webhookSelected instanceof Object) {
            webhooks.push(webhookSelected.id);
        } else {
            _.map(this.props.webhookStore.webhooks, (webhook) => {
                if (webhook.selected) {
                    webhooks.push(webhook.id);
                }
            });
        }

        this.props.webhookActions.deleteWebhooks(webhooks, this.props.currentUserStore.information.id, () => this.fetchAll(true));
    }

    editWebhook (webhook) {
        this.props.filterActions.clearAllSelecteds('department');
        this.props.webhookActions.changeCurrentWebhook(webhook);
        this._selectDepartments(webhook.departments);
        this.props.viewsActions.showModalPanelIndex('webhookView', 0);
        this.props.viewsActions.toggleModalState('showAddEdit', 'webhookView');
    }

    _addWebhook () {
        this.props.filterActions.clearAllSelecteds('department');
        this.props.webhookActions.changeCurrentWebhook();
        this.props.viewsActions.showModalPanelIndex('webhookView', 0);
        this.props.viewsActions.toggleModalState('showAddEdit', 'webhookView');
    }

    handleClose () {
        this.props.channelActions.clearSelection();
        this.props.filterActions.clearAllSelecteds();
        this.props.viewsActions.toggleModalState('showAddEdit', 'webhookView');
    }

    _handleChange () {
        const webhook = {
            name: this.addEditWebhook.name.state.value,
            url: this.addEditWebhook.url.state.value
        };

        this.props.webhookActions.updateCurrentWebhook(webhook);
    }

    _saveWebhook (e) {
        e.preventDefault();
        let departments = '';

        if (this.props.filterStore.department.options.length === this.props.filterStore.department.selectedOptionsId.split(',').length) {
            departments = '*';
        } else {
            departments = this.props.filterStore.department.selectedOptionsId;
        }

        this.props.webhookActions.save(
            this.props.currentUserStore.information.account.id,
            this.props.webhookStore.currentWebhook,
            departments,
            () => this.fetchAll(true)
        );
        this.handleClose();
    }

    _prevActivePanel () {
        this.props.viewsActions.rewindModalPanel('webhookView');
    }

    _changeActivePanel (e, changeTo) {
        e.preventDefault();

        if (typeof changeTo === 'number') {
            this.props.viewsActions.showModalPanelIndex('webhookView', changeTo);
            return;
        }

        this.props.viewsActions.forwardModalPanel('webhookView');
    }

    _clientGenerateToken (e) {
        e.preventDefault();
        this.props.accountActions.createToken(this.props.currentUserStore.information.account.id);
    }

    _clientSaveLink (e) {
        e.preventDefault();
    }

    handleLinkChange () {
        const link = this.link.state.value;

        this.props.accountActions.updateLink(link);
    }

    handleTokenChange () {
        const token = this.tokenRDstation.state.value;

        this.props.rdstationActions.updateToken(token);
    }

    _selectDepartments (departments) {
        const deptos = departments.split(',');

        if (deptos[0] === '*') {
            this.props.filterActions.updateFilter('department', -1, false);
        } else {
            _.map(this.props.filterStore.department.options, (option, key) => {
                _.map(deptos, (depto) => {
                    if (parseInt(option.id, 10) === parseInt(depto, 10)) {
                        this.props.filterActions.updateFilter('department', key, true);
                    }
                });
            });
        }
    }

    render () {
        const tableData = {
            headers: this.props.tableStore.webhook.headers
        };

        tableData.items = _.map(this.props.webhookStore.webhooks.data, (webhookItem, index) => {
            const row = {
                selected: webhookItem.selected,
                fields: [
                    {
                        id: 'name',
                        type: 'data',
                        content: (
                            <span className="OMZTable__content__container__row__data__text">
                                {webhookItem.name}
                            </span>
                        )
                    },
                    {
                        id: 'url',
                        type: 'data',
                        content: (
                            <span className="OMZTable__content__container__row__data__text">
                                {webhookItem.url}
                            </span>
                        )
                    },
                    {
                        id: 'departments',
                        type: 'data',
                        content: _.map(this.props.webhookStore.types, (type, key) => (
                            webhookItem.type === type.id ? (
                                <span className="OMZTable__content__container__row__data__text" key={key}>
                                    {type.name}
                                </span>
                            ) : ''
                        ))
                    },
                    {
                        id: 'state',
                        type: 'data',
                        content: (
                            <Switcher
                                on={webhookItem.state === 'ACTIVE'}
                                onClick={() => {
                                    this.props.webhookActions.toggleState(
                                        webhookItem,
                                        index,
                                        this.props.currentUserStore.information.id
                                    );
                                }}
                            />
                        )
                    },
                    {
                        id: 'action',
                        type: 'action',
                        actions: [
                            <Icon
                                name="pencil"
                                width="14px"
                                height="15px"
                                padding="9px 10.5px"
                                iconColor="blue"
                                bkgColor="white"
                                bkgCircle={true}
                                bkgBorder="gray-octonary"
                                inline={true}
                                clickable={true}
                                handleClick={() => this.editWebhook(webhookItem)}
                            />,
                            <Icon
                                name="trash"
                                width="14px"
                                height="15px"
                                padding="8px 10.5px"
                                iconColor="blue"
                                bkgColor="white"
                                bkgCircle={true}
                                bkgBorder="gray-octonary"
                                inline={true}
                                clickable={true}
                                handleClick={() => this.deleteWebhooks(webhookItem)}
                            />
                        ]
                    }
                ]
            };

            return row;
        });

        const webhooksSelected = _.filter(this.props.webhookStore.webhooks, (webhook) => {
            if (webhook.selected) {
                return webhook;
            }
        });

        const tabs = [
            {
                title: <Text content="Webhooks" inline={true} textColor={this.props.viewsStore.currentIntegrationTab === 0 ? 'black' : 'white'}/>,
                active: true
            },
            {
                title: <Text content="ClientSDK" inline={true} textColor={this.props.viewsStore.currentIntegrationTab === 1 ? 'black' : 'white'}/>,
                active: false
            },
            {
                title: <Text content="RDStation" inline={true} textColor={this.props.viewsStore.currentIntegrationTab === 2 ? 'black' : 'white'}/>,
                active: false
            }
        ];

        const mainIntegrationContent = (tab) => {
            if (this.props.viewsStore.currentIntegrationTab === 0) {
                const pasedTypes = () => {
                    const types = [];

                    _.map(this.props.webhookStore.types, (type, key) => {
                        types.push({
                            id: type.id,
                            selected: false,
                            content: (
                                <p className="text--tertiary">{type.name}</p>
                            )
                        });
                    });
                    return types;
                };

                return (
                    <section className="webhook">
                        <div className="row mnone">
                            <div className="large-8 columns rythm--margin-b-1">
                                <span className="card__description">
                                    Clique aqui para saber como configurar. Se possível, entre em contato com o seu desenvolvedor.
                                </span>
                            </div>
                            <div className="large-3 columns text-right rythm--margin-b-1">
                                <Button
                                    className="vTop"
                                    size="big"
                                    color="green"
                                    handleOnClick={this._addWebhook.bind(this)}
                                >
                                    <Icon
                                        name="x-small"
                                        width="14px"
                                        padding="0 2px"
                                        rotate="45"
                                        inline={true}
                                    />
                                </Button>
                            </div>
                        </div>
                        <AddWebhook
                            ref={(c) => this.addEditWebhook = c}
                            isOpen={this.props.viewsStore.modal.webhookView.showAddEdit}
                            onClose={() => this.props.viewsActions.toggleModalState('showAddEdit', 'webhookView')}
                            titleCardModal="Webhook"
                            onChanged={this._handleChange.bind(this)}
                            onSave={this._saveWebhook.bind(this)}
                            activePanel={this.props.viewsStore.modal.webhookView.activePanel}
                            nextPanel={this.changeActivePanel}
                            prevPanel={this.changePrevPanel}
                            modalParentSelector={this.getParent}
                            content={this.props.webhookStore.currentWebhook}
                            optionsTypes={pasedTypes()}
                            typeChanged={this.props.webhookActions.updateCurrentType}
                            optionsDepartments={this.props.filterStore.department}
                            departmentChanged={(type, key, all) => this.props.filterActions.updateFilter(type, key, all)}
                            optionsService={this.props.webhookStore}
                            serviceChanged={(service, id, all) => this.props.webhookActions.updateCurrentService(service, id, all)}
                        />
                        <OMZTable
                            selectable={false}
                            data={tableData}
                            loadingData={this.props.webhookStore.status === 'LOADING'}
                            hasActions={true}
                            onHeaderClick={(id) => {
                                this.props.tableActions.changeTableOrder('webhook', id);
                                this.fetchAll(true);
                            }}
                            onCheck={(rowIndex, allChecked) => this.props.webhookActions.updateWebhookCheck(rowIndex, allChecked)}
                            onTableBottom={this.fetchAll}
                        />
                        {
                            webhooksSelected.length ? (
                                <FloatButton
                                    position="bottom-right"
                                    handleClick={this.deleteWebhooks}
                                />
                            ) : ''
                        }
                    </section>
                );
            } else if (this.props.viewsStore.currentIntegrationTab === 1) {
                return (
                    <section className="integration">
                        <div className="row">
                            <div className="large-6 columns">
                                <span className="card__description">
                                    O Client SDK permite que seja criado um chat totalmente personalizado dentro de seu site ou app mobile. Através do Client SDK é possível iniciar uma conversa com sua empresa de forma totalmente integrado de dentro de seu portal ou aplicativo. Também é possível desenvolver a sua própria aparência, deixando o chat com a cara de sua empresa. Para começar veja a documentação completa aqui (<a href="http://www.omnize.com.br/ajuda/configuracoes-sdk-javascript" target="_blank">Javascript</a> / <a href="http://www.omnize.com.br/ajuda/configuracoes-sdk-java" target="_blank">Android</a>) e depois baixe a versão que você for utilizar abaixo.
                                </span>
                                <div className="row collapse">
                                    <div className="large-6 columns">
                                        <a href="https://s3-us-west-1.amazonaws.com/omz-sdk/omz.js" download={true}>
                                            <Button size="big" color="green-secondary">
                                                Donwload SDK Javascript
                                            </Button>
                                        </a>
                                    </div>
                                    <div className="large-6 columns">
                                        <a href="https://s3-us-west-1.amazonaws.com/omz-sdk/omz-chat-sdk-java-1.0.jar" download={true}>
                                            <Button size="big" color="green-secondary">
                                                Donwload SDK Android
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="large-5 columns">
                                <Card
                                    helpers="card--full-height card--header-padding"
                                    contentPadded={true}
                                    title="Dados da integração"
                                >
                                    <Form>
                                        <ClipboardCopy text="teste" onCopy={this.handleCopy.bind(this)}>
                                            <div className="WidgetCode__code__container mb-10" data-clipboard-text="teste">
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
                                                    {this.props.accountStore.account.token}
                                                </p>
                                            </div>
                                        </ClipboardCopy>
                                        <Button
                                            size="big"
                                            color="green-secondary"
                                            className="btn--large mb-10"
                                            full={true}
                                            inline={true}
                                            handleOnClick={
                                                (e) => {
                                                    e.preventDefault();
                                                    this.props.accountActions.generateToken(
                                                        this.props.currentUserStore.information.account.id,
                                                        this.props.accountStore.account.token
                                                    );
                                                }
                                            }
                                        >
                                            Gerar Token
                                        </Button>
                                        <InputText
                                            ref={(c) => this.link = c}
                                            type="text"
                                            value={this.props.accountStore.account.webhookUrl}
                                            name="link"
                                            placeholder="Link"
                                            className="input--rounded input--border-gray"
                                            animation="input-animated"
                                            hasLabel={true}
                                            onChange={this.handleLinkChange.bind(this)}
                                            validations={[]}
                                        />
                                        <Button
                                            size="big"
                                            color="green-secondary"
                                            className="btn--large"
                                            full={true}
                                            inline={true}
                                            handleOnClick={
                                                (e) => {
                                                    e.preventDefault();
                                                    this.props.accountActions.save(
                                                        this.props.currentUserStore.information.account.id,
                                                        this.props.accountStore.account
                                                    );
                                                }
                                            }
                                        >
                                            Salvar Link
                                        </Button>
                                    </Form>
                                </Card>
                            </div>
                        </div>
                    </section>
                );
            }

            return (
                <section className="integration">
                    <div className="row">
                        <div className="large-6 columns">
                            <span className="card__description">
                                O RD Station é um software de automação de marketing que te ajuda na captação, gestão e comunicação com clientes e leads (clientes potenciais).
                            </span>
                            <span className="card__description">
                                Essa integração transforma automaticamente as conversas iniciadas através da Omnize em leads no RD Station. Isso vai acontecer todas as vezes em que os visitantes deixarem um recado ou preencherem o formulário de pré atendimento do widget da Omnize e quando o atendente preencher os dados do cliente na tela de atendimento.
                            </span>
                            <span className="card__description">
                                Em caso de dúvidas, acesse nossa <a href="http://www.omnize.com.br/ajuda/integracao-rd-station" target="_blank">Central de ajuda</a>
                            </span>
                        </div>
                        <div className="large-5 columns">
                            <Card
                                helpers="card--full-height card--header-padding"
                                contentPadded={true}
                                title="Dados da integração"
                            >
                                <Form>
                                    <InputText
                                        ref={(c) => this.tokenRDstation = c}
                                        type="text"
                                        value={this.props.rdstationStore.token}
                                        name="token"
                                        placeholder="Token"
                                        className="input--rounded input--border-gray"
                                        animation="input-animated"
                                        hasLabel={true}
                                        onChange={this.handleTokenChange.bind(this)}
                                        validations={['required', 'token']}
                                    />
                                    {
                                        this.props.rdstationStore.id ? (
                                            <div className="rythm--margin-b-1">
                                                <div className="row collapse">
                                                    <div className="large-10 columns">
                                                        {
                                                            this.props.rdstationStore.active
                                                                ? 'Desativar token'
                                                                : 'Ativar token'
                                                        }
                                                    </div>
                                                    <div className="large-2 columns">
                                                        <Switcher
                                                            className="text-right"
                                                            on={this.props.rdstationStore.active === 1}
                                                            onClick={
                                                                () => {
                                                                    this.props.rdstationActions.toggleState(
                                                                        this.props.currentUserStore.information.account.id,
                                                                        this.props.rdstationStore.id,
                                                                        this.props.rdstationStore.active
                                                                    );
                                                                }
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : null
                                    }
                                    {
                                        this.props.rdstationStore.status === 'LOADING' ? (
                                            <Loader color="black"/>
                                        ) : (
                                            <Button size="big" color="green-secondary" className="btn--large" full={true}
                                                handleOnClick={
                                                    (e) => {
                                                        e.preventDefault();
                                                        this.props.rdstationActions.save(
                                                            this.props.currentUserStore.information.account.id,
                                                            this.props.rdstationStore.token,
                                                            this.props.rdstationStore.id
                                                        );
                                                    }
                                                }
                                            >
                                                {this.props.rdstationStore.id ? 'Atualizar token' : 'Salvar token'}
                                            </Button>
                                        )
                                    }
                                </Form>
                            </Card>
                        </div>
                    </div>
                </section>
            );
        };

        return (
            <section className="Integration" style={{position: 'relative'}}>
                <OMZHelmet title="Integrações"/>
                <div className="row collapse">
                    <div className="large-12 columns">
                        <Card
                            helpers="card--full-height"
                            headerSize="small"
                            tabList={tabs}
                            tabIndex={this.props.viewsStore.currentIntegrationTab}
                            contentPadded={true}
                            onTabClick={this._changeTab.bind(this)}
                        >
                            <div className="full--height">
                                {mainIntegrationContent(this.props.viewsStore.currentIntegrationTab)}
                            </div>
                        </Card>
                    </div>
                </div>
            </section>
        );
    }
}

export default View;
