import React from 'react';
import Moment from 'moment';
import ModalDefault from '../ModalDefault';
import DatePicker from '../DatePicker';
import Text from '../Text';
import Button from '../Button';

class PeriodModal extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            startDate: Moment(),
            endDate: Moment(),
            focusedDate: 'startDate'
        };
    }

    _changeFocusDatePicker (focusedInput) {
        if (focusedInput === null) {
            return;
        }

        this.setState({
            'focusedDate': focusedInput
        });
    }

    _changePeriod (days) {
        const startDate = Moment().subtract(days, 'day');

        this.setState({
            startDate: startDate,
            endDate: Moment(),
            focusedDate: 'endDate'
        });
    }

    _checkPeriodSelected (day) {
        return this.state.endDate && this.state.endDate.date() === Moment().date() && this.state.endDate.diff(this.state.startDate, 'days') === day;
    }

    _clearFilter () {
        this.setState({
            startDate: '',
            endDate: '',
            focusedDate: 'startDate'
        });
        this.props.onClearFilter();
    }

    render () {
        return (
            <ModalDefault
                className="PeriodModal"
                isOpen={this.props.isOpen}
                hasShadow={true}
                transparent={true}
                shouldCloseOnOverlayClick={true}
                onRequestClose={this.props.onCloseModal}
                parentSelector={this.props.modalParentSelector}
            >
                <div className="PeriodModal__container">
                    <div className="PeriodModal__period">
                        <div className="PeriodModal__period__title">
                            <Text content="Por periodo:" textSize="small" textBold="medium"/>
                        </div>
                        <div className="PeriodModal__period__select">
                            <Text
                                className={`PeriodModal__period__select__item ${this._checkPeriodSelected(6) ? 'PeriodModal__period__select__item--selected' : ''}`}
                                content="7 dias"
                                textColor="gray-primary"
                                selectable={true}
                                inline={true}
                                onClick={() => this._changePeriod(6)}
                            />
                            <Text
                                className={`PeriodModal__period__select__item ${this._checkPeriodSelected(29) ? 'PeriodModal__period__select__item--selected' : ''}`}
                                content="30 dias"
                                textColor="gray-primary"
                                selectable={true}
                                inline={true}
                                onClick={() => this._changePeriod(29)}
                            />
                            <Text
                                className={`PeriodModal__period__select__item ${this._checkPeriodSelected(89) ? 'PeriodModal__period__select__item--selected' : ''}`}
                                content="90 dias"
                                textColor="gray-primary"
                                selectable={true}
                                inline={true}
                                onClick={() => this._changePeriod(89)}
                            />
                        </div>
                    </div>
                    <div className="PeriodModal__date">
                        <div className="PeriodModal__date__title">
                            <Text content="Selecionar um periodo" textSize="small" textBold="medium"/>
                        </div>
                        <DatePicker
                            onFocusChange={this._changeFocusDatePicker.bind(this)}
                            focusedDate={this.state.focusedDate}
                            startDate={this.state.startDate}
                            endDate={this.state.endDate}
                            onChange={({startDate, endDate}) => this.setState({startDate, endDate})}
                        />
                    </div>
                    <div className="PeriodModal__actions">
                        <Button className="PeriodModal__actions__apply"
                            size="small"
                            color="green"
                            textSize="big"
                            large={true}
                            handleOnClick={() => this.props.onApplyFilter(this.state.startDate, this.state.endDate)}
                        >
                            Aplicar filtro
                        </Button>
                        <Text
                            className="PeriodModal__actions__remove"
                            content="Remover filtro"
                            textColor="gray-primary"
                            textSize="small"
                            selectable={true}
                            inline={true}
                            underline={true}
                            onClick={this._clearFilter.bind(this)}
                        />
                    </div>
                </div>
            </ModalDefault>
        );
    }
}

PeriodModal.PropTypes = {
    className: React.PropTypes.string,
    isOpen: React.PropTypes.bool.isRequired,
    modalParentSelector: React.PropTypes.func,
    onCloseModal: React.PropTypes.func,
    onApplyFilter: React.PropTypes.func.isRequired,
    onClearFilter: React.PropTypes.func.isRequired
};

export default PeriodModal;
