import AltContainer from 'alt-container';
import React from 'react';
import {viewsStore, currentUserStore} from 'app/flux/Store';
import {viewsActions, currentUserActions} from 'app/flux/Actions';
import Screen from './Screen';

export default (props) => <AltContainer stores={{viewsStore, currentUserStore}} actions={{viewsActions, currentUserActions}} component={Screen} inject={{defaultProps: props}} />;
