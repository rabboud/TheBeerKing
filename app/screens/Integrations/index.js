import AltContainer from 'alt-container';
import React from 'react';
import Screen from './Screen';
import {webhookActions, rdstationActions, tableActions, filterActions, viewsActions, channelActions, accountActions} from 'app/flux/Actions';
import {webhookStore, rdstationStore, currentUserStore, tableStore, filterStore, viewsStore, channelStore, departmentStore, accountStore} from 'app/flux/Store';

export default {
    path: '/integrations',
    component: (props) => (
        <AltContainer
            component={Screen}
            stores={{webhookStore, rdstationStore, currentUserStore, tableStore, filterStore, viewsStore, channelStore, departmentStore, accountStore}}
            actions={{webhookActions, rdstationActions, tableActions, filterActions, viewsActions, channelActions, accountActions}}
            inject={{defaultProps: props}}
        />
    )
};
