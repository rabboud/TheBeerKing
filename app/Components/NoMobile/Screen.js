import React from 'react';
import {
    Card,
    Icon
} from 'app/screens/Components';

class NoMobile extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <section className="NoMobile">
                <Card
                    helpers="card--full-height card--header-padding"
                >
                    <div className="rythm--center centralize">
                        <Icon
                            name="mobile-owl"
                            iconClass="icon--circle"
                            width="90px"
                            height="90px"
                        />
                        <h3 className="rythm--margin-t-1 rythm--margin-b-1 text--secondary text--gray--quinquennary centralize">
                            Ooops! Por favor, acesse via tablet ou computador
                        </h3>
                        <p className="rythm--margin-t-1 text--quaternary text--gray--quinquennary centralize">
                             Infelizmente a plataforma Omnize ainda não está otimizada para uso em celular.
                        </p>
                    </div>
                </Card>
            </section>
        );
    }
}

export default NoMobile;
