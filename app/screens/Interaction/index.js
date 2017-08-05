import AltContainer from 'alt-container';
import React from 'react';
import Screen from './Screen';
import {interactionStore, currentUserStore, viewsStore} from 'app/flux/Store';
import {interactionActions, viewsActions} from 'app/flux/Actions';

export default {
    path: '/interaction',
    component: (props) => <AltContainer stores={{interactionStore, currentUserStore, viewsStore}} actions={{interactionActions, viewsActions}} component={Screen} inject={{defaultProps: props}} />
};
