import _ from 'underscore';
import React from 'react';
import {
    ModalDefault,
    Animated,
    Card,
    Form,
    Button,
    InputText,
    InputCheckbox,
    SimpleList
} from 'app/screens/Components';

class AddTelegram extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            showSuggestionCountry: false,
            showSuggestionDepartment: false
        };
    }

    allSelected () {
        if (this.props.data.departments.find((department) => department.selected === false)) {
            return false;
        }

        return true;
    }

    render () {
        const pageNameBot = (
            <Card helpers="AddTelegram__container__card" contentPadded={true} title="Conectar Telegram">
                <Form>
                    <div className="AddTelegram__container__card__header">
                        <h4>Informar nome do bot</h4>
                        <p>Lembre-se que o nome do bot informado abaixo deverá ser divulgado para a sua empresa ser encontrada no Telegram.</p>
                    </div>
                    {this.props.activePanel === 2 ? (
                        <div className="AddTelegram__container__card__content">
                            <InputText
                                ref={(c) => this.name = c}
                                type="text"
                                value={this.props.data.botUsername}
                                name="name"
                                disabled={this.props.data.type === 'edit' ? true : false}
                                placeholder="Nome do Bot"
                                className="input--rounded input--border-gray"
                                animation="input-animated"
                                autoComplete="off"
                                hasLabel={true}
                                validations={['required']}
                                onChange={this.props.onChange}
                            />
                            <div className="AddTelegram__options rythm--margin-t-1 rythm--margin-b-2">
                                <h4>Deparmentos</h4>
                                <div className="rythm--margin-t-1 AddTelegram__options__container">
                                    <div className="row collapse">
                                        <div className="AddTelegram__options columns large-1">
                                            <InputCheckbox
                                                id="check-all"
                                                name="check-all"
                                                checked={this.allSelected()}
                                                onChange={() => this.props.selectAllDepartment()}
                                            />
                                        </div>
                                        <div className="columns large-11 padding_space">
                                            <label
                                                className="AddTelegram__options__text"
                                                htmlFor="check-all"
                                            >
                                                Todos
                                            </label>
                                        </div>
                                    </div>
                                    {
                                        _.map(this.props.data.departments, (department, key) => {
                                            return (
                                                <div className="row collapse" key={key}>
                                                    <div className="AddTelegram__options columns large-1">
                                                        <InputCheckbox
                                                            id={`check-${department.name}`}
                                                            name={department.name}
                                                            checked={department.selected}
                                                            onChange={() => this.props.selectDepartment(department.id)}
                                                        />
                                                    </div>
                                                    <div className="columns large-11 padding_space">
                                                        <label
                                                            className="AddTelegram__options__text"
                                                            htmlFor={`check-${department.name}`}
                                                        >
                                                            {department.name}
                                                        </label>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    ) : (
                        ''
                    )}

                    <div className="AddTelegram__container__card__footer">
                        <Button
                            size="small"
                            color="green-secondary"
                            className="btn--large"
                            full={true}
                            handleOnClick={this.props.onSave}
                        >
                            {this.props.saveText}
                        </Button>
                    </div>
                </Form>
            </Card>
        );

        const pageConnect = (
            <Animated
                className="full--height"
                transition={true}
                secondariesPanel={[pageNameBot]}
                activePanelIndex={this.props.activePanel === 1 ? null : 0}
            >
                <Card helpers="AddTelegram__container__card" contentPadded={true} title="Conectar Telegram">
                    <Form ref={(c) => this.telegramConnectForm = c} onSubmit={(e) => e.preventDefault()}>
                        <div className="AddTelegram__container__card__header">
                            <h4>Confirmação por SMS ou Telegram</h4>
                            <p>Nós enviamos um código via Telegram, em caso de você não estiver com nenhum sessão executando, a mensagem chegará via SMS.</p>
                        </div>
                        {this.props.activePanel === 1 ? (
                            <div className="AddTelegram__container__card__content">
                                <div className="row">
                                    <div className="options__text columns large-4">
                                        <InputText
                                            type="text"
                                            value={this.props.data.code}
                                            name="code"
                                            disabled={true}
                                            placeholder="Codigo"
                                            className="input--rounded input--border-gray"
                                            animation="input-animated"
                                            autoComplete="off"
                                            hasLabel={true}
                                            validations={['required']}
                                        />
                                    </div>
                                    <div className="options__text columns large-8">
                                        <InputText
                                            type="text"
                                            value={this.props.data.phone}
                                            name="phone"
                                            placeholder="Telefone"
                                            disabled={true}
                                            className="input--rounded input--border-gray"
                                            animation="input-animated"
                                            autoComplete="off"
                                            hasLabel={true}
                                            mask="00-00000-0000"
                                            validations={['required']}
                                        />
                                    </div>
                                </div>
                                <InputText
                                    ref={(c) => this.codeConfirmed = c}
                                    type="text"
                                    value={this.props.codeConfirmed}
                                    name="phone"
                                    placeholder="Inserir código"
                                    className="input--rounded input--border-gray"
                                    animation="input-animated"
                                    autoComplete="off"
                                    hasLabel={true}
                                    validations={['required']}
                                    onChange={this.props.onChange}
                                />
                            </div>
                        ) : (
                            ''
                        )}
                        <div className="AddTelegram__container__card__footer">
                            <Button
                                size="small"
                                color={this.props.data.status === 'INVALID PHONE CODE' ? 'red' : 'green-secondary'}
                                className="btn--large"
                                full={true}
                                handleOnClick={this.props.validateConfirmationCode}
                            >
                                {this.props.data.status === 'INVALID PHONE CODE' ? (
                                    'Código incorreto'
                                ) : (
                                    'Validar código'
                                )}
                            </Button>
                        </div>
                    </Form>
                </Card>
            </Animated>
        );

        return (
            <div className={`AddTelegram ${this.props.className}`}>
                <ModalDefault
                    isOpen={this.props.isOpen}
                    onRequestClose={this.props.onClose}
                    shouldCloseOnOverlayClick={true} className="AddTelegram__modal"
                    parentSelector={this.props.modalParentSelector}
                    cardContent={true}
                    isCentralized={true}
                >
                    <Animated
                        className="full--height"
                        transition={true}
                        secondariesPanel={[pageConnect]}
                        activePanelIndex={this.props.activePanel === 0 ? null : 0}
                    >
                        <Card helpers="AddTelegram__container__card" contentPadded={true} title="Conectar Telegram">
                            <Form ref={(c) => this.telegramForm = c} onSubmit={(e) => e.preventDefault()}>
                                <div className="AddTelegram__container__card__header">
                                    <h4>Cadastrar número</h4>
                                    <p>Conecte a uma conta do Telegram para receber as mensagens na plataforma da Omnize. Em caso de dúvidas, consulte nossa Central de Ajuda</p>
                                </div>
                                {this.props.activePanel === 0 ? (
                                    <div className="AddTelegram__container__card__content">
                                        <InputText
                                            ref={(c) => this.country = c}
                                            type="select"
                                            placeholder="País"
                                            value={this.props.data.country}
                                            name="country"
                                            className="input--rounded input--initial-color input--border-gray"
                                            animation="input-animated"
                                            autoComplete="off"
                                            sugestionOpen={this.state.showSuggestionCountry}
                                            sugestion={
                                                <SimpleList
                                                    container={this.props.countriesContainer}
                                                    maxHeight="150px"
                                                    paddingLeft="10px"
                                                    onClick={this.props.countryChanged}
                                                />
                                            }
                                            sugestionClass="input__select"
                                            sugestionDirection="down"
                                            hasLabel={true}
                                            validations={[]}
                                            onChange={this.props.searchCountry}
                                            onClick={() => this.setState({showSuggestionCountry: !this.state.showSuggestionCountry})}
                                            onCloseSugestion={() => this.setState({showSuggestionCountry: false})}
                                        />
                                        <div className="row">
                                            <div className="options__text columns large-4">
                                                <InputText
                                                    ref={(c) => this.code = c}
                                                    type="text"
                                                    value={this.props.data.code}
                                                    name="code"
                                                    placeholder="Codigo"
                                                    className="input--rounded input--border-gray"
                                                    animation="input-animated"
                                                    autoComplete="off"
                                                    hasLabel={true}
                                                    validations={['required']}
                                                    onChange={this.props.onChange}
                                                />
                                            </div>
                                            <div className="options__text columns large-8">
                                                <InputText
                                                    ref={(c) => this.phone = c}
                                                    type="text"
                                                    value={this.props.data.phone}
                                                    name="phone"
                                                    placeholder="Telefone"
                                                    className="input--rounded input--border-gray"
                                                    animation="input-animated"
                                                    autoComplete="off"
                                                    hasLabel={true}
                                                    validations={['required']}
                                                    onChange={this.props.onChange}
                                                    mask="00-00000-0000"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    ''
                                )}
                                <div className="AddTelegram__container__card__footer">
                                    <Button
                                        size="small"
                                        color={this.props.data.status === 'INVALID PHONE NUMBER' ? 'red' : 'green-secondary'}
                                        className="btn--large"
                                        full={true}
                                        handleOnClick={this.props.sendConfirmationCode}
                                    >
                                        {this.props.data.status === 'INVALID PHONE NUMBER' ? (
                                            'Número de telefone inválido'
                                        ) : (
                                            'Receber código de confirmação'
                                        )}
                                    </Button>
                                </div>
                            </Form>
                        </Card>
                    </Animated>
                </ModalDefault>
            </div>
        );
    }
}

AddTelegram.PropTypes = {
    className: React.PropTypes.string,
    isOpen: React.PropTypes.bool.isRequired,
    onClose: React.PropTypes.func.isRequired,
    searchCountry: React.PropTypes.func.isRequired,
    activePanel: React.PropTypes.number.isRequired,
    onSave: React.PropTypes.func.isRequired,
    onChange: React.PropTypes.func.isRequired,
    modalParentSelector: React.PropTypes.func,
    sendConfirmationCode: React.PropTypes.func,
    validateConfirmationCode: React.PropTypes.func,
    data: React.PropTypes.array,
    countriesContainer: React.PropTypes.array,
    countryChanged: React.PropTypes.array
};

AddTelegram.defaultProps = {
    className: '',
    saveText: 'Salvar'
};

export default AddTelegram;
