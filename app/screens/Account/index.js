import AltContainer from 'alt-container';
import React from 'react';
import Screen from './Screen';
import {accountActions} from 'app/flux/Actions';
import {accountStore, currentUserStore, userStore, viewsStore} from 'app/flux/Store';

export default {
    path: '/account',
    component: (props) => (
        <AltContainer
            component={Screen}
            stores={{accountStore, currentUserStore, userStore, viewsStore}}
            actions={{accountActions}}
            inject={{defaultProps: props}}
        />
    )
};
