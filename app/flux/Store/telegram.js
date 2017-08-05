import alt from 'app/flux/Alt';
import {telegramActions} from 'app/flux/Actions';
import {TelegramModel} from 'app/flux/Model';
import _ from 'lodash';

class TelegramStore {
    constructor () {
        this.state = {
            status: '',
            telegrams: [],
            idd: [
                {
                    id: '93',
                    name: 'Afeganistão'
                },
                {
                    id: '355',
                    name: 'Albânia'
                },
                {
                    id: '213',
                    name: 'Algéria'
                },
                {
                    id: '1684',
                    name: 'Samoa Americana'
                },
                {
                    id: '376',
                    name: 'Andorra'
                },
                {
                    id: '244',
                    name: 'Angola'
                },
                {
                    id: '1264',
                    name: 'Anguilla'
                },
                {
                    id: '672',
                    name: 'Antártida'
                },
                {
                    id: '1268',
                    name: 'Antigua e Barbuda'
                },
                {
                    id: '54',
                    name: 'Argentina'
                },
                {
                    id: '374',
                    name: 'Armênia'
                },
                {
                    id: '297',
                    name: 'Aruba'
                },
                {
                    id: '61',
                    name: 'Austrália'
                },
                {
                    id: '43',
                    name: 'Áustria'
                },
                {
                    id: '994',
                    name: 'Azerbaijão'
                },
                {
                    id: '1242',
                    name: 'Bahamas'
                },
                {
                    id: '973',
                    name: 'Bahrein'
                },
                {
                    id: '880',
                    name: 'Bangladesh'
                },
                {
                    id: '246',
                    name: 'Barbados'
                },
                {
                    id: '375',
                    name: 'Bielorrússia'
                },
                {
                    id: '32',
                    name: 'Bélgica'
                },
                {
                    id: '501',
                    name: 'Belize'
                },
                {
                    id: '229',
                    name: 'Benin'
                },
                {
                    id: '1441',
                    name: 'Bermuda'
                },
                {
                    id: '975',
                    name: 'Butão'
                },
                {
                    id: '591',
                    name: 'Bolívia'
                },
                {
                    id: '387',
                    name: 'Bósnia e Herzegovina'
                },
                {
                    id: '267',
                    name: 'Botswana'
                },
                {
                    id: '47',
                    name: 'Ilha Bouvet'
                },
                {
                    id: '55',
                    name: 'Brasil'
                },
                {
                    id: '246',
                    name: 'Território Britânico do Oceano Índico'
                },
                {
                    id: '673',
                    name: 'Brunei'
                },
                {
                    id: '359',
                    name: 'Bulgária'
                },
                {
                    id: '226',
                    name: 'Burkina Faso'
                },
                {
                    id: '257',
                    name: 'Burundi'
                },
                {
                    id: '855',
                    name: 'Camboja'
                },
                {
                    id: '237',
                    name: 'Camarões'
                },
                {
                    id: '1',
                    name: 'Canadá'
                },
                {
                    id: '238',
                    name: 'Cabo Verde'
                },
                {
                    id: '1345',
                    name: 'Ilhas Cayman'
                },
                {
                    id: '236',
                    name: 'República Centro-Africana'
                },
                {
                    id: '235',
                    name: 'Chade'
                },
                {
                    id: '56',
                    name: 'Chile'
                },
                {
                    id: '86',
                    name: 'China'
                },
                {
                    id: '61',
                    name: 'Ilha Christmas'
                },
                {
                    id: '672',
                    name: 'Ilhas Cocos (Keeling)'
                },
                {
                    id: '57',
                    name: 'Colômbia'
                },
                {
                    id: '269',
                    name: 'Comores'
                },
                {
                    id: '242',
                    name: 'Congo'
                },
                {
                    id: '242',
                    name: 'Congo (DR)'
                },
                {
                    id: '682',
                    name: 'Ilhas Cook'
                },
                {
                    id: '506',
                    name: 'Costa Rica'
                },
                {
                    id: '225',
                    name: 'Costa do Marfim'
                },
                {
                    id: '385',
                    name: 'Croácia'
                },
                {
                    id: '53',
                    name: 'Cuba'
                },
                {
                    id: '357',
                    name: 'Chipre'
                },
                {
                    id: '420',
                    name: 'República Tcheca'
                },
                {
                    id: '45',
                    name: 'Dinamarca'
                },
                {
                    id: '253',
                    name: 'Djibuti'
                },
                {
                    id: '1767',
                    name: 'Dominica'
                },
                {
                    id: '1809',
                    name: 'República Dominicana'
                },
                {
                    id: '593',
                    name: 'Equador'
                },
                {
                    id: '20',
                    name: 'Egito'
                },
                {
                    id: '503',
                    name: 'El Salvador'
                },
                {
                    id: '240',
                    name: 'Guiné Equatorial'
                },
                {
                    id: '291',
                    name: 'Eritreia'
                },
                {
                    id: '372',
                    name: 'Estônia'
                },
                {
                    id: '251',
                    name: 'Etiópia'
                },
                {
                    id: '500',
                    name: 'Ilhas Malvinas'
                },
                {
                    id: '298',
                    name: 'Ilhas Faroe'
                },
                {
                    id: '679',
                    name: 'Fiji'
                },
                {
                    id: '358',
                    name: 'Finlândia'
                },
                {
                    id: '33',
                    name: 'França'
                },
                {
                    id: '594',
                    name: 'Guiana Francesa'
                },
                {
                    id: '689',
                    name: 'Polinésia Francesa'
                },
                {
                    id: '33',
                    name: 'Terras Austrais e Antárticas Francesas'
                },
                {
                    id: '241',
                    name: 'Gabão'
                },
                {
                    id: '220',
                    name: 'Gâmbia'
                },
                {
                    id: '995',
                    name: 'Geórgia'
                },
                {
                    id: '49',
                    name: 'Alemanha'
                },
                {
                    id: '233',
                    name: 'Gana'
                },
                {
                    id: '350',
                    name: 'Gibraltar'
                },
                {
                    id: '30',
                    name: 'Grécia'
                },
                {
                    id: '299',
                    name: 'Groelândia'
                },
                {
                    id: '1473',
                    name: 'Granada'
                },
                {
                    id: '590',
                    name: 'Guadalupe'
                },
                {
                    id: '1671',
                    name: 'Guão'
                },
                {
                    id: '502',
                    name: 'Guatemala'
                },
                {
                    id: '224',
                    name: 'Guiné'
                },
                {
                    id: '245',
                    name: 'Guiné-Bissau'
                },
                {
                    id: '592',
                    name: 'Guiana'
                },
                {
                    id: '509',
                    name: 'Haiti'
                },
                {
                    id: '672',
                    name: 'Ilhas Heard e McDonald'
                },
                {
                    id: '39',
                    name: 'Vaticano'
                },
                {
                    id: '504',
                    name: 'Honduras'
                },
                {
                    id: '852',
                    name: 'Hong Kong'
                },
                {
                    id: '36',
                    name: 'Hungria'
                },
                {
                    id: '354',
                    name: 'Islândia'
                },
                {
                    id: '91',
                    name: 'Índia'
                },
                {
                    id: '62',
                    name: 'Indonésia'
                },
                {
                    id: '98',
                    name: 'Iran'
                },
                {
                    id: '964',
                    name: 'Iraque'
                },
                {
                    id: '353',
                    name: 'Irlanda'
                },
                {
                    id: '972',
                    name: 'Israel'
                },
                {
                    id: '39',
                    name: 'Italia'
                },
                {
                    id: '1876',
                    name: 'Jamaica'
                },
                {
                    id: '81',
                    name: 'Japão'
                },
                {
                    id: '962',
                    name: 'Jornânia'
                },
                {
                    id: '7',
                    name: 'Cazaquistão'
                },
                {
                    id: '254',
                    name: 'Quênia'
                },
                {
                    id: '686',
                    name: 'Kiribati'
                },
                {
                    id: '850',
                    name: 'Coreia do Norte'
                },
                {
                    id: '82',
                    name: 'Coreia do Sul'
                },
                {
                    id: '965',
                    name: 'Kuwait'
                },
                {
                    id: '996',
                    name: 'Quirguistão'
                },
                {
                    id: '856',
                    name: 'Laos'
                },
                {
                    id: '371',
                    name: 'Letônia'
                },
                {
                    id: '961',
                    name: 'Líbano'
                },
                {
                    id: '266',
                    name: 'Lesoto'
                },
                {
                    id: '231',
                    name: 'Libéria'
                },
                {
                    id: '218',
                    name: 'Líbia'
                },
                {
                    id: '423',
                    name: 'Liechtenstein'
                },
                {
                    id: '370',
                    name: 'Lituânia'
                },
                {
                    id: '352',
                    name: 'Luxemburgo'
                },
                {
                    id: '853',
                    name: 'Macao'
                },
                {
                    id: '389',
                    name: 'Macedônia'
                },
                {
                    id: '261',
                    name: 'Madagascar'
                },
                {
                    id: '265',
                    name: 'Malawi'
                },
                {
                    id: '60',
                    name: 'Malásia'
                },
                {
                    id: '960',
                    name: 'Maldivas'
                },
                {
                    id: '223',
                    name: 'Mali'
                },
                {
                    id: '356',
                    name: 'Malta'
                },
                {
                    id: '692',
                    name: 'Ilhas Marshall'
                },
                {
                    id: '596',
                    name: 'Martinica'
                },
                {
                    id: '222',
                    name: 'Mauritânia'
                },
                {
                    id: '230',
                    name: 'Maurício'
                },
                {
                    id: '269',
                    name: 'Mayotte'
                },
                {
                    id: '52',
                    name: 'México'
                },
                {
                    id: '691',
                    name: 'Micronésia'
                },
                {
                    id: '373',
                    name: 'Moldova'
                },
                {
                    id: '377',
                    name: 'Mônaco'
                },
                {
                    id: '976',
                    name: 'Mongólia'
                },
                {
                    id: '1664',
                    name: 'Montserrat'
                },
                {
                    id: '212',
                    name: 'Marrocos'
                },
                {
                    id: '258',
                    name: 'Moçambique'
                },
                {
                    id: '95',
                    name: 'Birmânia'
                },
                {
                    id: '264',
                    name: 'Namíbia'
                },
                {
                    id: '674',
                    name: 'Nauru'
                },
                {
                    id: '977',
                    name: 'Nepal'
                },
                {
                    id: '31',
                    name: 'Holanda'
                },
                {
                    id: '599',
                    name: 'Antilhas Holandesas'
                },
                {
                    id: '687',
                    name: 'Nova Caledônia'
                },
                {
                    id: '64',
                    name: 'Nova Zelândia'
                },
                {
                    id: '505',
                    name: 'Nicarágua'
                },
                {
                    id: '227',
                    name: 'Niger'
                },
                {
                    id: '234',
                    name: 'Nigéria'
                },
                {
                    id: '683',
                    name: 'Niue'
                },
                {
                    id: '672',
                    name: 'Ilha Norfolk'
                },
                {
                    id: '1670',
                    name: 'Ilhas Marianas do Norte'
                },
                {
                    id: '47',
                    name: 'Noruega'
                },
                {
                    id: '968',
                    name: 'Omã'
                },
                {
                    id: '92',
                    name: 'Paquistão'
                },
                {
                    id: '680',
                    name: 'Palau'
                },
                {
                    id: '970',
                    name: 'Palestina'
                },
                {
                    id: '507',
                    name: 'Panamá'
                },
                {
                    id: '675',
                    name: 'Papua-Nova Guiné'
                },
                {
                    id: '595',
                    name: 'Paraguai'
                },
                {
                    id: '51',
                    name: 'Peru'
                },
                {
                    id: '63',
                    name: 'Filipinas'
                },
                {
                    id: '672',
                    name: 'Ilhas Picárnia'
                },
                {
                    id: '48',
                    name: 'Polônia'
                },
                {
                    id: '351',
                    name: 'Portugal'
                },
                {
                    id: '1787',
                    name: 'Porto Rico'
                },
                {
                    id: '974',
                    name: 'Catar'
                },
                {
                    id: '262',
                    name: 'Reunião'
                },
                {
                    id: '40',
                    name: 'Romênia'
                },
                {
                    id: '70',
                    name: 'Rússia'
                },
                {
                    id: '250',
                    name: 'Ruanda'
                },
                {
                    id: '290',
                    name: 'Santa Helena'
                },
                {
                    id: '1869',
                    name: 'São Cristóvão'
                },
                {
                    id: '1758',
                    name: 'Santa Lúcia'
                },
                {
                    id: '508',
                    name: 'São Pedro e Miquelon'
                },
                {
                    id: '1784',
                    name: 'São Vicente e Granadinas'
                },
                {
                    id: '684',
                    name: 'Samoa'
                },
                {
                    id: '378',
                    name: 'São Marino'
                },
                {
                    id: '239',
                    name: 'Sao Tomé e Príncipe'
                },
                {
                    id: '966',
                    name: 'Arábia Saudita'
                },
                {
                    id: '221',
                    name: 'Senegal'
                },
                {
                    id: '381',
                    name: 'Sérvia e Montenegro'
                },
                {
                    id: '248',
                    name: 'Seicheles'
                },
                {
                    id: '232',
                    name: 'República da Serra Leoa'
                },
                {
                    id: '65',
                    name: 'Singapura'
                },
                {
                    id: '421',
                    name: 'Eslováquia'
                },
                {
                    id: '386',
                    name: 'Eslovênia'
                },
                {
                    id: '677',
                    name: 'Ilhas Salomão'
                },
                {
                    id: '252',
                    name: 'Somália'
                },
                {
                    id: '27',
                    name: 'África do Sul'
                },
                {
                    id: '500',
                    name: 'Ilhas Geórgia do Sul e Sandwich do Sul'
                },
                {
                    id: '34',
                    name: 'Espanha'
                },
                {
                    id: '94',
                    name: 'Sri Lanka'
                },
                {
                    id: '249',
                    name: 'Sudão'
                },
                {
                    id: '597',
                    name: 'Suriname'
                },
                {
                    id: '47',
                    name: 'Esvalbarde'
                },
                {
                    id: '268',
                    name: 'Suazilândia'
                },
                {
                    id: '46',
                    name: 'Suécia'
                },
                {
                    id: '41',
                    name: 'Suiça'
                },
                {
                    id: '963',
                    name: 'Síria'
                },
                {
                    id: '886',
                    name: 'Taiwan'
                },
                {
                    id: '992',
                    name: 'Tajiquistão'
                },
                {
                    id: '255',
                    name: 'Tanzânia'
                },
                {
                    id: '66',
                    name: 'Tailândia'
                },
                {
                    id: '670',
                    name: 'Timor-Leste'
                },
                {
                    id: '228',
                    name: 'Togo'
                },
                {
                    id: '690',
                    name: 'Toquelau'
                },
                {
                    id: '676',
                    name: 'Tonga'
                },
                {
                    id: '1868',
                    name: 'Trinidad e Tobago'
                },
                {
                    id: '216',
                    name: 'Tunísia'
                },
                {
                    id: '90',
                    name: 'Turquia'
                },
                {
                    id: '7370',
                    name: 'Turcomenistão'
                },
                {
                    id: '1649',
                    name: 'Ilhas Turks e Caicos'
                },
                {
                    id: '688',
                    name: 'Tuvalu'
                },
                {
                    id: '256',
                    name: 'Uganda'
                },
                {
                    id: '380',
                    name: 'Ucrânia'
                },
                {
                    id: '971',
                    name: 'Emirados Árabes'
                },
                {
                    id: '44',
                    name: 'Reino Unido'
                },
                {
                    id: '1',
                    name: 'Estados Unidos'
                },
                {
                    id: '1',
                    name: 'Ilhas Menores Distantes dos Estados Unidos'
                },
                {
                    id: '598',
                    name: 'Uruguai'
                },
                {
                    id: '998',
                    name: 'Uzbequistão'
                },
                {
                    id: '678',
                    name: 'Vanuatu'
                },
                {
                    id: '58',
                    name: 'Venezuela'
                },
                {
                    id: '84',
                    name: 'Vietnam'
                },
                {
                    id: '1284',
                    name: 'Ilhas Virgens Inglesas'
                },
                {
                    id: '1340',
                    name: 'Ilhas Virgens (USA)'
                },
                {
                    id: '681',
                    name: 'Wallis e Futuna'
                },
                {
                    id: '212',
                    name: 'Saara Ocidental'
                },
                {
                    id: '967',
                    name: 'Iêmen'
                },
                {
                    id: '260',
                    name: 'Zâmbia'
                },
                {
                    id: '263',
                    name: 'Zimbábue'
                }
            ],
            filteredCountries: [],
            currentTelegram: {
                status: '',
                id: '',
                hashcode: '',
                type: 'add',
                country: '',
                code: '',
                phone: '',
                botUsername: ''
            }
        };

        this.bindActions(telegramActions);
    }

