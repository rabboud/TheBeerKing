import React from 'react';
import _ from 'lodash';
import {CSSTransitionGroup} from 'react-transition-group';
import ClipboardCopy from 'Components/ClipboardCopy';
import StateMessage from 'Components/StateMessage';
import {
    ModalDefault,
    Card,
    Form,
    Button,
    InputText,
    Animated,
    SimpleList,
    Icon,
    InputCheckbox
} from 'app/screens/Components';

class AddWebhook extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            showService: false,
            showDepartment: false,
            codeCopied: false
        };
        this.saveWebhook = this._saveWebhook.bind(this);
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

    _close () {
        this.props.onClose();
    }

    _saveWebhook (e) {
        this.props.onSave(e);
    }

    render () {
        const codeTitle = (
            <label>
                <Icon name="back" iconClass="icon--clickable icon--inline" width="20px" height="12.9px" handleClick={this.props.prevPanel}/>
                <p className="title title--card title--inline title--margin-l-1 title--quaternary">
                    Webhook
                </p>
            </label>
        );

        const getCode = () => {
            const fields = {};

            _.map(this.props.content.fields, (option, key) => (
                this.props.content.fields[key].selected ? fields[option.id] = '' : ''
            ));
            return JSON.stringify(fields, null, 2);
        };

        const codeContent = (
            <Card helpers="AddWebhook__container__card" contentPadded={true} title={codeTitle} data-scroll="true">
                <Form ref={(c) => this.webhookForm = c} onSubmit={this.props.nextPanel}>
                    <div className="card__content__header">
                        <div className="row collapse">
                            <h4>Código</h4>
                            <p>Copie e cole este código na plataforma que deseja integrar.</p>
                        </div>
                    </div>
                    <div className="card__content__container">
                        <ClipboardCopy text={getCode()} onCopy={this.handleCopy.bind(this)}>
                            <div className="WidgetCode__code__container" data-clipboard-text="teste">
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
                                <pre>{getCode()}</pre>
                            </div>
                        </ClipboardCopy>
                    </div>
                    <div className="card__content__footer">
                        <Button size="small" color="green-secondary" className="btn--large" full={true} validate={true} handleOnClick={this.saveWebhook}>
                            Salvar
                        </Button>
                    </div>
                </Form>
            </Card>
        );

        const fieldTitle = (
            <label>
                <Icon name="back" iconClass="icon--clickable icon--inline" width="20px" height="12.9px" handleClick={this.props.prevPanel}/>
                <p className="title title--card title--inline title--margin-l-1 title--quaternary">
                    Webhook
                </p>
            </label>
        );

        const fieldContent = (
            <Animated
                className="full--height"
                transition={true}
                secondariesPanel={[codeContent]}
                activePanelIndex={this.props.activePanel === 2 ? null : 0}
            >
                <Card helpers="AddWebhook__container__card" contentPadded={true} title={fieldTitle} data-scroll="true">
                    <Form ref={(c) => this.webhookForm = c} onSubmit={this.props.nextPanel}>
                        <div className="card__content__header">
                            <div className="row collapse">
                                <h4>Dados</h4>
                                <p>Selecione dados que serão enviados através da integração.</p>
                            </div>
                        </div>
                        <div className="card__content__container__services">
                            <div className="row collapse list">
                                <div className="options columns large-2">
                                    <InputCheckbox
                                        id="all"
                                        name="Todos"
                                        checked={this.props.content.allFields}
                                        onChange={() => this.props.serviceChanged(-1)}
                                    />
                                </div>
                                <div className="options__text columns large-10">
                                    <label htmlFor="dept-all">Todos</label>
                                </div>
                            </div>
                        {
                            _.map(this.props.content.fields, (option, key) => (
                                <div className="row collapse list" key={key}>
                                    <div className="options columns large-2">
                                        <InputCheckbox
                                            id={option.id}
                                            name={option.name}
                                            checked={option.selected}
                                            onChange={() => this.props.serviceChanged(key)}
                                        />
                                    </div>
                                    <div className="options__text columns large-10">
                                        <label htmlFor={option.name}>{option.name}</label>
                                    </div>
                                </div>
                            ))
                        }
                        </div>
                        <div className="card__content__footer">
                            <Button size="small" color="green-secondary" className="btn--large" full={true} validate={true}>
                                Continuar
                            </Button>
                        </div>
                    </Form>
                </Card>
            </Animated>
        );

        const typeTitle = (
            <label>
                <Icon name="back" iconClass="icon--clickable icon--inline" width="20px" height="12.9px" handleClick={this.props.prevPanel}/>
                <p className="title title--card title--inline title--margin-l-1 title--quaternary">
                    Webhook
                </p>
            </label>
        );
        const typeContent = (
            <Animated
                className="full--height"
                transition={true}
                secondariesPanel={[fieldContent]}
                activePanelIndex={this.props.activePanel === 1 ? null : 0}
            >
                <Card helpers="AddWebhook__container__card" contentPadded={true} title={typeTitle} data-scroll="true">
                    <Form ref={(c) => this.webhookForm = c} onSubmit={this.props.nextPanel}>
                        <div className="card__content__header">
                            <div className="row collapse">
                                <h4>Serviço e departamento</h4>
                                <p>Selecionar o serviço e o departamento para integração.</p>
                            </div>
                        </div>
                        <div className="card__content__container">
                            <InputText
                                ref={(c) => this.service = c}
                                type="select"
                                placeholder="Tipo de interação"
                                name="service"
                                className="input--rounded input--border-gray"
                                animation="input-animated"
                                disabled={true}
                                sugestionOpen={this.state.showService}
                                sugestion={
                                    <SimpleList
                                        container={this.props.optionsTypes}
                                        maxHeight="200px"
                                        onClick={this.props.typeChanged}
                                    />
                                }
                                sugestionClass="input__select"
                                sugestionDirection="up"
                                hasLabel={true}
                                validations={[]}
                                value={this.props.content.type.name}
                                onClick={() => this.setState({showService: !this.state.showService})}
                                onCloseSugestion={() => this.setState({showService: false})}
                            />
                            <div className="card__content__container__deptos">
                                <p>Selecione Departamento</p>
                                <div className="row collapse list">
                                    <div className="options columns large-2">
                                    <InputCheckbox
                                        id="dept-all"
                                        name="Todos"
                                        checked={
                                            this.props.optionsDepartments.selectedOptionsId.length
                                            && (this.props.optionsDepartments.selectedOptionsId.split(',').length
                                            === this.props.optionsDepartments.options.length)
                                                ? true
                                                : false
                                        }
                                        onChange={
                                            () => this.props.departmentChanged(
                                                this.props.optionsDepartments.id,
                                                -1,
                                                this.props.optionsDepartments.selectedOptionsId
                                                && (this.props.optionsDepartments.selectedOptionsId.split(',').length
                                                === this.props.optionsDepartments.options.length)
                                            )
                                        }
                                    />
                                    </div>
                                    <div className="options__text columns large-10">
                                        <label htmlFor="dept-all">Todos</label>
                                    </div>
                                </div>
                                {
                                    _.map(this.props.optionsDepartments.options, (department, key) => (
                                        <div className="row collapse list" key={key}>
                                            <div className="options columns large-2">
                                                <InputCheckbox
                                                    id={department.name}
                                                    name={department.name}
                                                    checked={department.selected}
                                                    onChange={
                                                        () => this.props.departmentChanged(
                                                            this.props.optionsDepartments.id,
                                                            key,
                                                            this.props.optionsDepartments.selectedOptionsId
                                                            && (this.props.optionsDepartments.selectedOptionsId.split(',').length
                                                            === this.props.optionsDepartments.options.length)
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="options__text columns large-10">
                                                <label htmlFor={department.name}>{department.name}</label>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        <div className="card__content__footer">
                            <Button size="small" color="green-secondary" className="btn--large" full={true} validate={true}>
                                Continuar
                            </Button>
                        </div>
                    </Form>
                </Card>
            </Animated>
        );

        return (
            <div className={`AddWebhook ${this.props.className}`}>
                <ModalDefault
                    isOpen={this.props.isOpen}
                    onRequestClose={this._close.bind(this)}
                    shouldCloseOnOverlayClick={true} className="AddWebhook__modal"
                    parentSelector={this.props.modalParentSelector}
                    cardContent={true}
                    isCentralized={true}
                >
                    <div className="AddWebhook__container">
                    <Animated
                        className="full--height"
                        transition={true}
                        secondariesPanel={[typeContent]}
                        activePanelIndex={this.props.activePanel === 0 ? null : 0}
                    >
                            <Card helpers="AddWebhook__container__card" contentPadded={true} title="Webhook">
                                <Form ref={(c) => this.webhookForm = c} onSubmit={this.props.nextPanel}>
                                    <div className="card__content__header">
                                        <div className="row collapse">
                                            <h4>Como funciona</h4>
                                            <p>O webhook é um serviço que permite que você envie informações da plataforma Omnize para qualquer outro software. Configure a URL de cada serviço e as informações serão enviadas automaticamente.</p>
                                        </div>
                                    </div>
                                    <div className="card__content__container">
                                        <InputText
                                            ref={(c) => this.name = c}
                                            type="text"
                                            value={this.props.content.name}
                                            name="name"
                                            placeholder="Nome da integração"
                                            className="input--rounded input--border-gray"
                                            animation="input-animated"
                                            hasLabel={true}
                                            validations={['required']}
                                            onChange={this.props.onChanged}
                                        />
                                        <InputText
                                            ref={(c) => this.url = c}
                                            type="text"
                                            value={this.props.content.url}
                                            name="url"
                                            placeholder="URL"
                                            className="input--rounded input--border-gray"
                                            animation="input-animated"
                                            hasLabel={true}
                                            validations={['required', 'url']}
                                            onChange={this.props.onChanged}
                                        />
                                    </div>
                                    <div className="card__content__footer">
                                        <Button size="small" color="green-secondary" className="btn--large" full={true} validate={true}>
                                            Continuar
                                        </Button>
                                    </div>
                                </Form>
                            </Card>
                        </Animated>
                    </div>
                </ModalDefault>
            </div>
        );
    }
}

AddWebhook.PropTypes = {
    className: React.PropTypes.string,
    isOpen: React.PropTypes.func.isRequired,
    onClose: React.PropTypes.func.isRequired,
    onSave: React.PropTypes.func.isRequired,
    serviceChanged: React.PropTypes.func.isRequired,
    typeChanged: React.PropTypes.func.isRequired,
    departmentChanged: React.PropTypes.func.isRequired,
    onChanged: React.PropTypes.func,
    modalParentSelector: React.PropTypes.func,
    nextPanel: React.PropTypes.func.isRequired,
    prevPanel: React.PropTypes.func.isRequired,
    activePanel: React.PropTypes.number.isRequired,
    content: React.PropTypes.array,
    optionsTypes: React.PropTypes.array,
    optionsServices: React.PropTypes.array,
    optionsDepartments: React.PropTypes.array
};

export default AddWebhook;
