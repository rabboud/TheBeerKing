import React from 'react';
import _ from 'lodash';
import {
    Card,
    OMZTable,
    Button,
    FloatButton,
    Icon,
    Switcher,
    Text,
    AddTelegram
} from 'app/screens/Components';

class View extends React.Component {
    constructor (props) {
        super(props);

        this.fetchAll = this.fetchAll.bind(this);
        this.getParent = this.getParent.bind(this);
        this.toggleModalState = this.toggleModalState.bind(this);
        this.addTelegram = this.addTelegram.bind(this);
        this.deleteTelegram = this.deleteTelegram.bind(this);
        this.updateCurrentTelegram = this.updateCurrentTelegram.bind(this);
        this.saveTelegram = this.saveTelegram.bind(this);
        this.sendCodeTelegram = this.sendCodeTelegram.bind(this);
        this.validadeConfirmationCode = this.validadeConfirmationCode.bind(this);
        this.handleCountryChanged = this.handleCountryChanged.bind(this);
        this.selectDepartment = this.selectDepartment.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.searchCountry = this.searchCountry.bind(this);
    }

    componentWillUnmount () {
        this.props.telegramActions.resetAll();
        this.props.departmentActions.resetAll();
        this.props.filterActions.clearAllSelecteds();
        this.props.tableActions.clearAllOrder();
    }

    getParent () {
        return document.querySelector('.telegram');
    }

    fetchAll (reset = false) {
        const header = this.props.tableStore.telegram.selectedHeader;

        if (!(this.props.telegramStore.status === 'ENDED' && !reset || this.props.telegramStore.status === 'LOADING')) {
            const params = {
                reset: reset,
                accountId: this.props.currentUserStore.information.account.id,
                headerId: header ? header.id : '',
                orderDirection: header ? header.direction : '',
                state: this.props.filterStore.state.selectedOptionsId
            };

            this.props.telegramActions.fetchAll(params);
        }
    }

    validadeConfirmationCode () {
        const phone = this.props.telegramStore.currentTelegram.code + this.props.telegramStore.currentTelegram.phone.replace(/\-/g, '');
        const hashcode = this.props.telegramStore.currentTelegram.hashcode;
        const validationCode = this.telegramModal.codeConfirmed.state.value;

        this.props.telegramActions.validateCodeTelegram(
            phone,
            hashcode,
            validationCode,
            () => this.props.viewsActions.forwardModalPanel('telegramView')
        );
    }

    sendCodeTelegram () {
        const phone = this.props.telegramStore.currentTelegram.code + this.props.telegramStore.currentTelegram.phone.replace(/\-/g, '');

        this.props.telegramActions.sendCodeTelegram(
            phone,
            () => this.props.viewsActions.forwardModalPanel('telegramView')
        );
    }

    addTelegram () {
        this.toggleModalState();
        this.props.telegramActions.conectTelegram();
    }

    toggleModalState () {
        this.props.viewsActions.toggleModalState('showAddEdit', 'telegramView');
    }

    saveTelegram (e) {
        e.preventDefault();

        this.props.telegramActions.save(
            this.props.currentUserStore.information.account.id,
            this.props.telegramStore.currentTelegram,
            this.props.departmentStore.departments,
            () => this.fetchAll(true)
        );
        this.handleClose();
    }

    handleCountryChanged (id) {
        const countryCode = this.props.telegramStore.idd.filter((idd) => idd.id === id);

        this.props.telegramActions.updateCountryCheck(countryCode[0]);
    }

    selectDepartment (deptId) {
        if (typeof deptId === 'object') {
            _.map(deptId, (department) => {
                this.props.departmentActions.selectDepartment(department.id);
            });
            return;
        }

        if (typeof deptId === 'number') {
            this.props.departmentActions.selectDepartment(deptId);
            return;
        }

        this.props.departmentActions.selectAllDepartments();
    }

    updateCurrentTelegram () {
        const telegram = {
            code: this.telegramModal.code ? this.telegramModal.code.state.value : this.props.telegramStore.currentTelegram.code,
            phone: this.telegramModal.phone ? this.telegramModal.phone.state.value : this.props.telegramStore.currentTelegram.phone,
            botUsername: this.telegramModal.name ? this.telegramModal.name.state.value : this.props.telegramStore.currentTelegram.botUsername
        };

        this.props.telegramActions.updateCurrentTelegram(telegram);
    }

    searchCountry () {
        this.props.telegramActions.searchCountry(this.telegramModal.country.state.value);
    }

    deleteTelegram (botSelected) {
        const bots = [];

        if (botSelected instanceof Object) {
            bots.push(botSelected.id);
        } else {
            _.map(this.props.telegramStore.telegrams, (bot) => {
                if (bot.selected) {
                    bots.push(bot.id);
                }
            });
        }

        this.props.telegramActions.deleteBots(
            bots,
            this.props.currentUserStore.information.id,
            () => this.fetchAll(true)
        );
    }

    handleClose () {
        this.props.viewsActions.showInitialModalPanel('telegramView');
        this.props.telegramActions.changeCurrentTelegram();
        this.props.departmentActions.resetSelectedDepartments();
        this.toggleModalState();
    }

