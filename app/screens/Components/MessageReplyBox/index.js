import React from 'react';

const MessageReplyBox = ({className, disabled, children}) => (
    <div className="MessageReplyBox">{children}</div>
);

MessageReplyBox.PropTypes = {
    className: React.PropTypes.string,
    disabled: React.PropTypes.bool
};

export default MessageReplyBox;