    onResettingAll () {
        this.state.telegrams = [];
        this.state.page = 0;
        this.state.status = '';
    }

    onFetchingAll (params) {
        this.state.status = params.status;
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

        _.map(params.results, (telegram) => {
            this.state.telegrams.push(new TelegramModel(telegram));
        });
    }

    onTogglingState (params) {
        this.state.telegrams[params.telegramKey].state = params.telegram.state === 'INACTIVE'
            ? 'ACTIVE'
            : 'INACTIVE';
    }

    onToggledState (params) {
        if (params.error) {
            this.state.telegrams[params.telegramKey].state = params.telegram.state === 'INACTIVE'
                ? 'ACTIVE'
                : 'INACTIVE';
        }
    }

    onUpdatingTelegramsCheck (params) {
        const changeCheck = (state) => {
            _.map(this.state.telegrams, (telegram) => {
                telegram.selected = state;
            });
        };

        if (params.telegramIndex === -1) {
            if (params.allChecked) {
                changeCheck(false);
            } else {
                changeCheck(true);
            }
        } else {
            this.state.telegrams[params.telegramIndex].selected = !this.state.telegrams[params.telegramIndex].selected;
        }

        this.setState({
            telegrams: this.state.telegrams
        });
    }

    onDeletingBots (params) {
        this.setState({
            status: params.status
        });
    }

