import React from 'react';
import {Card, StateMessage} from 'app/screens/Components';

class Component extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <section className="meli">
                <Card
                    helpers="card--full-height card--header-padding"
                    contentPadded={true}
                    title="Mercado Livre"
                >
                    <StateMessage
                        middle={true}
                        icon="meli"
                        iconColor="default"
                        context="Estamos finalizando o processo de configuração do canal do Mercado Livre"
                        subContent={(
                            <p>
                                No meio tempo, entre em contato conosco pelo <a href="mailto:suporte@omnize.com.br">suporte@omnize.com.br</a> para cadastrar este canal.
                            </p>
                        )}
                    />
                </Card>
            </section>
        );
    }
}

export default Component;
