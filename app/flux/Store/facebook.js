import alt from 'app/flux/Alt';
import {facebookActions} from 'app/flux/Actions';
import {FacebookModel} from 'app/flux/Model';
import {ENV} from 'app/services';
import _ from 'lodash';

class FacebookStore {
    constructor () {
        this.state = {
            status: '',
            app: {
                id: ENV.FACEBOOK_APP_ID,
                version: ENV.FACEBOOK_APP_VERSION
            },
            facebookPages: [],
            pages: [],
            facebookUser: {
                userId: '',
                name: '',
                email: '',
                accessToken: '',
                signedRequest: ''
            },
            currentPage: {
                status: '',
                type: 'add',
                id: '',
                page: {
                    id: '',
                    name: '',
                    accessToken: '',
                    photo: ''
                }
            }
        };

        this.bindActions(facebookActions);
    }

    onResettingAll () {
        this.state.facebookPages = [];
        this.state.status = '';
    }

    onFetchingAll (params) {
        this.state.status = params.status;
    }

    onFetchedAll (params) {
        this.state.status = params.status;

        if (params.status === 'TIMEOUT' || params.status === 'ERROR') {
            return;
        }

        if (params.results.length === 0) {
            this.state.status = 'ENDED';
            return;
        }

        _.map(params.results, (facebookPage) => {
            this.state.facebookPages.push(new FacebookModel(facebookPage));
        });
    }

    onTogglingState (params) {
        this.state.facebookPages[params.facebookKey].state = params.facebookPage.state === 'INACTIVE'
            ? 'ACTIVE'
            : 'INACTIVE';
    }

    onToggledState (params) {
        if (params.error) {
            this.state.facebookPages[params.facebookKey].state = params.facebookPage.state === 'INACTIVE'
                ? 'ACTIVE'
                : 'INACTIVE';
        }
    }

    onUpdatingPagesCheck (params) {
        const changeCheck = (state) => {
            _.map(this.state.facebookPages, (facebookPage) => {
                facebookPage.selected = state;
            });
        };

        if (params.pageIndex === -1) {
            if (params.allChecked) {
                changeCheck(false);
            } else {
                changeCheck(true);
            }
        } else {
            this.state.facebookPages[params.pageIndex].selected = !this.state.facebookPages[params.pageIndex].selected;
        }

        this.setState({
            facebookPages: this.state.facebookPages
        });
    }

    onDeletingPages (params) {
        this.setState({
            status: params.status
        });
    }

    onDeletedPages (params) {
        if (params.error) {
            this.state.status = params.status;
        } else {
            this.state.status = '';
        }

        this.setState({
            status: this.state.status
        });
    }

    onConnectingFacebook (params) {
        this.state.currentPage.status = params.status;
    }

    onConnectedFacebook (params) {
        this.state.currentPage.status = params.status;

        if (params.response.authResponse) {
            this.state.facebookUser = {
                userId: params.response.authResponse.userID,
                name: params.userInfo.name,
                email: params.userInfo.email ? params.userInfo.email : '',
                accessToken: params.response.authResponse.accessToken,
                signedRequest: params.response.authResponse.signedRequest
            };
        }

        this.setState({
            facebookUser: this.state.facebookUser,
            currentPage: this.state.currentPage
        });
    }

    onFetchingFacebookPages (params) {
        this.state.currentPage.status = params.status;
    }

    onFetchedFacebookPages (params) {
        this.state.currentPage.status = params.status;

        this.setState({
            pages: params.pages,
            currentPage: this.state.currentPage
        });
    }

    onUpdatingPageSelected (pageId) {
        _.map(this.state.pages, (page) => {
            if (page.id === pageId) {
                this.state.currentPage.page.id = page.id;
                this.state.currentPage.page.accessToken = page.accessToken;
                this.state.currentPage.page.name = page.name;
                this.state.currentPage.page.photo = page.photo;

                this.setState({
                    currentPage: this.state.currentPage
                });
            }
        });
    }

    onChangingCurrentPage (facebookPage) {
        if (facebookPage) {
            this.state.currentPage.type = 'edit';

            this.state.currentPage.id = facebookPage.id;
            this.state.currentPage.page.name = facebookPage.pageName;
            this.state.currentPage.page.photo = facebookPage.pageImage;
        } else {
            this.state.currentPage = {
                status: '',
                type: 'add',
                id: '',
                page: {
                    id: '',
                    name: '',
                    photo: ''
                }
            };
        }

        this.setState({
            currentPage: this.state.currentPage
        });
    }

    onSaving (params) {
        this.state.currentPage.status = params.status;
    }

    onSaved (params) {
        this.state.currentPage.status = params.status;
    }
}

export default alt.createStore(FacebookStore, 'facebookStore');
