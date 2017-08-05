import React from 'react';
import {
    ModalDefault,
    Card,
    Form,
    InputText,
    ColorPicker,
    Icon,
    MessageListItem,
    Button
} from 'app/screens/Components';

class InteractionTag extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            showSuggestion: false
        };
    }

    _close () {
        this.setState({
            showSuggestion: false
        });
        this.props.closeTagModal();
    }

    render () {
        const attrMessage = {
            type: 'preview',
            tags: [{
                name: this.props.inputTextValue,
                baseColor: this.props.selectedColorTag
            }]
        };

        return (
            <div className={`InteractionTag ${this.props.className}`}>
                <ModalDefault
                    isOpen={this.props.openTagModal}
                    onRequestClose={this._close.bind(this)}
                    shouldCloseOnOverlayClick={true} className="InteractionTag__modal"
                    parentSelector={this.props.modalParentSelector}
                    cardContent={true}
                    isCentralized={true}
                >
                    <Card helpers="card--header-padding" contentPadded={true} title={this.props.titleCardModal} titleSize="medium">
                        <Form>
                            <InputText
                                ref={(c) => this.tagName = c}
                                type="text"
                                value={this.props.inputTextValue}
                                name="tagName"
                                sugestionOpen={this.state.showSuggestion}
                                sugestion={<ColorPicker colors={this.props.colorPickerColors} selectedColor={this.props.selectedColorTag} onClick={this.props.tagColorChanged}/>}
                                sugestionTitle="Escolha uma cor"
                                placeholder="Tag"
                                className="input--rounded input--border-gray"
                                animation="input-animated"
                                hasLabel={true}
                                actionIcons={[
                                    <Icon name="pencil" width="9.8px" height="10px" padding="5px 8px" bkgCircle={true} bkgColor={this.props.selectedColorTag} clickable={true} inline={true} handleClick={() => this.setState({showSuggestion: !this.state.showSuggestion})} />
                                ]}
                                validations={[]}
                                onChange={this.props.tagNameChanged}
                                onCloseSugestion={() => this.setState({showSuggestion: false})}
                            />
                            <MessageListItem className="InteractionTag__preview" message={attrMessage} title="preview" type="preview" color="gray" clickable={false}/>
                            <Button size="medium" color="green-secondary" className="btn--large" full={true} handleOnClick={this.props.saveTag}>
                                Salvar
                            </Button>
                        </Form>
                    </Card>
                </ModalDefault>
            </div>
        );
    }
}

InteractionTag.PropTypes = {
    className: React.PropTypes.string,
    inputTextValue: React.PropTypes.string,
    sizeTagModal: React.PropTypes.string,
    colorPickerColors: React.PropTypes.any,
    selectedColorTag: React.PropTypes.string,
    openTagModal: React.PropTypes.bool.isRequired,
    titleCardModal: React.PropTypes.string,
    tagNameChanged: React.PropTypes.func,
    tagColorChanged: React.PropTypes.func,
    saveTag: React.PropTypes.func,
    closeTagModal: React.PropTypes.func.isRequired,
    modalParentSelector: React.PropTypes.func,
    openSugestion: React.PropTypes.func
};

export default InteractionTag;
