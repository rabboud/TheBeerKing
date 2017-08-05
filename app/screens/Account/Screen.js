import React from 'react';
import {
    Card,
    InputText,
    Button,
    Loader,
    Form
} from 'app/screens/Components';

class View extends React.Component {
    constructor (props) {
        super(props);

        this.fetchInfo = this.fetchInfo.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.updateAccountForm = this.updateAccountForm.bind(this);
    }

    fetchInfo () {
        this.props.accountActions.fetchInfo(this.props.currentUserStore.information.account.id);
    }

    updateAccountForm () {
        const form = {
            mainContact: this.mainContactField.state.value,
            name: this.nameField.state.value,

            companyName: this.companyNameField.state.value,
            cpfCnpj: this.cpfCnpjField.state.value,
            stateRegistration: this.stateRegistrationField.state.value,

            address: this.addressField.state.value,
            addressNumber: this.addressNumberField.state.value,
            zipCode: this.zipCodeField.state.value,
            neighbourhood: this.neighbourhoodField.state.value,
            city: this.cityField.state.value,
            addressState: this.addressStateField.state.value,

            secondaryPhone: this.celphoneField.state.value,
            primaryPhone: this.phoneField.state.value,
            email: this.emailField.state.value
        };

        this.props.accountActions.updateAccountForm(form);
    }

    handleSave (e) {
        e.preventDefault();

        this.props.accountActions.save(
            this.props.currentUserStore.information.account.id,
            this.props.accountStore.account
        );
    }

