import AltContainer from 'alt-container';
import React from 'react';
import Screen from './Screen';
import {tableStore, filterStore, currentUserStore, userStore, viewsStore, profileStore} from 'app/flux/Store';
import {tableActions, viewsActions, filterActions, userActions, profileActions} from 'app/flux/Actions';


export default {
    path: '/users',
    component: (props) => (
        <AltContainer
            component={Screen}
            stores={{tableStore, filterStore, currentUserStore, userStore, viewsStore, profileStore}}
            actions={{tableActions, userActions, viewsActions, filterActions, profileActions}}
            inject={{defaultProps: props}}
        />
    )
};
