import React from 'react';
import {InputText, InfiniteList, MessageListItem} from 'app/screens/Components';
import _ from 'lodash';
import {Form} from 'omz-react-validation/lib/build/validation.rc';

const MessageList = ({className, messages, searchable, handleLoadInteraction, title, handleTopList, type, itemColor, selectedItem, editableItem, handleEditItem}) => (
    <nav className="MessageList">
        <div className="MessageList__panel" data-searchable={`${searchable}`}>
            <Form>
                <InputText name="search" value="" placeholder="Busca por nome, data ou protocolo" validations={[]}/>
            </Form>
        </div>
        <InfiniteList scrollDirection="vertical">
            {_.map(messages, (message, key) => (
                <li className="MessageList__item" key={key}>
                    <MessageListItem
                        message={message}
                        handleItemClick={handleLoadInteraction}
                        title={title}
                        type={type}
                        color={itemColor}
                        isSelected={selectedItem ? selectedItem.hash === key : false}
                        editable={editableItem}
                        handleEdit={() => handleEditItem(key)}
                    />
                </li>
            ))}
        </InfiniteList>
    </nav>
);

MessageList.PropTypes = {
    className: React.PropTypes.string,
    messages: React.PropTypes.any,
    searchable: React.PropTypes.bool,
    handleLoadInteraction: React.PropTypes.func,
    title: React.PropTypes.string,
    type: React.PropTypes.string,
    itemColor: React.PropTypes.string,
    selectedItem: React.PropTypes.object,
    editableItem: React.PropTypes.bool,
    handleEditItem: React.PropTypes.func
};

export default MessageList;
