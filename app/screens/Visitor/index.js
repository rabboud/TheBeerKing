import AltContainer from 'alt-container';
import React from 'react';
import Screen from './Screen';
import {visitorTrackerActions} from 'app/flux/Actions';
import {currentUserStore, visitorTrackerStore, appearanceStore, departmentStore, interactionStore, viewsStore} from 'app/flux/Store';

export default {
    path: '',
    component: (props) => (
        <AltContainer
            stores={{currentUserStore, visitorTrackerStore, appearanceStore, departmentStore, interactionStore, viewsStore}}
            actions={{visitorTrackerActions}}
            component={Screen}
            inject={{defaultProps: props}}
        />
    )
};
