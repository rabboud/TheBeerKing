import AltContainer from 'alt-container';
import React from 'react';
import Screen from './Screen';

export default (props) => <AltContainer component={Screen} inject={{defaultProps: props}} />;
