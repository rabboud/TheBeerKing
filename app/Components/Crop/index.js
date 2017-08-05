import AltContainer from 'alt-container';
import React from 'react';
import {currentUserStore, viewsStore} from 'app/flux/Store';
import {currentUserActions, viewsActions} from 'app/flux/Actions';
import Screen from './Screen';

export default (props) => <AltContainer stores={{currentUserStore, viewsStore}} actions={{currentUserActions, viewsActions}} component={Screen} inject={{defaultProps: props}} />;
