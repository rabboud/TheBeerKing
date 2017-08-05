import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

const ClipboardCopy = ({text, onCopy, options, children}) => (
    <CopyToClipboard
        text={text}
        onCopy={onCopy}
        options={options}
    >
        {children}
    </CopyToClipboard>
);

ClipboardCopy.PropTypes = {
    text: React.PropTypes.string,
    options: React.PropTypes.object,
    onCopy: React.PropTypes.func
};

export default ClipboardCopy;
