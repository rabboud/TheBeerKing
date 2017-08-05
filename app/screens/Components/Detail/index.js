import React from 'react';
import {TimeHelper} from 'app/helpers';
import {Card, Icon, StateMessage} from 'app/screens/Components';

const title = (<h3 className="title title--card">Detalhes</h3>);

const userDefault = {
    customerName: '',
    pagesAccessed: null,
    department: '',
    onSite: null,
    pageUrl: '',
    os: '',
    browser: '',
    ip: '',
    channel: '',
    interactionState: '',
    navigations: null,
    referrer: '',
    locationAccess: {
        country: '',
        regionState: ''
    },
    visits: null,
    customerEmail: '',
    id: '',
    dateAccess: null,
    customerId: ''
};

const Component = ({handler, show, user, handleOpenInvite, handleCloseDetails}) => {
    const data = user.data[0] ? user.data[0] : userDefault;
    const detailActions = [
        {
            component: <Icon name="back" iconClass="icon--clickable icon--circle icon--blue-primary" width="20px" height="14px" padding="13px 10px" handleClick={handleCloseDetails} />
        },
        {
            component: <Icon name="balloon" iconClass={`icon--clickable icon--circle ${data.interactionState === 'Convidado' ? 'icon--bkg-dove-gray' : 'icon--bkg-green'}`} width="20px" height="14px" padding="13px 10px" handleClick={handleOpenInvite} />
        }
    ];

    return (<div className="detail">
        <Card helpers={`card--full-height card--col-5 card--padding-l-10 ${show ? 'card--show' : 'card--hide'}`} title={title} scrollable={true} header={detailActions}>
            {
                user.state === 'ERROR' || user.state === 'TIMEOUT' ? (
                    <StateMessage
                        messageState={user.state}
                        middle={true}
                        icon="viewers"
                        context={'Busca dos detalhes do visitante'}
                        autoRetry={true}
                    />
                ) : (
                    <div className="detail__itens">
                        <div className="detail__item">
                            <span className="detail__item__label">Nome:</span>
                            <p className="detail__item__text">{data.customerName}</p>
                        </div>

                        <div className="detail__item">
                            <span className="detail__item__label">Email:</span>
                            <p className="detail__item__text">{data.customerEmail}</p>
                        </div>

                        <div className="detail__group">
                            <div className="detail__group__container detail__group__container--no-bottom">
                                <div className="detail__item">
                                    <span className="detail__item__label">Status:</span>
                                    <p className="detail__item__text">{data.interactionState}</p>
                                </div>

                                <div className="detail__item">
                                    <span className="detail__item__label">Visitas:</span>
                                    <p className="detail__item__text">{data.visits}</p>
                                </div>

                                <div className="detail__item">
                                    <span className="detail__item__label">Tempo no site:</span>
                                    <p className="detail__item__text">{data.dateAccess ? TimeHelper.getDiffFromNow(data.dateAccess, true, 'HH:mm:ss') : ''}</p>
                                </div>
                            </div>
                        </div>

                        <div className="detail__group">
                            <div className="detail__group__container">
                                <div className="detail__item">
                                    <span className="detail__item__label">Departamento:</span>
                                    <p className="detail__item__text">{data.department}</p>
                                </div>

                                <div className="detail__item">
                                    <span className="detail__item__label">Canal:</span>
                                    <p className="detail__item__text">{data.channel}</p>
                                </div>

                                <div className="detail__item">
                                    <span className="detail__item__label">Atendente:</span>
                                    <p className="detail__item__text">{data.attendant}</p>
                                </div>
                            </div>
                        </div>

                        <div className="detail__item">
                            <span className="detail__item__label">URL Atual:</span>
                            <a href={data.pageUrl} className="detail__item__link" title={data.pageUrl} target="_blank">{data.pageUrl}</a>
                        </div>

                        <div className="detail__item">
                            <span className="detail__item__label">Histórico de navegação</span>
                            <ul className="detail__item__list">
                                {
                                    data.navigations ? data.navigations.map((item, key) => {
                                        return (<li key={key}>
                                            <a href={item.pageUrl} className="detail__item__link" target="_blank">{item.pageUrlMin}</a>
                                            <span className="detail__item__time">{TimeHelper.getDiffFromNow(item.dateAccess, true, 'HH:mm:ss')}</span>
                                        </li>);
                                    }) : ''
                                }
                            </ul>
                        </div>

                        <div className="detail__item">
                            <span className="detail__item__label">Origem do visitante:</span>
                            <a href={data.referrer} className="detail__item__link" title={data.referrer} target="_blank">{data.referrer}</a>
                        </div>

                        <div className="detail__item">
                            <span className="detail__item__label">Navegador:</span>
                            <p className="detail__item__text">{data.browser}</p>
                        </div>

                        <div className="detail__item">
                            <span className="detail__item__label">Sistema Operacional:</span>
                            <p className="detail__item__text">{data.os}</p>
                        </div>

                        <div className="detail__item">
                            <span className="detail__item__label">Localização / IP:</span>
                            <p className="detail__item__text">{data.locationAccess.regionState}, {data.locationAccess.country} / {data.ip}</p>
                        </div>
                    </div>
                )
            }
        </Card>
    </div>);
};

Component.propTypes = {
    handler: React.PropTypes.func,
    show: React.PropTypes.bool,
    user: React.PropTypes.object,
    handleOpenInvite: React.PropTypes.func,
    handleCloseDetails: React.PropTypes.func
};

export default Component;
