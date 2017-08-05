import AltContainer from 'alt-container';
import React from 'react';
import Screen from './Screen';
import {currentUserActions, interactionActions, tableActions, viewsActions, filterActions} from 'app/flux/Actions';
import {currentUserStore, interactionStore, viewsStore, tableStore, departmentStore, filterStore} from 'app/flux/Store';

export default {
    path: '/inbox',
    component: (props) => <AltContainer stores={{currentUserStore, interactionStore, viewsStore, tableStore, departmentStore, filterStore}} actions={{currentUserActions, interactionActions, tableActions, viewsActions, filterActions}} component={Screen} inject={{defaultProps: props}} />
};
