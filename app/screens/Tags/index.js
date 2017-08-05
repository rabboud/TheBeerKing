import AltContainer from 'alt-container';
import React from 'react';
import Screen from './Screen';
import {tableActions, tagActions, viewsActions, filterActions} from 'app/flux/Actions';
import {tableStore, filterStore, tagStore, currentUserStore, userStore, viewsStore} from 'app/flux/Store';

export default {
    path: '/tags',
    component: (props) => <AltContainer component={Screen} stores={{tableStore, filterStore, tagStore, currentUserStore, userStore, viewsStore}} actions={{tableActions, tagActions, viewsActions, filterActions}} inject={{defaultProps: props}} />
};
