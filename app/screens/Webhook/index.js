import AltContainer from 'alt-container';
import React from 'react';
import Screen from './Screen';
import {webhookActions, tableActions, filterActions, viewsActions, channelActions} from 'app/flux/Actions';
import {webhookStore, currentUserStore, tableStore, filterStore, viewsStore, channelStore} from 'app/flux/Store';

export default {
    path: '/webhooks',
    component: (props) => (
        <AltContainer
            component={Screen}
            stores={{webhookStore, currentUserStore, tableStore, filterStore, viewsStore, channelStore}}
            actions={{webhookActions, tableActions, filterActions, viewsActions, channelActions}}
            inject={{defaultProps: props}}
        />
    )
};
