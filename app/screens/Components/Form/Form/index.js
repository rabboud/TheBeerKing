import React from 'react';
import {Form} from 'omz-react-validation/lib/build/validation.rc';

const Component = ({className, children, onSubmit}) => (
    <Form className={`Form ${className}`} onSubmit={onSubmit}>
        {children}
    </Form>
);

Component.PropTypes = {
    className: React.PropTypes.string,
    onSubmit: React.PropTypes.func
};

export default Component;
