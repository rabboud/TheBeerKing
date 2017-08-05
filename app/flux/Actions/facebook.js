import alt from 'app/flux/Alt';
import {Facebook} from 'app/flux/DataSource';
import Honeybadger from 'honeybadger-js';
import _ from 'lodash';

/* global FB */

class FacebookActions {
    constructor () {
        this.generateActions(
            'fetchingAll',
            'fetchedAll',
            'resettingAll',
            'togglingState',
            'toggledState',
            'deletingPages',
            'deletedPages',
            'updatingPagesCheck',
            'connectingFacebook',
            'connectedFacebook',
            'fetchingFacebookPages',
            'fetchedFacebookPages',
            'updatingPageSelected',
            'changingCurrentPage',
            'saving',
            'saved'
        );
    }

    resetAll () {
        this.resettingAll();
    }

    fetchAll (params) {
        params.status = 'LOADING';

        if (params.reset) {
            this.resettingAll();
        }

        this.fetchingAll(params);
        Facebook.fetchAll(params).then((results) => {
            params.status = '';
            params.results = results;

            this.fetchedAll(params);
        }, (error) => {
            if (error.timeout) {
                params.status = 'TIMEOUT';
                this.fetchedAll(params);
                Honeybadger.notify(error, {
                    name: 'Timeout on Bodylift - Get facebook pages',
                    context: {
                        accountId: params.accountId
                    }
                });
            } else {
                params.status = 'ERROR';
                this.fetchedAll(params);
                Honeybadger.notify(error, {
                    name: 'Error on Bodylift - Get facebook pages',
                    context: {
                        accountId: params.accountId
                    }
                });
            }
        });
    }

    toggleState (facebookPage, facebookKey, agentId) {
        const params = {
            facebookPage: facebookPage,
            facebookKey: facebookKey
        };

        const onError = (error) => {
            if (error.timeout) {
                params.error = 'TIMEOUT';
                Honeybadger.notify(error, {
                    name: 'Timeout on Bodylift - Change facebook page state',
                    context: {userId: agentId}
                });
                this.toggledState(params);
            } else {
                params.error = 'ERROR';
                Honeybadger.notify(error, {
                    name: 'Error on Bodylift - Change facebook page state',
                    context: {userId: agentId}
                });
                this.toggledState(params);
            }
        };

        if (facebookPage.state === 'ACTIVE') {
            this.togglingState(params);
            Facebook.inactiveFacebook(facebookPage.id, agentId).then((response) => {
                this.toggledState(params);
            }, (error) => {
                onError(error, params);
            });
            return;
        }

        if (facebookPage.state === 'INACTIVE') {
            this.togglingState(params);
            Facebook.activeFacebook(facebookPage.id, agentId).then((response) => {
                this.toggledState(params);
            }, (error) => {
                onError(error, params);
            });
            return;
        }
    }

    deletePages (pages, agentId, resetAndLoad) {
        const params = {
            pages: pages.join(','),
            agentId: agentId,
            status: 'LOADING'
        };

        this.deletingPages(params);
        Facebook.deletePages(params.pages, params.agentId).then((results) => {
            params.status = '';
            this.deletedPages(params);
            resetAndLoad();
        }, (error) => {
            if (error.timeout) {
                params.status = 'TIMEOUT';
                this.deletedPages(params);
            } else {
                params.status = 'ERROR';
                this.deletedPages(params);
            }
        });
    }

    updatePagesCheck (pageIndex, allChecked) {
        const params = {
            pageIndex: pageIndex,
            allChecked: allChecked
        };

        this.updatingPagesCheck(params);
    }

    connectFacebook (fetchFacebookPages, nextPanel) {
        const params = {
            status: 'LOGGING IN'
        };

        this.connectingFacebook(params);
        FB.login(
            (loginResponse) => {
                params.response = loginResponse;

                if (loginResponse.authResponse !== null) {
                    FB.api(
                        `/me?fields=email,name`,
                        (userInfo) => {
                            if (!userInfo.error) {
                                params.userInfo = userInfo;
                                params.status = '';

                                this.connectedFacebook(params);
                                fetchFacebookPages();
                                nextPanel();
                            } else {
                                console.error(userInfo.error.message);
                            }
                        }
                    );
                }
            },
            {scope: 'read_page_mailboxes, pages_messaging, public_profile, email, manage_pages'}
        );
    }

    fetchFacebookPages (userId) {
        const params = {
            status: 'LOADING',
            pages: []
        };

        this.fetchingFacebookPages(params);

        FB.api(
            `/me/accounts`,
            (response) => {
                if (response && !response.error) {
                    if (response.data !== null) {
                        _.map(response.data, (page) => {
                            FB.api(
                                `/${page.id}?fields=picture,access_token,about`,
                                (pageInfo) => {
                                    params.pages.push({
                                        id: page.id,
                                        name: page.name,
                                        accessToken: pageInfo.access_token,
                                        photo: pageInfo.picture.data.url,
                                        about: pageInfo.about
                                    });
                                }
                            );
                        });
                        params.status = 'LOADED';

                        this.fetchedFacebookPages(params);
                    } else {
                        params.status = 'NO DATA RECEIVED';
                        this.fetchedFacebookPages(params);
                    }
                }
            }
        );
    }

    updatePageSelected (pageId) {
        this.updatingPageSelected(pageId);
    }

    changeCurrentPage (facebookPage) {
        this.changingCurrentPage(facebookPage);
    }

    save (accountId, facebookUser, facebookPage, department, resetAndLoad) {
        const params = {
            accountId: accountId,
            facebookPage: facebookPage,
            facebookUser: facebookUser,
            department: department,
            status: 'LOADING'
        };

        const onError = (error, type) => {
            if (error.timeout) {
                params.status = 'TIMEOUT';
                this.saved(params);
                Honeybadger.notify(error, {
                    name: `Timeout on Bodylift - ${type === 'add' ? 'Create' : 'Edit'} facebook integration`,
                    context: {accountId: accountId}
                });
            } else {
                params.status = 'ERROR';
                this.saved(params);
                Honeybadger.notify(error, {
                    name: `Error on Bodylift - ${type === 'add' ? 'Create' : 'Edit'} facebook integration`,
                    context: {accountId: accountId}
                });
            }
        };

        /* eslint-disable camelcase */
        this.saving(params);
        if (facebookPage.type === 'add') {
            FB.api(`/${facebookPage.page.id}/subscribed_apps`,
                'post',
                {access_token: facebookPage.page.accessToken},
                (response) => {
                    if (response && !response.error) {
                        Facebook.create(accountId, facebookPage, facebookUser, department.id).then(() => {
                            params.status = '';
                            this.saved(params);
                            resetAndLoad();
                        }, (error) => {
                            onError(error, params, facebookPage.type);
                        });
                    } else {
                        console.error(response.error.message);
                    }
                }
            );
        }

        /* eslint-disable camelcase */

        if (facebookPage.type === 'edit') {
            Facebook.edit(facebookPage, facebookUser, department.id).then(() => {
                params.status = '';
                this.saved(params);
                resetAndLoad();
            }, (error) => {
                onError(error, params, facebookPage.type);
            });
        }
    }
}

export default alt.createActions(FacebookActions);
