import AltContainer from 'alt-container';
import React from 'react';
import Screen from './Screen';

export default {
    path: '/code',
    component: (props) => <AltContainer component={Screen} inject={{defaultProps: props}} />
};
