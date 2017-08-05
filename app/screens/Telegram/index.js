import AltContainer from 'alt-container';
import React from 'react';
import Screen from './Screen';
import {telegramActions, tableActions, departmentActions, filterActions, viewsActions, channelActions} from 'app/flux/Actions';
import {telegramStore, currentUserStore, tableStore, departmentStore, filterStore, viewsStore, channelStore} from 'app/flux/Store';

export default {
    path: '/telegram',
    component: (props) => (
        <AltContainer
            component={Screen}
            stores={{telegramStore, currentUserStore, tableStore, departmentStore, filterStore, viewsStore, channelStore}}
            actions={{telegramActions, tableActions, departmentActions, filterActions, viewsActions, channelActions}}
            inject={{defaultProps: props}}
        />
    )
};
