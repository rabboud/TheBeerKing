import React from 'react';
import ModalDefault from '../ModalDefault';
import Button from '../Button';
import Checkbox from '../Form/Checkbox';
import InputRadiobutton from '../Form/Radiobutton';
import Text from '../Text';
import _ from 'lodash';

class ModalFilter extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        const filterOptionsSelecteds = (filterIndex) => {
            return _.filter(this.props.filters[filterIndex].options, (option) => {
                return option.selected ? option : '';
            });
        };

        return (
            <ModalDefault
                className="ModalFilter"
                isOpen={this.props.isOpen}
                hasShadow={true}
                transparent={true}
                shouldCloseOnOverlayClick={true}
                onRequestClose={this.props.onCloseModal}
                parentSelector={this.props.modalParentSelector}
            >
                <div className={`ModalFilter__data-wrapper ${this.props.className}`} >
                    {
                        _.map(this.props.filters, (filter, index) =>
                            <div className="ModalFilter__data" key={index}>
                                <h4>{`Por ${filter.name}:`}</h4>
                                <div>
                                    {
                                        filter.selectAll ? (
                                            <div className="ModalFilter__options row" key="all">
                                                <div className="ModalFilter__options__check columns large-2">
                                                    {
                                                        filter.multiple ? (
                                                            <Checkbox
                                                                id={`Todos-${filter.id}`}
                                                                name={filter.name}
                                                                checked={filterOptionsSelecteds(index).length === filter.options.length}
                                                                onChange={() => this.props.handleOnChange(filter.id, -1, filterOptionsSelecteds(index).length === filter.options.length)}
                                                            />
                                                        ) : (
                                                            <InputRadiobutton
                                                                id={`Todos-${filter.id}`}
                                                                name={filter.name}
                                                                checked={filter.allChecked}
                                                                onChange={() => this.props.handleOnChange(filter.id, -1)}
                                                            />
                                                        )
                                                    }
                                                </div>

                                                <div className="ModalFilter__options__text columns large-10">
                                                    <label htmlFor={`Todos-${filter.id}`}>Todos</label>
                                                </div>
                                            </div>
                                        ) : ''
                                    }
                                </div>
                                <div>
                                    {
                                        _.map(filter.options, (value, valueKey) =>
                                            <div className="ModalFilter__options row" key={valueKey}>
                                                <div className="ModalFilter__options__check columns large-2">
                                                    {
                                                        filter.multiple ? (
                                                            <Checkbox id={value.name} name={filter.name} checked={value.selected} onChange={() => this.props.handleOnChange(filter.id, valueKey)}/>
                                                        ) : (
                                                            <InputRadiobutton id={value.name} name={filter.name} checked={value.selected} onChange={() => this.props.handleOnChange(filter.id, valueKey)}/>
                                                        )
                                                    }
                                                </div>

                                                <div className="ModalFilter__options__text columns large-10">
                                                    <label htmlFor={value.name}>{value.name}</label>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
                <div className="ModalFilter__footer">
                    <Button className="ModalFilter__button" size="big" color="green" handleOnClick={this.props.handleFilterClick}>
                        Aplicar filtros
                    </Button>
                    <Text
                        className="ModalFilter__footer__remove"
                        content="Remover filtro"
                        textColor="gray-primary"
                        textSize="small"
                        selectable={true}
                        inline={true}
                        underline={true}
                        onClick={this.props.onClearFilter}
                    />
                </div>
            </ModalDefault>
        );
    }
}

ModalFilter.PropTypes = {
    className: React.PropTypes.string,
    isOpen: React.PropTypes.bool,
    filters: React.PropTypes.arrayOf(React.PropTypes.object),
    handleOnChange: React.PropTypes.func,
    handleFilterClick: React.PropTypes.func,
    onCloseModal: React.PropTypes.func,
    modalParentSelector: React.PropTypes.func,
    onClearFilter: React.PropTypes.func.isRequired
};

export default ModalFilter;
