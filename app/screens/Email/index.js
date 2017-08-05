import AltContainer from 'alt-container';
import React from 'react';
import Screen from './Screen';
import {emailActions, departmentActions, tableActions, viewsActions} from 'app/flux/Actions';
import {emailStore, departmentStore, currentUserStore, tableStore, viewsStore} from 'app/flux/Store';

export default {
    path: '/email',
    component: (props) => (
        <AltContainer
            component={Screen}
            stores={{emailStore, departmentStore, currentUserStore, tableStore, viewsStore}}
            actions={{emailActions, departmentActions, tableActions, viewsActions}}
            inject={{defaultProps: props}}
        />
    )
};
