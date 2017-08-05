import AltContainer from 'alt-container';
import React from 'react';
import {viewsStore} from 'app/flux/Store';
import {viewsActions} from 'app/flux/Actions';
import Screen from './Screen';

export default (props) => <AltContainer stores={{viewsStore}} actions={{viewsActions}} component={Screen} inject={{defaultProps: props}} />;
