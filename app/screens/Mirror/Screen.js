import React from 'react';
import {Loader} from 'app/screens/Components';

class View extends React.Component {
    render () {
        const mainStyle = {
            width: '100vw',
            height: '100vh',
            position: 'fixed',
            top: 0,
            left: 0,
            background: '#fff',
            zIndex: '999999'
        };

        return (
            <section className="columns" style={mainStyle}>
                <div className="columns large-centered centralize rythm--center">
                    <Loader color="black"/>
                </div>
            </section>
        );
    }
}

export default View;
