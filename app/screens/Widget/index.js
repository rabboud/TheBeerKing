import AltContainer from 'alt-container';
import React from 'react';
import Screen from './Screen';
import {currentUserStore, widgetStore, viewsStore} from 'app/flux/Store';
import {widgetActions} from 'app/flux/Actions';

export default {
    path: '/widget',
    component: (props) => (
        <AltContainer
            component={Screen}
            stores={{currentUserStore, widgetStore, viewsStore}}
            actions={{widgetActions}}
            inject={{defaultProps: props}}
        />
    )
};
