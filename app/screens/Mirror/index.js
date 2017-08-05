import React from 'react';
import AltContainer from 'alt-container';
import Screen from './Screen';
import {currentUserStore} from 'app/flux/Store';
import {currentUserActions} from 'app/flux/Actions';

export default {
    path: '/mirror',
    component: (props) => <AltContainer stores={{currentUserStore}} actions={{currentUserActions}} component={Screen} inject={{defaultProps: props}} />
};
