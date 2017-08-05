import AltContainer from 'alt-container';
import React from 'react';
import Screen from './Screen';
import {officeHoursActions, tableActions, filterActions, viewsActions, channelActions} from 'app/flux/Actions';
import {officeHoursStore, currentUserStore, tableStore, filterStore, viewsStore, channelStore} from 'app/flux/Store';

export default {
    path: '/officeHour',
    component: (props) => (
        <AltContainer
            component={Screen}
            stores={{officeHoursStore, currentUserStore, tableStore, filterStore, viewsStore, channelStore}}
            actions={{officeHoursActions, tableActions, filterActions, viewsActions, channelActions}}
            inject={{defaultProps: props}}
        />
    )
};