    render () {
        const tableData = {
            headers: this.props.tableStore.telegram.headers
        };

        tableData.items = _.map(this.props.telegramStore.telegrams, (telegramItem, index) => {
            const departments = [];

            _.map(telegramItem.departments, (department) => {
                departments.push(department.name);
            });

            const row = {
                selected: telegramItem.selected,
                fields: [
                    {
                        id: 'departments',
                        type: 'data',
                        content: (
                            <Text content={departments.join(', ')} wrap={true} textColor="gray-primary"/>
                        )
                    },
                    {
                        id: 'bot',
                        type: 'data',
                        content: (
                            <span className="OMZTable__content__container__row__data__text">
                                {telegramItem.botUsername}
                            </span>
                        )
                    },
                    {
                        id: 'phone',
                        type: 'data',
                        content: (
                            <span className="OMZTable__content__container__row__data__text">
                                {telegramItem.phone}
                            </span>
                        )
                    },
                    {
                        id: 'date',
                        type: 'data',
                        content: (
                            <span className="OMZTable__content__container__row__data__text">
                                {telegramItem.createdAt}
                            </span>
                        )
                    },
                    {
                        id: 'state',
                        type: 'data',
                        content: (
                            <Switcher
                                on={telegramItem.state === 'ACTIVE'}
                                onClick={() => {
                                    this.props.telegramActions.toggleState(
                                        telegramItem,
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
                                handleClick={() => {
                                    this.props.telegramActions.changeCurrentTelegram(telegramItem);
                                    this.selectDepartment(telegramItem.departments);
                                    this.props.viewsActions.showModalPanelIndex('telegramView', 2);
                                    this.toggleModalState();
                                }}
                            />,
                            <Icon
                                name="trash"
                                width="14px"
                                height="15px"
                                padding="9px 10.5px"
                                iconColor="blue"
                                bkgColor="white"
                                bkgCircle={true}
                                bkgBorder="gray-octonary"
                                inline={true}
                                clickable={true}
                                handleClick={() => this.deleteTelegram(telegramItem)}
                            />
                        ]
                    }
                ]
            };

            return row;
        });

        const telegramsSelected = _.filter(this.props.telegramStore.telegrams, (telegram) => {
            if (telegram.selected) {
                return telegram;
            }
        });

        const parsedCountries = () => {
            const countries = [];

            _.map(this.props.telegramStore.filteredCountries.length > 0
                ? this.props.telegramStore.filteredCountries
                : this.props.telegramStore.idd,
                (country, key) => {
                    countries.push({
                        id: country.id,
                        content: (
                            <p>{country.name}</p>
                        )
                    });
                }
            );
            return countries;
        };

        const modalData = this.props.telegramStore.currentTelegram;

        modalData.departments = this.props.departmentStore.departments;

        return (
            <section className="telegram">
                <div className="telegram__container">
                    <Card
                        helpers="card--full-height card--header-padding"
                        contentPadded={true}
                        title="Telegram"
                    >
                        <div className="row">
                            <div className="large-10 columns rythm--margin-b-2">
                                <span className="card__description">
                                    Habilite o Telegram para receber as mensagens dentro da plataforma. Em caso de
                                    dúvidas consulte nossa Central de Ajuda.
                                </span>
                            </div>
                            <div className="large-1 columns text-right rythm--margin-b-2">
                                <Button
                                    className="vTop alpha-10"
                                    size="big"
                                    color="green"
                                    handleOnClick={this.addTelegram}
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
                        <AddTelegram
                            ref={(c) => this.telegramModal = c}
                            isOpen={this.props.viewsStore.modal.telegramView.showAddEdit}
                            activePanel={this.props.viewsStore.modal.telegramView.activePanel}
                            onClose={this.handleClose}
                            data={modalData}
                            onSave={this.saveTelegram}
                            validateConfirmationCode={this.validadeConfirmationCode}
                            sendConfirmationCode={this.sendCodeTelegram}
                            saveText="Concluir"
                            onChange={this.updateCurrentTelegram}
                            modalParentSelector={this.getParent}
                            countryChanged={this.handleCountryChanged}
                            countriesContainer={parsedCountries()}
                            searchCountry={this.searchCountry}
                            selectDepartment={this.selectDepartment}
                            selectAllDepartment={this.selectDepartment}
                        />
                        <OMZTable
                            data={tableData}
                            loadingData={this.props.telegramStore.status === 'LOADING'}
                            hasActions={true}
                            onHeaderClick={(id) => {
                                this.props.tableActions.changeTableOrder('telegram', id);
                                this.fetchAll(true);
                            }}
                            onCheck={
                                (rowIndex, allChecked) => (
                                    this.props.telegramActions.updateTelegramsCheck(rowIndex, allChecked)
                                )
                            }
                            onTableBottom={this.fetchAll}
                        />
                        {
                            telegramsSelected.length ? (
                                <FloatButton
                                    position="bottom-right"
                                    handleClick={this.deleteTelegram}
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