    render () {
        const data = this.props.accountStore.account;
        const status = this.props.accountStore.status;

        return (
            <section className="account">
                <Card
                    helpers="card--full-height card--header-padding"
                    contentPadded={true}
                    scrollable={true}
                    title="Conta"
                >
                    <div className="row">
                        <div className="large-6 large-centered columns">
                            <Form>
                                <div className="row">
                                    <div className="large-12 columns">
                                        <InputText
                                            ref={(c) => {this.mainContactField = c;}}
                                            type="text"
                                            name="mainContact"
                                            placeholder="Contato Principal"
                                            className="input--rounded input--border-gray"
                                            animation="input-animated"
                                            hasLabel={true}
                                            validations={[]}
                                            value={data.mainContact ? data.mainContact : ''}
                                            onChange={this.updateAccountForm}
                                            disabled={status === 'LOADING' ? true : false}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="large-12 columns rythm--margin-t-2">
                                        <InputText
                                            ref={(c) => {this.nameField = c;}}
                                            type="text"
                                            name="company"
                                            placeholder="Empresa"
                                            className="input--rounded input--border-gray"
                                            animation="input-animated"
                                            hasLabel={true}
                                            validations={[]}
                                            value={data.name ? data.name : ''}
                                            onChange={this.updateAccountForm}
                                            disabled={status === 'LOADING' ? true : false}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="large-12 columns rythm--margin-t-1">
                                        <InputText
                                            ref={(c) => {this.companyNameField = c;}}
                                            type="text"
                                            name="socialReason"
                                            placeholder="Razão Social"
                                            className="input--rounded input--border-gray"
                                            animation="input-animated"
                                            hasLabel={true}
                                            validations={[]}
                                            value={data.companyName ? data.companyName : ''}
                                            onChange={this.updateAccountForm}
                                            disabled={status === 'LOADING' ? true : false}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="large-12 columns rythm--margin-t-1">
                                        <InputText
                                            ref={(c) => {this.cpfCnpjField = c;}}
                                            type="text"
                                            name="cfpCnpj"
                                            placeholder="CPF/CNPJ"
                                            className="input--rounded input--border-gray"
                                            animation="input-animated"
                                            hasLabel={true}
                                            validations={[]}
                                            value={data.cpfCnpj ? data.cpfCnpj : ''}
                                            onChange={this.updateAccountForm}
                                            disabled={status === 'LOADING' ? true : false}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="large-12 columns rythm--margin-t-1">
                                        <InputText
                                            ref={(c) => {this.stateRegistrationField = c;}}
                                            type="text"
                                            name="state"
                                            placeholder="Inscrição Estadual"
                                            className="input--rounded input--border-gray"
                                            animation="input-animated"
                                            hasLabel={true}
                                            validations={[]}
                                            value={data.stateRegistration ? data.stateRegistration : ''}
                                            onChange={this.updateAccountForm}
                                            disabled={status === 'LOADING' ? true : false}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="large-6 columns rythm--margin-t-2">
                                        <InputText
                                            ref={(c) => {this.addressField = c;}}
                                            type="text"
                                            name="address"
                                            placeholder="Endereço"
                                            className="input--rounded input--border-gray"
                                            animation="input-animated"
                                            hasLabel={true}
                                            validations={[]}
                                            value={data.address ? data.address : ''}
                                            onChange={this.updateAccountForm}
                                            disabled={status === 'LOADING' ? true : false}
                                        />
                                    </div>
                                    <div className="large-3 columns rythm--margin-t-2">
                                        <InputText
                                            ref={(c) => {this.addressNumberField = c;}}
                                            type="text"
                                            name="addressNumber"
                                            placeholder="Número"
                                            className="input--rounded input--border-gray"
                                            animation="input-animated"
                                            hasLabel={true}
                                            validations={[]}
                                            value={data.addressNumber ? data.addressNumber : ''}
                                            onChange={this.updateAccountForm}
                                            disabled={status === 'LOADING' ? true : false}
                                        />
                                    </div>
                                    <div className="large-3 columns rythm--margin-t-2">
                                        <InputText
                                            ref={(c) => {this.zipCodeField = c;}}
                                            type="text"
                                            name="cep"
                                            placeholder="CEP"
                                            className="input--rounded input--border-gray"
                                            animation="input-animated"
                                            hasLabel={true}
                                            validations={[]}
                                            value={data.zipCode ? data.zipCode : ''}
                                            onChange={this.updateAccountForm}
                                            disabled={status === 'LOADING' ? true : false}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="large-3 columns rythm--margin-t-1">
                                        <InputText
                                            ref={(c) => {this.neighbourhoodField = c;}}
                                            type="text"
                                            name="bairro"
                                            placeholder="Bairro"
                                            className="input--rounded input--border-gray"
                                            animation="input-animated"
                                            hasLabel={true}
                                            validations={[]}
                                            value={data.neighbourhood ? data.neighbourhood : ''}
                                            onChange={this.updateAccountForm}
                                            disabled={status === 'LOADING' ? true : false}
                                        />
                                    </div>
                                    <div className="large-6 columns rythm--margin-t-1">
                                        <InputText
                                            ref={(c) => {this.cityField = c;}}
                                            type="text"
                                            name="city"
                                            placeholder="Cidade"
                                            className="input--rounded input--border-gray"
                                            animation="input-animated"
                                            hasLabel={true}
                                            validations={[]}
                                            value={data.city ? data.city : ''}
                                            onChange={this.updateAccountForm}
                                            disabled={status === 'LOADING' ? true : false}
                                        />
                                    </div>
                                    <div className="large-3 columns rythm--margin-t-1">
                                        <InputText
                                            ref={(c) => {this.addressStateField = c;}}
                                            type="text"
                                            name="addressState"
                                            placeholder="Estado"
                                            className="input--rounded input--border-gray"
                                            animation="input-animated"
                                            hasLabel={true}
                                            validations={[]}
                                            value={data.addressState ? data.addressState : ''}
                                            onChange={this.updateAccountForm}
                                            disabled={status === 'LOADING' ? true : false}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="large-6 columns rythm--margin-t-1">
                                        <InputText
                                            ref={(c) => {this.phoneField = c;}}
                                            type="text"
                                            name="phone"
                                            placeholder="Telefone"
                                            className="input--rounded input--border-gray"
                                            animation="input-animated"
                                            hasLabel={true}
                                            validations={[]}
                                            value={data.primaryPhone ? data.primaryPhone : ''}
                                            onChange={this.updateAccountForm}
                                            disabled={status === 'LOADING' ? true : false}
                                            mask="(11) 1111-1111"
                                        />
                                    </div>
                                    <div className="large-6 columns rythm--margin-t-1">
                                        <InputText
                                            ref={(c) => {this.celphoneField = c;}}
                                            type="text"
                                            name="celphone"
                                            placeholder="Celular"
                                            className="input--rounded input--border-gray"
                                            animation="input-animated"
                                            hasLabel={true}
                                            validations={[]}
                                            value={data.secondaryPhone ? data.secondaryPhone : ''}
                                            onChange={this.updateAccountForm}
                                            disabled={status === 'LOADING' ? true : false}
                                            mask="(11) 11111-1111"
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="large-12 columns rythm--margin-t-1 rythm--margin-b-3">
                                        <InputText
                                            ref={(c) => {this.emailField = c;}}
                                            type="text"
                                            name="email"
                                            placeholder="Email"
                                            className="input--rounded input--border-gray"
                                            animation="input-animated"
                                            hasLabel={true}
                                            validations={[]}
                                            value={data.email ? data.email : ''}
                                            onChange={this.updateAccountForm}
                                            disabled={true}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="large-offset-3 large-6 columns">
                                        {
                                            status === 'LOADING' ? (
                                                <Loader color="black"/>
                                            ) : (
                                                <Button
                                                    className="vTop"
                                                    size="big"
                                                    color={status === 'SUCCESS' ? 'blue' : 'green'}
                                                    full={true}
                                                    handleOnClick={this.handleSave}
                                                >
                                                    {status === 'SUCCESS' ? 'Salvo com sucesso' : 'Salvar'}
                                                </Button>
                                            )
                                        }
                                    </div>
                                </div>
                            </Form>
                        </div>
                    </div>
                </Card>
            </section>
        );
    }
}

export default View;
