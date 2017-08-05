import React from 'react';
import _ from 'lodash';
import {
    Card,
    OMZTable,
    FloatButton,
    Button,
    Icon,
    Switcher
} from 'app/screens/Components';

class View extends React.Component {
    constructor (props) {
        super(props);

        this.fetchAll = this.fetchAll.bind(this);
        this.getParent = this.getParent.bind(this);
        this.deleteWebhooks = this.deleteWebhooks.bind(this);
    }

    componentWillUnmount () {
        this.props.webhookActions.resetAll();
        this.props.filterActions.clearAllSelecteds();
        this.props.tableActions.clearAllOrder();
    }

    getParent () {
        return document.querySelector('.webhook');
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

    editWebhook () {
        console.log('Edit');
    }

    render () {
        const tableData = {
            headers: this.props.tableStore.webhook.headers
        };

        tableData.items = _.map(this.props.webhookStore.webhooks, (webhookItem, index) => {
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
                        content: (
                            <span className="OMZTable__content__container__row__data__text">
                                {webhookItem.departments}
                            </span>
                        )
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

        return (
            <section className="webhook">
                <div className="webhook__container">
                    <Card
                        helpers="card--full-height card--header-padding"
                        contentPadded={true}
                        title="Webhooks"
                    >
                        <div className="row">
                            <div className="large-8 columns rythm--margin-b-1">
                                <span className="card__description">
                                    Clique aqui para saber como configurar. Se possível, entre em contato com o seu desenvolvedor.
                                </span>
                            </div>

                            <div className="large-3 columns text-right rythm--margin-b-1">
                                <Button className="vTop" size="big" color="green">
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
                        <OMZTable
                            selectable={true}
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
                    </Card>
                </div>
            </section>
        );
    }
}

export default View;
