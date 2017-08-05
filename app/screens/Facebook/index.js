import AltContainer from 'alt-container';
import React from 'react';
import Screen from './Screen';
import {facebookActions, departmentActions, tableActions, viewsActions} from 'app/flux/Actions';
import {facebookStore, departmentStore, currentUserStore, tableStore, viewsStore} from 'app/flux/Store';

export default {
    path: '/facebook',
    component: (props) => (
        <AltContainer
            component={Screen}
            stores={{facebookStore, departmentStore, currentUserStore, tableStore, viewsStore}}
            actions={{facebookActions, departmentActions, tableActions, viewsActions}}
            inject={{defaultProps: props}}
        />
    )
};
