import React from 'react';

const InteractionLocation = ({className, customer}) => (
    <div className={`InteractionLocation ${className}`}>
        <div className="InteractionLocation__container">
            <div className="InteractionLocation__item">
                <span className="InteractionLocation__item__label">Pagina atual</span>
                <p className="InteractionLocation__item__text">
                    <a className="InteractionLocation__item__link" href={customer.pageSource} target="_blank">{customer.lastURL ? `/${customer.lastURL.split('/').pop()}` : ''}</a>
                </p>
            </div>

            <div className="InteractionLocation__item">
                <span className="InteractionLocation__item__label">Browser</span>
                <p className="InteractionLocation__item__text">{customer.browser}</p>
            </div>

            <div className="InteractionLocation__item">
                <span className="InteractionLocation__item__label">Sistema operacional</span>
                <p className="InteractionLocation__item__text">{customer.so}</p>
            </div>

            <div className="InteractionLocation__item">
                <span className="InteractionLocation__item__label">IP</span>
                <p className="InteractionLocation__item__text">{customer.ip}</p>
            </div>

            <div className="InteractionLocation__item">
                <span className="InteractionLocation__item__label">Histórico de navegação</span>
                <ul className="InteractionLocation__item__list">
                    {
                        customer.navigationHistory ? customer.navigationHistory.map((item, key) => {
                            return (
                                <li key={key}>
                                    <a href={item} className="InteractionLocation__item__link" target="_blank">
                                        {item ? `/${item.split('/').pop()}` : ''}
                                    </a>
                                </li>
                            );
                        }) : ''
                    }
                </ul>
            </div>
        </div>
    </div>
);

InteractionLocation.PropTypes = {
    className: React.PropTypes.string,
    customer: React.PropTypes.object
};

export default InteractionLocation;
