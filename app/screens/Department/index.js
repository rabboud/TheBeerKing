import AltContainer from 'alt-container';
import React from 'react';
import Screen from './Screen';
import {departmentActions, tableActions, filterActions, viewsActions, channelActions} from 'app/flux/Actions';
import {departmentStore, currentUserStore, tableStore, filterStore, viewsStore, channelStore} from 'app/flux/Store';

export default {
    path: '/departments',
    component: (props) => (
        <AltContainer
            component={Screen}
            stores={{departmentStore, currentUserStore, tableStore, filterStore, viewsStore, channelStore}}
            actions={{departmentActions, tableActions, filterActions, viewsActions, channelActions}}
            inject={{defaultProps: props}}
        />
    )
};