    onDeletedBots (params) {
        if (params.error) {
            this.state.status = params.status;
        } else {
            this.state.status = '';
        }

        this.setState({
            status: this.state.status
        });
    }

    onUpdatingCurrentTelegram (telegram) {
        this.state.currentTelegram.code = telegram.code ? telegram.code : '';
        this.state.currentTelegram.phone = telegram.phone ? telegram.phone : '';
        this.state.currentTelegram.botUsername = telegram.botUsername ? telegram.botUsername : '';

        this.setState({
            currentTelegram: this.state.currentTelegram
        });
    }

    onSearchingCountry (search) {
        this.state.filteredCountries = [];

        _.map(this.state.idd, (country) => {
            if (country.name.toLowerCase().match(search.toLowerCase())) {
                this.state.filteredCountries.push(country);
            }
        });

        this.setState({
            filteredCountries: this.state.filteredCountries
        });
    }

    onUpdatingCountryCheck (countryCode) {
        this.state.currentTelegram.code = countryCode.id ? `+${countryCode.id}` : '';
        this.state.currentTelegram.country = countryCode.name ? countryCode.name : '';

        this.setState({
            currentTelegram: this.state.currentTelegram,
            filteredCountries: []
        });
    }

    onChangingCurrentTelegram (telegramItem) {
        if (telegramItem) {
            this.state.currentTelegram.type = 'edit';

            this.state.currentTelegram.id = telegramItem.id;
            this.state.currentTelegram.botUsername = telegramItem.botUsername;

            this.state.currentTelegram.code = telegramItem.code;
            this.state.currentTelegram.country = telegramItem.country;
            this.state.currentTelegram.phone = telegramItem.phone;
            this.state.currentTelegram.hashcode = telegramItem.hashcode;
        } else {
            this.state.currentTelegram = {
                status: '',
                id: '',
                hashcode: '',
                type: 'add',
                country: '',
                code: '',
                phone: '',
                botUsername: ''
            };
        }

        this.setState({
            currentTelegram: this.state.currentTelegram
        });
    }

    onSendingCodeTelegram (params) {
        this.state.currentTelegram.status = params.status;

        this.setState({
            currentTelegram: this.state.currentTelegram
        });
    }

    onSentCodeTelegram (params) {
        this.state.currentTelegram.hashcode = params.hashcode ? params.hashcode : '';
        this.state.currentTelegram.status = params.status;

        this.setState({
            currentTelegram: this.state.currentTelegram
        });
    }

    onValidatingCodeTelegram (params) {
        this.state.currentTelegram.status = params.status;

        this.setState({
            currentTelegram: this.state.currentTelegram
        });
    }

    onValidatedCodeTelegram (params) {
        this.state.currentTelegram.status = params.status;

        this.setState({
            currentTelegram: this.state.currentTelegram
        });
    }

    onSaving (params) {
        this.state.status = params.status;

        this.setState({
            status: this.state.status
        });
    }

    onSaved (params) {
        this.state.status = params.status;

        this.setState({
            status: this.state.status
        });
    }
}

export default alt.createStore(TelegramStore, 'telegramStore');
