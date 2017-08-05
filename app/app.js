import 'app/screens/Components/style/main.sass';
import React from 'react';
import {AppControl} from 'app/screens/Components';

// QUICK FIX TO REMOVE ALT WARNINGS
console.warn = () => {};

export default ({children}) => {
    return (
        <AppControl>
            {children}
        </AppControl>
    );
};
