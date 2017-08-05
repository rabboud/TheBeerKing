import React from 'react';
import _ from 'underscore';
import {
    ModalDefault,
    Card,
    Form,
    InputText,
    SimpleList,
    Button
} from 'app/screens/Components';

class AddEditEmail extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            showSuggestion: false
        };
    }

    render () {
        const parsedDepartments = () => {
            const departments = [];

            _.map(this.props.data.departments, (department, key) => {
                departments.push({
                    id: department.id,
                    content: (
                        <div className="row">
                            <div className="text--wrap options__text columns large-12">
                                <label>{department.name}</label>
                            </div>
                        </div>
                    )
                });
            });
            return departments;
        };

        const selectedDepartment = this.props.data.departments.find((department) => {
            return department.selected;
        });

        const saveLabel = () => {
            let label;

            switch (this.props.data.status) {
                case 'INVALID DEPARTMENT':
                    label = 'Selecione um departamento';
                    break;
                case 'INVALID EMAIL':
                    label = 'E-mail inválido';
                    break;
                case '':
                    label = 'Salvar alterações';
                    break;
                default:
                    label = 'Salvar alterações';
                    break;
            }

            return label;
        };

        return (
            <div className={`AddEditEmail ${this.props.className}`}>
                <ModalDefault
                    isOpen={this.props.isOpen}
                    onRequestClose={this.props.onClose}
                    shouldCloseOnOverlayClick={true}
                    className="AddEditEmail__modal"
                    parentSelector={this.props.modalParentSelector}
                    cardContent={true}
                    isCentralized={true}
                >
                    <div className="AddEditEmail__container">
                        <Card helpers="AddEditEmail__card" contentPadded={true} title="E-mail">
                            <Form onSubmit={(e) => e.preventDefault()}>
                                <div className="AddEditEmail__content">
                                    <InputText
                                        ref={(c) => this.email = c}
                                        type="text"
                                        value={this.props.data.email}
                                        name="email"
                                        placeholder="Informe o e-mail"
                                        className="input--rounded input--border-gray rythm--margin-b-1"
                                        animation="input-animated"
                                        hasLabel={true}
                                        validations={['required']}
                                        onChange={this.props.onChange}
                                    />
                                    <InputText
                                        ref={(c) => this.department = c}
                                        type="select"
                                        placeholder="Departamento"
                                        name="department"
                                        className="input--rounded input--border-gray input--initial-color"
                                        animation="input-animated"
                                        disabled={true}
                                        sugestionOpen={this.state.showSuggestion}
                                        sugestion={
                                            <SimpleList
                                                container={parsedDepartments()}
                                                maxHeight="200px"
                                                onClick={this.props.departmentChanged}
                                            />
                                        }
                                        sugestionClass="input__select"
                                        sugestionDirection="bottom"
                                        value={selectedDepartment ? selectedDepartment.name : ''}
                                        hasLabel={true}
                                        validations={[]}
                                        onClick={() => this.setState({showSuggestion: !this.state.showSuggestion})}
                                    />
                                </div>
                                <Button
                                    size="big"
                                    color={
                                        this.props.data.status.match('INVALID') ? 'red' : 'green-secondary'
                                    }
                                    className="btn--large rythm--margin-t-13"
                                    full={true}
                                    handleOnClick={this.props.onSave}
                                >
                                    {saveLabel()}
                                </Button>
                            </Form>
                        </Card>
                    </div>
                </ModalDefault>
            </div>
        );
    }
}

AddEditEmail.PropTypes = {
    className: React.PropTypes.string,
    isOpen: React.PropTypes.bool,
    data: React.PropTypes.object,
    departmentContainer: React.PropTypes.object,
    departmentChanged: React.PropTypes.func,
    onClose: React.PropTypes.func,
    modalParentSelector: React.PropTypes.func,
    onChange: React.PropTypes.func,
    onSave: React.PropTypes.func
};

export default AddEditEmail;
