import React from 'react';
import {Code} from 'app/screens/Components';
import {currentUserStore} from 'app/flux/Store';

class Component extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <section className="code">
                <div className="code__container">
                    <h3 className="title title--secondary">Código do widget</h3>
                    <p className="text text--tertiary">Copie o script abaixo e insira no rodapé do código-fonte HTML de seu site. Este código deve ser inserido em todas as páginas em que você deseja exibir o widget Omnize.</p>
                    <Code id={currentUserStore.state.information.account.id} />
                    <p className="text text--secondary">Usa alguma plataforma? Veja os tutoriais abaixo</p>
                    <iframe className="code__tutorials" src="https://omnize.github.io/tutorials"></iframe>
                </div>
            </section>
        );
    }
}

export default Component;

