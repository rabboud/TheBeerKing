import AltContainer from 'alt-container';
import React from 'react';
import Screen from './Screen';
import {interactionActions, visitorTrackerActions, accountActions, userActions, tagActions} from 'app/flux/Actions';
import {interactionStore, visitorTrackerStore, accountStore, userStore, tagStore, currentUserStore, viewsStore} from 'app/flux/Store';

export default {
    path: '/dashboard',
    component: (props) => (
        <AltContainer
            component={Screen}
            actions={{interactionActions, visitorTrackerActions, accountActions, userActions, tagActions}}
            stores={{interactionStore, visitorTrackerStore, accountStore, userStore, tagStore, currentUserStore, viewsStore}}
            inject={{defaultProps: props}}
        />
    )
};
