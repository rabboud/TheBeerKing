import AltContainer from 'alt-container';
import React from 'react';
import {currentUserStore, interactionStore, viewsStore} from 'app/flux/Store';
import {currentUserActions, interactionActions, viewsActions} from 'app/flux/Actions';
import Screen from './Screen';

export default (props) => <AltContainer stores={{currentUserStore, interactionStore, viewsStore}} actions={{currentUserActions, interactionActions, viewsActions}} component={Screen} inject={{defaultProps: props}} />;
