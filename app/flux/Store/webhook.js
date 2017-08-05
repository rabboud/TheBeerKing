import alt from 'app/flux/Alt';
import {webhookActions} from 'app/flux/Actions';
import {WebhookModel} from 'app/flux/Model';
import _ from 'lodash';

class WebhookStore {
    constructor () {
        this.state = {
            webhooks: {
                status: '',
                data: []
            },
            types: [
                {id: 'attendance', name: 'Atendimento', selected: false},
                {id: 'offcontact', name: 'Recado', selected: false}
            ],
            attendance: {
                id: 'attendance',
                name: 'Atendimento',
                options: [
                    {id: 'name', name: 'Nome', selected: false},
                    {id: 'email', name: 'Email', selected: false},
                    {id: 'phone', name: 'Telefone', selected: false},
                    {id: 'attendant', name: 'Atendente', selected: false},
                    {id: 'attendant_email', name: 'Email do Atendente', selected: false},
                    {id: 'department', name: 'Departamento', selected: false},
                    {id: 'cpf', name: 'CPF', selected: false},
                    {id: 'notes', name: 'Notas', selected: false},
                    {id: 'date', name: 'Data', selected: false},
                    {id: 'media', name: 'Canal de Interação', selected: false},
                    {id: 'interactionHash', name: 'ID da conversa', selected: false},
                    {id: 'browser', name: 'Navegador', selected: false},
                    {id: 'operating_system', name: 'Sistema Operacional', selected: false},
                    {id: 'ip', name: 'IP', selected: false},
                    {id: 'origin', name: 'Origem', selected: false}
                ]
            },
            offcontact: {
                id: 'attendance',
                name: 'Recado',
                options: [
                    {id: 'name', name: 'Nome', selected: false},
                    {id: 'email', name: 'Email', selected: false},
                    {id: 'phone', name: 'Telefone', selected: false},
                    {id: 'text_message', name: 'Mensagem', selected: false},
                    {id: 'date', name: 'Hora', selected: false}
                ]
            },
            currentWebhook: {
                status: '',
                id: '',
                request: 'add',
                name: '',
                url: '',
                typeName: '',
                type: '',
                departments: '',
                fields: '',
                allFields: false
            }
        };

        this.bindActions(webhookActions);
    }

    onResettingAll () {
        this.state.webhooks.data = [];
        this.state.page = 0;
        this.state.status = '';
    }

    onFetchingAll (params) {
        this.state.webhooks.status = params.status;
    }

    onFetchedAll (params) {
        this.state.page = this.state.page + 1;
        this.state.status = params.status;

        if (params.status === 'TIMEOUT' || params.status === 'ERROR') {
            return;
        }

        if (params.results.length === 0) {
            this.state.status = 'ENDED';
            return;
        }

        _.map(params.results, (webhook) => {
            this.state.webhooks.data.push(new WebhookModel(webhook));
        });
    }

    onTogglingState (params) {
        this.state.webhooks[params.webhookKey].state = params.webhook.state === 'INACTIVE'
            ? 'ACTIVE'
            : 'INACTIVE';
    }

    onToggledState (params) {
        if (params.error) {
            this.state.webhooks[params.webhookKey].state = params.webhook.state === 'INACTIVE'
                ? 'ACTIVE'
                : 'INACTIVE';
        }
    }

    onDeletingWebhooks (params) {
        this.setState({
            status: params.status
        });
    }

    onDeletedWebhooks (params) {
        if (params.error) {
            this.state.status = params.status;
        } else {
            this.state.status = '';
        }

        this.setState({
            status: this.state.status
        });
    }
    onChangingSearch (value) {
        this.setState({
            search: value
        });
    }

    onUpdatingCurrentWebhook (params) {
        this.state.currentWebhook.name = params.name;
        this.state.currentWebhook.url = params.url;
    }

    onUpdatingCurrentType (value) {
        const typeInteraction = {
            id: value,
            name: this.state.types.filter((type) => type.id === value)[0].name
        };

        this.state.currentWebhook.type = typeInteraction;
        this.state.currentWebhook.fields = this.state[value].options;
    }

    onUpdatingCurrentDepartment (value) {
        this.state.currentWebhook.department = value;
    }

    onUpdatingCurrentService (index) {
        if (index === -1) {
            this.state.currentWebhook.allFields = !this.state.currentWebhook.allFields;
            _.map(this.state.currentWebhook.fields, (option, key) => {
                if (this.state.currentWebhook.allFields) {
                    this.state.currentWebhook.fields[key].selected = this.state.currentWebhook.allFields;
                } else {
                    this.state.currentWebhook.fields[key].selected = false;
                }
            });
        } else {
            this.state.currentWebhook.fields[index].selected = !this.state.currentWebhook.fields[index].selected;
        }
    }

    onChangingCurrentWebhook (webhook) {
        if (webhook) {
            const typeInteraction = {
                id: webhook.type,
                name: this.state.types.filter((type) => type.id === webhook.type)[0].name
            };

            this.state.currentWebhook.status = 'edit';
            this.state.currentWebhook.id = webhook.id;
            this.state.currentWebhook.name = webhook.name;
            this.state.currentWebhook.url = webhook.url;
            this.state.currentWebhook.type = typeInteraction;
            this.state.currentWebhook.department = webhook.department;
            this.state.currentWebhook.fields = this.getFields(webhook);
            this.state.currentWebhook.request = 'edit';
        } else {
            this.state.currentWebhook = {
                status: '',
                request: 'add',
                id: '',
                name: '',
                url: '',
                type: '',
                department: '',
                fields: {}
            };
        }
        this.setState({
            currentWebhook: this.state.currentWebhook
        });
    }

    getFields (webhook) {
        const getFields = JSON.parse(webhook.fields);
        const fields = this.state[webhook.type].options;

        _.map(fields, (option, key) => {
            option.selected = getFields[Object.keys(getFields)[key]];
        });
        return fields;
    }

    onSaving (params) {
        this.state.currentWebhook.status = params.status;
    }

    onSaved (params) {
        this.state.currentWebhook.status = params.status;
    }

}

export default alt.createStore(WebhookStore, 'webhookStore');
