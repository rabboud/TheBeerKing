import AltContainer from 'alt-container';
import React from 'react';
import {viewsActions, currentUserActions} from 'app/flux/Actions/';
import {viewsStore, currentUserStore} from 'app/flux/Store';
import Screen from './Screen';

export default (props) => <AltContainer stores={{viewsStore, currentUserStore}} actions={{viewsActions, currentUserActions}} component={Screen} inject={{defaultProps: props}} />;
