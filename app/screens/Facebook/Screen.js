import React from 'react';
import _ from 'lodash';
import {
    Card,
    OMZTable,
    Button,
    Avatar,
    Icon,
    Switcher,
    FloatButton,
    AddFacebookPage
} from 'app/screens/Components';

/* global FB */

class View extends React.Component {
    constructor (props) {
        super(props);

        this.fetchAll = this.fetchAll.bind(this);
        this.fetchFacebookPages = this.fetchFacebookPages.bind(this);
        this.connectFacebook = this.connectFacebook.bind(this);
        this.getParent = this.getParent.bind(this);
        this.deletePages = this.deletePages.bind(this);
        this.toggleAddEditModal = this.toggleAddEditModal.bind(this);
        this.savePage = this.savePage.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.selectPages = this.selectPages.bind(this);
        this.selectDepartment = this.selectDepartment.bind(this);
        this.changeActivePanel = this.changeActivePanel.bind(this);
    }

    componentWillUnmount () {
        this.props.facebookActions.resetAll();
        this.props.tableActions.clearAllOrder();
        this.props.departmentActions.resetAll();
    }

    componentDidMount () {
        window.fbAsyncInit = () => {
            FB.init({
                appId: this.props.facebookStore.app.id,
                autoLogAppEvents: true,
                xfbml: true,
                version: this.props.facebookStore.app.version
            });
            FB.AppEvents.logPageView();
        };

        let js;
        const fjs = document.getElementsByTagName('script')[0];

        if (document.getElementById('facebook-jssdk')) {return;}
        js = document.createElement('script');
        js.id = 'facebook-jssdk';
        js.src = '//connect.facebook.net/pt_BR/sdk.js';
        fjs.parentNode.insertBefore(js, fjs);
    }

    connectFacebook () {
        this.props.facebookActions.connectFacebook(
            () => this.fetchFacebookPages(),
            () => this.props.viewsActions.forwardModalPanel('facebookView')
        );
    }

    fetchFacebookPages () {
        this.props.facebookActions.fetchFacebookPages(
            this.props.facebookStore.facebookUser.userId
        );
    }

    getParent () {
        return document.querySelector('.facebook');
    }

    fetchAll (reset = false) {
        const header = this.props.tableStore.facebook.selectedHeader;

        if (!(this.props.facebookStore.status === 'ENDED' && !reset || this.props.facebookStore.status === 'LOADING')) {
            const params = {
                reset: reset,
                accountId: this.props.currentUserStore.information.account.id,
                headerId: header ? header.id : '',
                orderDirection: header ? header.direction : ''
            };

            this.props.facebookActions.fetchAll(params);
        }
    }

    deletePages (pageSelected) {
        const pages = [];

        if (pageSelected instanceof Object) {
            pages.push(pageSelected.id);
        } else {
            _.map(this.props.facebookStore.facebookPages, (page) => {
                if (page.selected) {
                    pages.push(page.id);
                }
            });
        }

        this.props.facebookActions.deletePages(
            pages,
            this.props.currentUserStore.information.id,
            () => this.fetchAll(true)
        );
    }

    selectPages (pageId) {
        this.props.facebookActions.updatePageSelected(pageId);
    }

    selectDepartment (deptId) {
        let department = false;

        if (deptId) {
            _.map(this.props.departmentStore.departments, (departmentItem) => {
                if (departmentItem.id === deptId) {
                    department = departmentItem;
                }
            });
        }

        this.props.departmentActions.changeCurrent(department);
    }

    toggleAddEditModal () {
        this.props.viewsActions.toggleModalState('showAddEdit', 'facebookView');
    }

    handleOpenModal () {
        const facebookUser = this.props.facebookStore.facebookUser;

        if (facebookUser.userId && facebookUser.accessToken) {
            this.props.viewsActions.forwardModalPanel('facebookView');
        }
        this.toggleAddEditModal();
    }

    handleClose () {
        this.props.facebookActions.changeCurrentPage(false);
        this.props.viewsActions.showInitialModalPanel('facebookView');
        this.selectDepartment();
        this.toggleAddEditModal();
    }

    savePage (e) {
        e.preventDefault();

        this.props.facebookActions.save(
            this.props.currentUserStore.information.account.id,
            this.props.facebookStore.facebookUser,
            this.props.facebookStore.currentPage,
            this.props.departmentStore.currentDepartment,
            () => this.fetchAll(true)
        );
        this.handleClose();
    }

    changeActivePanel (changeTo) {
        if (typeof changeTo === 'number') {
            this.props.viewsActions.showModalPanelIndex('facebookView', changeTo);
            return;
        }

        this.props.viewsActions.forwardModalPanel('facebookView');
    }

