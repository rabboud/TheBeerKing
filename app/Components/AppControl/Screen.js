import React from 'react';
import _ from 'lodash';
import {browserHistory} from 'react-router';
import {OmzHistory} from 'app/services';
import {IntlProvider, addLocaleData} from 'react-intl';
import pt from 'react-intl/locale-data/pt';
import {Header, LeftMenu, Crop, OfflineModal, OfficeHoursModal, NoMobile, OMZHelmet, Loader} from 'app/screens/Components';
import {
    facebookActions,
    departmentActions
} from 'app/flux/Actions';

class AppControl extends React.Component {
    constructor (props) {
        super(props);
        this.reconnectingInteractions = {};
        this.brandName = 'Omnize';
        this.getStats = null;

        addLocaleData(pt);
    }

    componentWillMount () {
        this._checkSession();
        this._bootstrap();

        // When route was changed
        browserHistory.listen((location) => {
            viewsActions.closedAllMenus();
            this._loadDataForPath(location.pathname);
        });
    }

    componentDidUpdate () {
        this._isInteractionsOnReconnecting();
    }

    _createCheckForPageReload () {
        window.onbeforeunload = (e) => {
            if (this._hasActiveInteraction()) {
                const event = e || window.event;

                if (e) {
                    event.returnValue = 'Tem certeza?';
                }

                return 'Tem certeza?';
            }
        };
    }

    _hasActiveInteraction () {
        return !(_.isEmpty(this.props.interactionStore.interactions));
    }

    _checkSession () {
        const token = OmzHistory.getParameter('token');

        this.props.currentUserActions.fetchJWTSession(
            token,
            (accountId) => {
                this._loadDataForPath(OmzHistory.getLocation(), accountId);
            }
        );
    }

    _bootstrap () {
        this._checkIfPartner();
        this._fetchInboxCount();
        this._getInbox();
        this._addChecksForInternetConnection();
        this._createInboxCountInterval();
        this._checkPermission();
        this._createCheckForPageReload();
        this._addChecksForWindowFocus();
        this.bootstraped = true;
    }

    _checkIfPartner () {
        const ignoreNames = ['login.beta', '127.0.0.1'];
        const partner = OmzHistory.getUri().split('.omnize.com.br')[0];

        if (ignoreNames.indexOf(partner) === -1) {
            this.props.viewsActions.fetchPartnerInfo(partner);
        }
    }

    _checkPermission (path) {
        if (!this.props.currentUserStore.information.permissions) {
            return;
        }

        if (!Array.isArray(this.props.currentUserStore.information.permissions)) {
            return;
        }

        const id = OmzHistory.getLocation().split('/')[1].split('?')[0];
        const feature = _.find(this.props.currentUserStore.information.permissions, (perm) => {
            return perm.id === id;
        });

        if (feature && !feature.permission.view) {
            browserHistory.push('/');
        }
    }

    _loadDataForPath (path, id) {
        const accountId = this.props.currentUserStore.information.account.id || id;

        switch (path) {
            case '/departments':
                filterActions.fetchAgentsFilter({accountId: accountId});
                channelActions.fetchAll({accountId: accountId, selectable: true});
                departmentActions.fetchAll({accountId: accountId});
                break;
            case '/facebook':
                facebookActions.fetchAll({accountId: accountId});
                departmentActions.fetchAll({accountId: accountId, state: 'ACTIVE'});
                break;
            default:
                break;
        }
    }

    _createInboxCountInterval () {
        this.getStats = setInterval(this._fetchInboxCount.bind(this), 5000);
    }

    _clearInboxCountInterval () {
        clearInterval(this.getStats);
        this.getStats = null;
    }

    _fetchInboxCount () {
        if (this.props.currentUserStore.information.account.id) {
            this.props.viewsActions.fetchInboxCount(
                this.props.currentUserStore.information.account.id,
                this.props.currentUserStore.information.id,
                this.props.currentUserStore.information.subscription,
                () => this._getInbox()
            );
        }
    }

    _getInbox () {
        if ((this.props.viewsStore.inboxCount !== Object.keys(this.props.interactionStore.inbox).length) && (this.props.interactionStore.status !== 'LOADING')) {
            this.props.interactionActions.getInbox(
                this.props.currentUserStore.information.account.id,
                this.props.currentUserStore.information.id,
                this.props.currentUserStore.information.subscription
            );
            if (Object.keys(this.props.interactionStore.inbox).length) {
                this.props.interactionActions.alertInbox(true);
            }
        } else {
            this.props.interactionActions.alertInbox(false);
        }
    }

    _isInteractionsOnReconnecting () {
        _.map(this.props.interactionStore.interactions, (interaction, key) => {
            if (interaction.state === 'RECONNECTING' && !(key in Object.keys(this.reconnectingInteractions))) {
                this.reconnectingInteractions[key] = setTimeout(() => {
                    if (interaction.type === 'audio' || interaction.type === 'video') {
                        this.props.currentUserStore.OmzSip.profile.finishCall();
                    } else {
                        this.props.currentUserStore.OmzSip.profile.finishText(key);
                    }
                }, 90000);
            }

            if (interaction.state !== 'RECONNECTING' && (key in this.reconnectingInteractions)) {
                clearTimeout(this.reconnectingInteractions[key]);
                Reflect.deleteProperty(this.reconnectingInteractions, key);
            }
        });
    }

    _addChecksForInternetConnection () {
        window.addEventListener('online', this._isOnline);
        window.addEventListener('offline', this._isOffline);
    }

    _isOnline () {
        viewsActions.updateInternetConnection('online');
    }

    _isOffline () {
        viewsActions.updateInternetConnection('offline');
    }

    _addChecksForWindowFocus () {
        window.addEventListener('focus', () => {
            viewsActions.updateWindowsFocus(true);
            this._createInboxCountInterval();
        });

        window.addEventListener('blur', () => {
            viewsActions.updateWindowsFocus(false);
            this._clearInboxCountInterval();
        });
    }

    render () {
        const isMobile = navigator.userAgent.match(/Android|BlackBerry|iPhone|iPod|Opera Mini|IEMobile/i)
            && screen.width <= 600;

        return (
            <IntlProvider locale="pt">
                <div className={`AppControl ${this.props.className}`}>
                    {isMobile ? (
                        <div>
                            <OMZHelmet title="Omnize"/>
                            <Header brandName={this.brandName} hideAccount={true}/>
                            <section className="row main-wrapper">
                                <div className="main-wrapper__child main-wrapper__child--without-left-menu">
                                    <NoMobile />
                                </div>
                            </section>
                        </div>
                    ) : (
                        <div>
                            {
                                this.props.currentUserStore.status === 'LOADING' ? (
                                    <Loader fullScreen={true}/>
                                ) : (
                                    <div>
                                        <OMZHelmet title="Omnize"/>
                                        {
                                            OmzHistory.getLocation() !== '/login' ? (
                                                <Header brandName={this.brandName} />
                                            ) : null
                                        }
                                        <section className="row main-wrapper">
                                            <LeftMenu />
                                            <div className="main-wrapper__child">
                                                {this.props.defaultProps.children}
                                            </div>
                                        </section>
                                        <Crop />
                                        <OfflineModal />
                                        <OfficeHoursModal />
                                    </div>
                                )
                            }
                        </div>
                    )}
                </div>
            </IntlProvider>
        );
    }
}

AppControl.PropTypes = {
    className: React.PropTypes.string
};

export default AppControl;
