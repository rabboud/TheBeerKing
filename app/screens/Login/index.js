import AltContainer from 'alt-container';
import React from 'react';
import Screen from './Screen';
import {currentUserStore, viewsStore} from 'app/flux/Store';
import {currentUserActions, viewsActions} from 'app/flux/Actions';

export default {
    path: '/login',
    component: (props) => (
        <AltContainer
            stores={{currentUserStore, viewsStore}}
            actions={{currentUserActions, viewsActions}}
            component={Screen}
            inject={{defaultProps: props}}
        />
    )
};
