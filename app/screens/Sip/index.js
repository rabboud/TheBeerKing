import AltContainer from 'alt-container';
import React from 'react';
import {currentUserStore} from 'app/flux/Store';
import {interactionStore} from 'app/flux/Store';
import {visitorTrackerStore} from 'app/flux/Store';
import {departmentStore} from 'app/flux/Store';
import {mercadolivreStore} from 'app/flux/Store';
import Screen from './Screen';

export default {
    path: '/sip',
    component: (props) => <AltContainer stores={{currentUserStore, interactionStore, visitorTrackerStore, departmentStore, mercadolivreStore}} component={Screen} inject={{defaultProps: props}} />
};
