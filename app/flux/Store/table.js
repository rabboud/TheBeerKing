import alt from 'app/flux/Alt';
import _ from 'lodash';
import {tableActions} from 'app/flux/Actions';

class TableStore {
    constructor () {
        this.state = {
            tag: {
                selectedHeader: null,
                headers: [
                    {
                        id: 'name',
                        name: 'Tag',
                        hasOrder: true,
                        direction: ''
                    },
                    {
                        id: 'agent_name',
                        name: 'Usuário',
                        hasOrder: true,
                        direction: ''
                    },
                    {
                        id: 'change_date',
                        name: 'Data',
                        hasOrder: true,
                        direction: ''
                    },
                    {
                        id: 'tag_count',
                        name: 'Uso',
                        hasOrder: true,
                        direction: ''
                    },
                    {
                        id: 'state',
                        name: 'Status',
                        hasOrder: true,
                        direction: ''
                    }
                ]
            },
            user: {
                selectedHeader: null,
                headers: [
                    {
                        id: 'name',
                        name: 'Nome',
                        hasOrder: true,
                        direction: ''
                    },
                    {
                        id: 'email',
                        name: 'E-mail',
                        hasOrder: true,
                        direction: ''
                    },
                    {
                        id: 'profile',
                        name: 'Tipo de conta',
                        hasOrder: false,
                        direction: ''
                    },
                    {
                        id: 'department',
                        name: 'Departamento',
                        hasOrder: false,
                        direction: ''
                    },
                    {
                        id: 'state',
                        name: 'Status',
                        hasOrder: true,
                        direction: ''
                    }
                ]
            },
            inbox: {
                selectedHeader: null,
                headers: [
                    {
                        id: 'type',
                        name: 'Tipo',
                        hasOrder: false,
                        direction: ''
                    },
                    {
                        id: 'name',
                        name: 'Nome',
                        hasOrder: false,
                        direction: ''
                    },
                    {
                        id: 'message',
                        name: 'Mensagem',
                        hasOrder: false,
                        direction: ''
                    },
                    {
                        id: 'tags',
                        name: 'Tags',
                        hasOrder: false,
                        direction: ''
                    },
                    {
                        id: 'department',
                        name: 'Departamento',
                        hasOrder: false,
                        direction: ''
                    },
                    {
                        id: 'date',
                        name: 'Última mensagem',
                        hasOrder: false,
                        direction: ''
                    },
                    {
                        id: 'duration',
                        name: 'Duração',
                        hasOrder: false,
                        direction: ''
                    },
                    {
                        id: 'state',
                        name: 'Status',
                        hasOrder: false,
                        direction: ''
                    }
                ]
            },
            history: {
                selectedHeader: null,
                headers: [
                    {
                        id: 'media',
                        name: 'Tipo',
                        hasOrder: true,
                        direction: ''
                    },
                    {
                        id: 'client_name',
                        name: 'Nome',
                        hasOrder: true,
                        direction: ''
                    },
                    {
                        id: 'message',
                        name: 'Mensagem',
                        hasOrder: false,
                        direction: ''
                    },
                    {
                        id: 'tags',
                        name: 'Tags',
                        hasOrder: false,
                        direction: ''
                    },
                    {
                        id: 'department',
                        name: 'Departamento',
                        hasOrder: true,
                        direction: ''
                    },
                    {
                        id: 'created_time',
                        name: 'Primeiro contato',
                        hasOrder: true,
                        direction: ''
                    },
                    {
                        id: 'last_message_date',
                        name: 'Última mensagem',
                        hasOrder: true,
                        direction: ''
                    },
                    {
                        id: 'agent_name',
                        name: 'Atendente',
                        hasOrder: true,
                        direction: ''
                    }
                ]
            },
            department: {
                selectedHeader: null,
                headers: [
                    {
                        id: 'name',
                        name: 'Departamento',
                        hasOrder: true,
                        direction: ''
                    },
                    {
                        id: 'channels',
                        name: 'Canal de atendimento',
                        hasOrder: false,
                        direction: ''
                    },
                    {
                        id: 'agents',
                        name: 'Usuários',
                        hasOrder: false,
                        direction: ''
                    },
                    {
                        id: 'state',
                        name: 'Status',
                        hasOrder: true,
                        direction: ''
                    }
                ]
            },
            officeHour: {
                selectedHeader: null,
                headers: [
                    {
                        id: 'name',
                        name: 'Nome da programação',
                        hasOrder: false,
                        direction: ''
                    },
                    {
                        id: 'period',
                        name: 'Período',
                        hasOrder: false,
                        direction: ''
                    },
                    {
                        id: 'hour',
                        name: 'Horário',
                        hasOrder: false,
                        direction: ''
                    },
                    {
                        id: 'interval',
                        name: 'Intervalo',
                        hasOrder: false,
                        direction: ''
                    },
                    {
                        id: 'state',
                        name: 'Status',
                        hasOrder: false,
                        direction: ''
                    }
                ]
            },
            facebook: {
                selectedHeader: null,
                headers: [
                    {
                        id: 'page',
                        name: 'Facebook Page',
                        hasOrder: false,
                        direction: ''
                    },
                    {
                        id: 'user',
                        name: 'Usuário',
                        hasOrder: false,
                        direction: ''
                    },
                    {
                        id: 'department',
                        name: 'Departamento',
                        hasOrder: false,
                        direction: ''
                    },
                    {
                        id: 'verifiedAt',
                        name: 'Verificado em',
                        hasOrder: false,
                        direction: ''
                    },
                    {
                        id: 'state',
                        name: 'Status',
                        hasOrder: false,
                        direction: ''
                    }
                ]
            },
            telegram: {
                selectedHeader: null,
                headers: [
                    {
                        id: 'departments',
                        name: 'Departamento',
                        hasOrder: false,
                        direction: ''
                    },
                    {
                        id: 'bot',
                        name: 'Telegram Bot',
                        hasOrder: false,
                        direction: ''
                    },
                    {
                        id: 'phone',
                        name: 'Número',
                        hasOrder: false,
                        direction: ''
                    },
                    {
                        id: 'date',
                        name: 'Adicionado em',
                        hasOrder: false,
                        direction: ''
                    },
                    {
                        id: 'state',
                        name: 'Status',
                        hasOrder: false,
                        direction: ''
                    }
                ]
            },
            webhook: {
                selectedHeader: null,
                headers: [
                    {
                        id: 'name',
                        name: 'Nome da Integração',
                        hasOrder: true,
                        direction: ''
                    },
                    {
                        id: 'url',
                        name: 'Link',
                        hasOrder: true,
                        direction: ''
                    },
                    {
                        id: 'departments',
                        name: 'Serviço',
                        hasOrder: true,
                        direction: ''
                    },
                    {
                        id: 'state',
                        name: 'Status',
                        hasOrder: true,
                        direction: ''
                    }
                ]
            },
            email: {
                selectedHeader: null,
                headers: [
                    {
                        id: 'email',
                        name: 'E-mail',
                        hasOrder: false,
                        direction: ''
                    },
                    {
                        id: 'department',
                        name: 'Departamento',
                        hasOrder: false,
                        direction: ''
                    },
                    {
                        id: 'user',
                        name: 'Usuário',
                        hasOrder: false,
                        direction: ''
                    },
                    {
                        id: 'state',
                        name: 'Status',
                        hasOrder: false,
                        direction: ''
                    }
                ]
            }
        };
        this.bindActions(tableActions);
    }

    onChangingTableOrder (params) {
        _.map(this.state[params.table].headers, (header, key) => {
            if (this.state[params.table].headers[key].id === params.headerId) {
                switch (header.direction) {
                    case 'asc':
                        this.state[params.table].headers[key].direction = 'desc';
                        this.state[params.table].selectedHeader = this.state[params.table].headers[key];
                        break;
                    case 'desc':
                        this.state[params.table].headers[key].direction = '';
                        this.state[params.table].selectedHeader = {};
                        break;
                    default:
                        this.state[params.table].headers[key].direction = 'asc';
                        this.state[params.table].selectedHeader = this.state[params.table].headers[key];
                }
            } else {
                this.state[params.table].headers[key].direction = '';
            }
        });

        const table = {};

        table[params.table] = this.state[params.table];
        this.setState(table);
    }

    onClearingAllOrder () {
        _.map(this.state, (type) => {
            type.selectedHeader = null;
            _.map(type.headers, (header) => {
                header.direction = '';
            });
        });
    }
}


export default alt.createStore(TableStore, 'TableStore');