    render () {
        const tableData = {
            headers: this.props.tableStore.facebook.headers
        };

        tableData.items = _.map(this.props.facebookStore.facebookPages, (facebookItem, index) => {
            const row = {
                selected: facebookItem.selected,
                fields: [
                    {
                        id: 'page',
                        type: 'data',
                        content: (
                            <div>
                                <Avatar
                                    src={facebookItem.pageImage}
                                    size="small"
                                    noBorder={true}
                                />
                                <span className="OMZTable__content__container__row__data__text alpha">
                                    {facebookItem.pageName}
                                </span>
                            </div>
                        )
                    },
                    {
                        id: 'user',
                        type: 'data',
                        content: (
                            <span className="OMZTable__content__container__row__data__text">
                                {facebookItem.adminName}
                            </span>
                        )
                    },
                    {
                        id: 'department',
                        type: 'data',
                        content: (
                            <span className="OMZTable__content__container__row__data__text">
                                {facebookItem.departmentName}
                            </span>
                        )
                    },
                    {
                        id: 'verifiedAt',
                        type: 'data',
                        content: (
                            <span className="OMZTable__content__container__row__data__text">
                                {facebookItem.verifiedAt}
                            </span>
                        )
                    },
                    {
                        id: 'state',
                        type: 'data',
                        content: (
                            <Switcher
                                on={facebookItem.state === 'ACTIVE'}
                                onClick={() => {
                                    this.props.facebookActions.toggleState(
                                        facebookItem,
                                        index,
                                        this.props.currentUserStore.information.id
                                    );
                                }}
                            />
                        )
                    },
                    {
                        id: 'action',
                        type: 'action',
                        actions: [
                            <Icon
                                name="pencil"
                                width="14px"
                                height="15px"
                                padding="9px 10.5px"
                                iconColor="blue"
                                bkgColor="white"
                                bkgCircle={true}
                                bkgBorder="gray-octonary"
                                inline={true}
                                clickable={true}
                                handleClick={() => {
                                    if (this.props.facebookStore.facebookUser.userId !== '') {
                                        this.props.viewsActions.showModalPanelIndex('facebookView', 1);
                                    }
                                    this.props.facebookActions.changeCurrentPage(facebookItem);
                                    this.selectDepartment(facebookItem.departmentId);
                                    this.toggleAddEditModal();
                                }}
                            />,
                            <Icon
                                name="trash"
                                width="14px"
                                height="15px"
                                padding="8px 10.5px"
                                iconColor="blue"
                                bkgColor="white"
                                bkgCircle={true}
                                bkgBorder="gray-octonary"
                                inline={true}
                                clickable={true}
                                handleClick={() => this.deletePages(facebookItem)}
                            />
                        ]
                    }
                ]
            };

            return row;
        });

        const pagesSelected = _.filter(this.props.facebookStore.facebookPages, (facebookPage) => {
            if (facebookPage.selected) {
                return facebookPage;
            }
        });

        const parsedPages = () => {
            const pages = [];

            _.map(this.props.facebookStore.pages, (page, key) => {
                pages.push({
                    id: page.id,
                    selected: false,
                    content: (
                        <div className="row">
                            <div className="options__text columns large-2">
                                <Avatar
                                    src={page.photo}
                                    size="small"
                                    fixedWidth={true}
                                    noBorder={true}
                                />
                            </div>
                            <div className="text--wrap options__text columns large-10">
                                <label>{page.name}</label>
                            </div>
                        </div>
                    )
                });
            });
            return pages;
        };

        const parsedDeptos = () => {
            const deptos = [];

            _.map(this.props.departmentStore.departments, (department, key) => {
                deptos.push({
                    id: department.id,
                    selected: false,
                    content: (
                        <p className="text--tertiary">{department.name}</p>
                    )
                });
            });
            return deptos;
        };
        const modalData = this.props.facebookStore.currentPage;

        modalData.department = this.props.departmentStore.currentDepartment;

        return (
            <section className="facebook">
                <div className="facebook__container">
                    <Card
                        helpers="card--full-height card--header-padding"
                        contentPadded={true}
                        title="Facebook Messenger"
                    >
                        <div className="row">
                            <div className="large-7 columns rythm--margin-b-2">
                                <p className="card__description">
                                    Conecte a sua conta do Facebook para receber as mensagens na plataforma Omnize.
                                </p>
                            </div>
                            <div className="large-4 columns text-right rythm--margin-b-2">
                                <Button
                                    className="vTop alpha-10"
                                    size="big"
                                    color="green"
                                    handleOnClick={this.handleOpenModal}
                                >
                                    <Icon
                                        name="messenger"
                                        width="22px"
                                        padding="0"
                                        iconClass="icon--transparent-shape"
                                        iconColor="white"
                                        inline={true}
                                    />
                                </Button>
                            </div>
                        </div>
                        <AddFacebookPage
                            ref={(c) => this.AddFacebookPage = c}
                            isOpen={this.props.viewsStore.modal.facebookView.showAddEdit}
                            onClose={this.handleClose}
                            data={modalData}
                            activePanel={this.props.viewsStore.modal.facebookView.activePanel}
                            nextPanel={this.changeActivePanel}
                            status={this.props.facebookStore.currentPage.status}
                            onSave={this.savePage}
                            pageChanged={this.selectPages}
                            modalParentSelector={this.getParent}
                            pages={this.props.facebookStore.pages}
                            pagesContainer={parsedPages()}
                            deptos={this.props.facebookStore.deptos}
                            deptosContainer={parsedDeptos()}
                            deptoChanged={this.selectDepartment}
                            loginFacebook={this.connectFacebook}
                        />
                        <OMZTable
                            selectable={true}
                            data={tableData}
                            loadingData={this.props.facebookStore.status === 'LOADING'}
                            hasActions={true}
                            onCheck={(rowIndex, allChecked) =>
                                this.props.facebookActions.updatePagesCheck(rowIndex, allChecked)}
                            onTableBottom={this.fetchAll}
                        />
                        {
                            pagesSelected.length ? (
                                <FloatButton
                                    position="bottom-right"
                                    handleClick={this.deletePages}
                                />
                            ) : ''
                        }
                    </Card>
                </div>
            </section>
        );
    }
}

export default View;
