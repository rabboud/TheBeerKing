import React from 'react';
import {
    ModalDefault,
    Card,
    Form,
    InputText,
    SimpleList,
    Button
} from 'app/screens/Components';

class AddEditOfficeHour extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            showSuggestionPeriod: false,
            showSuggestionTimezone: false
        };
    }

    render () {
        return (
            <div className={`AddEditOfficeHour ${this.props.className}`}>
                <ModalDefault
                    isOpen={this.props.isOpen}
                    onRequestClose={this.props.onClose}
                    shouldCloseOnOverlayClick={true} className="AddEditOfficeHour__modal"
                    parentSelector={this.props.modalParentSelector}
                    cardContent={true}
                    isCentralized={true}
                >
                    <div className="AddEditOfficeHour__container">
                        <Card helpers="AddEditOfficeHour__container__card" contentPadded={true} title={this.props.title}>
                            <Form>
                                <InputText
                                    ref={(c) => this.name = c}
                                    type="text"
                                    value={this.props.data.name}
                                    name="name"
                                    placeholder="Nome"
                                    className="input--rounded input--border-gray"
                                    animation="input-animated"
                                    hasLabel={true}
                                    validations={['required']}
                                    onChange={this.props.onChange}
                                />
                                <InputText
                                    ref={(c) => this.period = c}
                                    type="select"
                                    placeholder="Período"
                                    name="period"
                                    className="input--rounded input--border-gray input--initial-color"
                                    animation="input-animated"
                                    disabled={true}
                                    sugestionOpen={this.state.showSuggestionPeriod}
                                    sugestion={
                                        <SimpleList
                                            container={this.props.periodContainer}
                                            maxHeight="200px"
                                            onClick={(index, e) => e.stopPropagation()}
                                        />
                                    }
                                    sugestionClass="input__select"
                                    sugestionDirection="bottom"
                                    value={this.props.period}
                                    hasLabel={true}
                                    validations={[]}
                                    onClick={() => this.setState({showSuggestionPeriod: !this.state.showSuggestionPeriod})}
                                />
                                <div className="row">
                                    <div className="large-6 columns">
                                        <InputText
                                            ref={(c) => this.hourFrom = c}
                                            type="text"
                                            value={this.props.data.hour.from}
                                            name="hourFrom"
                                            placeholder="Horário"
                                            className="input--rounded input--border-gray"
                                            animation="input-animated"
                                            hasLabel={true}
                                            validations={['required']}
                                            onChange={this.props.onChange}
                                            mask="00:00"
                                        />
                                    </div>
                                    <div className="large-6 columns">
                                        <InputText
                                            ref={(c) => this.hourTo = c}
                                            type="text"
                                            value={this.props.data.hour.to}
                                            name="hourTo"
                                            placeholder="Até"
                                            className="input--rounded input--border-gray"
                                            animation="input-animated"
                                            hasLabel={true}
                                            validations={['required']}
                                            onChange={this.props.onChange}
                                            mask="00:00"
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="large-6 columns">
                                        <InputText
                                            ref={(c) => this.intervalFrom = c}
                                            type="text"
                                            value={this.props.data.interval.from}
                                            name="intervalFrom"
                                            placeholder="Intervalo"
                                            className="input--rounded input--border-gray"
                                            animation="input-animated"
                                            hasLabel={true}
                                            validations={['required']}
                                            onChange={this.props.onChange}
                                            mask="00:00"
                                        />
                                    </div>
                                    <div className="large-6 columns">
                                        <InputText
                                            ref={(c) => this.intervalTo = c}
                                            type="text"
                                            value={this.props.data.interval.to}
                                            name="intervalTo"
                                            placeholder="Até"
                                            className="input--rounded input--border-gray"
                                            animation="input-animated"
                                            hasLabel={true}
                                            validations={['required']}
                                            onChange={this.props.onChange}
                                            mask="00:00"
                                        />
                                    </div>
                                </div>
                                <InputText
                                    ref={(c) => this.timezone = c}
                                    type="select"
                                    placeholder="Fuso Horário"
                                    name="timezone"
                                    className="input--rounded input--border-gray input--initial-color"
                                    animation="input-animated"
                                    disabled={true}
                                    sugestionOpen={this.state.showSuggestionTimezone}
                                    sugestion={
                                        <SimpleList
                                            container={this.props.timezonesContainer}
                                            maxHeight="200px"
                                            onClick={this.props.timezoneChanged}
                                        />
                                    }
                                    sugestionClass="input__select"
                                    sugestionDirection="up"
                                    value={this.props.data.timezoneName}
                                    hasLabel={true}
                                    validations={[]}
                                    onClick={() => this.setState({showSuggestionTimezone: !this.state.showSuggestionTimezone})}
                                    onCloseSugestion={() => this.setState({showSuggestionTimezone: false})}
                                />
                                <Button size="small" color="green-secondary" className="btn--large" full={true} handleOnClick={this.props.onSave}>
                                    {this.props.saveText}
                                </Button>
                            </Form>
                        </Card>
                    </div>
                </ModalDefault>
            </div>
        );
    }
}

AddEditOfficeHour.propTypes = {
    className: React.PropTypes.string,
    isOpen: React.PropTypes.bool.isRequired,
    title: React.PropTypes.string,
    saveText: React.PropTypes.string,
    periodContainer: React.PropTypes.array,
    period: React.PropTypes.string,
    timezonesContainer: React.PropTypes.array,
    timezones: React.PropTypes.array,
    modalParentSelector: React.PropTypes.func,
    onClose: React.PropTypes.func.isRequired,
    onSave: React.PropTypes.func.isRequired,
    onChange: React.PropTypes.func.isRequired,
    timezoneChanged: React.PropTypes.func.isRequired
};

AddEditOfficeHour.defaultProps = {
    className: '',
    title: 'Nova programação',
    saveText: 'Salvar'
};

export default AddEditOfficeHour;
