import React from 'react';
import _ from 'lodash';
import Text from '../Text';
import Icon from '../Icon';

class Accordion extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            itemContainerSize: 0
        };
    }

    componentDidMount () {
        this._calcItemContainerHeight();
    }

    _calcItemContainerHeight () {
        const itemsCount = this.accordionList.children.length;
        const itemsSize = 50;
        const itemsMargin = 5;
        const totalMargin = (itemsCount - 1) * itemsMargin;

        this.setState({
            itemContainerSize: this.accordion.offsetHeight - ((itemsCount * itemsSize) + totalMargin)
        });
    }

    render () {
        return (
            <div
                className="Accordion"
                ref={(c) => this.accordion = c}
            >
                <ul
                    className={`Accordion__list ${this.props.className}`}
                    ref={(c) => this.accordionList = c}
                >
                    {
                        _.map(this.props.items, (item, key) => (
                            <li
                                className="Accordion__item"
                                style={this.props.activeIndex === key ? {height: `${this.state.itemContainerSize + 50}px`} : {}}
                                data-active={this.props.activeIndex === key}
                                key={key}
                            >
                                <div
                                    className="Accordion__item__container"
                                    onClick={() => this.props.onItemClick(key)}
                                >
                                    <Text
                                        className="Accordion__item__title"
                                        content={item.name}
                                        textColor={this.props.activeIndex === key ? 'white' : 'black'}
                                        type="title"
                                        inline={true}
                                    />
                                    <Icon
                                        iconClass="Accordion__item__icon"
                                        strokeColor={this.props.activeIndex === key ? 'white' : null}
                                        name="chevron"
                                        width="18px"
                                        inline={true}
                                        rotate={this.props.activeIndex === key ? null : '180'}
                                    />
                                </div>
                                <div
                                    className="Accordion__item__panel"
                                    style={{height: `${this.state.itemContainerSize}px`}}
                                >
                                    {item.panel}
                                </div>
                            </li>
                        ))
                    }
                </ul>
            </div>
        );
    }
}

Accordion.PropTypes = {
    className: React.PropTypes.string,
    activeIndex: React.PropTypes.number,
    items: React.PropTypes.array,
    onItemClick: React.PropTypes.func
};

export default Accordion;
