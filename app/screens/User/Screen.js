import _ from 'lodash';
import React from 'react';
import {
    Card,
    InputText,
    Form,
    Button,
    Icon,
    OMZTable,
    Avatar,
    Switcher,
    Text,
    ModalFilter,
    Notification,
    AddEditUser
} from 'app/screens/Components';

class View extends React.Component {
    constructor (props) {
        super(props);

        this.fetchUser = this.fetchUser.bind(this);
        this.selectProfiles = this.selectProfiles.bind(this);
    }

    componentWillUnmount () {
        this.props.userActions.resetAll();
        this.props.filterActions.clearAllSelecteds();
        this.props.tableActions.clearAllOrder();
    }

    fetchUser (reset = false) {
        const header = this.props.tableStore.user.selectedHeader;

        if (!(this.props.userStore.status === 'ENDED' && !reset || this.props.userStore.status === 'LOADING')) {
            const params = {
                reset: reset,
                accountId: this.props.currentUserStore.information.account.id,
                page: reset ? 0 : this.props.userStore.page,
                headerId: header ? header.id : '',
                orderDirection: header ? header.direction : '',
                search: this.props.userStore.search,
                state: this.props.filterStore.state.selectedOptionsId,
                from: this.startDate ? this.startDate.format('YYYY-MM-DD') : '',
                to: this.endDate ? this.endDate.format('YYYY-MM-DD') : ''
            };

            this.props.userActions.fetchAll(params);
        }
    }

    _getParent () {
        return document.querySelector('.user');
    }

    _addUser () {
        this.props.filterActions.clearAllSelecteds();
        this.props.profileActions.clearSelecteds();
        this.props.userActions.changeCurrentUser();
        this.props.viewsActions.toggleModalState('showAddEdit', 'userView');
    }

    _handleChange () {
        const user = {
            name: this.addEditUser.name.state.value,
            mail: this.addEditUser.email.state.value,
            password: this.addEditUser.password.state.value
        };

        this.props.userActions.updateCurrentUser(user);
    }

    _selectDepartments (departments) {
        _.map(this.props.filterStore.department.options, (option, key) => {
            _.map(departments, (department) => {
                if (option.id === department.id) {
                    this.props.filterActions.updateFilter('department', key, false);
                }
            });
        });
    }

    selectProfiles (profileId) {
        _.map(this.props.profileStore.profiles, (profile, key) => {
            if (profile.id === parseInt(profileId, 10)) {
                this.props.profileActions.changeProfileSelected(key, true);
            } else {
                this.props.profileActions.changeProfileSelected(key, false);
            }
        });
    }

    _editUser (user) {
        this._selectDepartments(user.departments);
        this.selectProfiles(user.profiles[0].id);
        this.props.userActions.changeCurrentUser(user);
        this.props.viewsActions.toggleModalState('showAddEdit', 'userView');
    }

    _saveUser (e) {
        e.preventDefault();
        this.props.userActions.saveUser(
            this.props.currentUserStore.information.account.id,
            this.props.userStore.currentUser,
            this.props.filterStore.department.options,
            this.props.profileStore.profiles,
            () => this.fetchUser(true)
        );
        this.props.viewsActions.toggleModalState('showAddEdit', 'userView');
        this.props.filterActions.clearAllSelecteds();
    }

    _onSearchUser (e) {
        e.preventDefault();
        this.fetchUser(true);
    }

    render () {
        const tableData = {
            headers: this.props.tableStore.user.headers
        };
        const getDepartments = (departments) => {
            const departmentsNames = _.map(departments, (department) => {
                return department.name;
            });

            return departmentsNames.length ? departmentsNames.join(',') : '';
        };
        const getProfiles = (profiles) => {
            const profilesLabels = _.map(profiles, (profile) => {
                return profile.label;
            });

            return profilesLabels.length ? profilesLabels.join(',') : '';
        };
        const parsedProfiles = () => {
            const profiles = [];

            _.map(this.props.profileStore.profiles, (profile, key) => {
                profiles.push({
                    id: profile.id,
                    selected: false,
                    content: (
                        <p className="text--tertiary">{profile.label}</p>
                    )
                });
            });
            return profiles;
        };

        tableData.items = _.map(this.props.userStore.users, (userItem, userKey) => {
            const row = {
                highlight: false,
                selected: userItem.selected,
                fields: [
                    {
                        id: 'name',
                        type: 'data',
                        content: <Avatar name={userItem.name} src={userItem.photo} size="small" noBorder={true}/>
                    },
                    {
                        id: 'email',
                        type: 'data',
                        content: <Text content={userItem.email}/>
                    },
                    {
                        id: 'profile',
                        type: 'data',
                        content: <Text content={getProfiles(userItem.profiles)}/>
                    },
                    {
                        id: 'department',
                        type: 'data',
                        content: <Text content={getDepartments(userItem.departments)} wrap={true}/>
                    },
                    {
                        id: 'state',
                        type: 'data',
                        content: (
                            <Switcher
                                on={userItem.state === 'ACTIVE'}
                                onClick={() => {
                                    this.props.userActions.toggleUserState(
                                        userItem,
                                        userKey,
                                        this.props.currentUserStore.information.id
                                    );
                                }}
                                enabled={userItem.id !== this.props.currentUserStore.information.id}
                            />
                        )
                    },
                    {
                        id: 'actions',
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
                                handleClick={() => this._editUser(userItem)}
                            />
                        ]
                    }
                ]
            };

            return row;
        });

        return (
            <section className="user">
                <Card
                    helpers="card--full-height card--header-padding"
                    contentPadded={true}
                    title="Usuários"
                >
                    <div className="row">
                        <div className="large-5 columns rythm--margin-b-2">
                            <Form onSubmit={this._onSearchUser.bind(this)}>
                                <InputText
                                    ref={(c) => {this.searchField = c;}}
                                    type="text"
                                    search={true}
                                    name="search"
                                    placeholder="Busca"
                                    className="input--rounded input--border-gray"
                                    animation="input-animated"
                                    hasLabel={true}
                                    validations={[]}
                                    value={this.props.userStore.search}
                                    onChange={() => this.props.userActions.changeSearchValue(this.searchField.state.value)}
                                />
                            </Form>
                        </div>

                        <div className="large-3 columns text-right rythm--margin-b-2">
                            {
                                this.props.viewsStore.accountFree ? '' : (
                                    <Button className="vTop" size="big" color="green" handleOnClick={this._addUser.bind(this)}>
                                        <Icon name="new-user" width="25px" inline={true}/>
                                    </Button>
                                )
                            }
                            <Notification
                                show={
                                    this.props.filterStore.state.selectedOptionsId
                                     && !this.props.viewsStore.modal.userView.showFilter
                                        ? true
                                        : false
                                }
                                notificationIcon={
                                    <Icon name="check" iconColor="white" width="10px"/>
                                }
                            >
                                <Button
                                    className="vTop alpha-10"
                                    size="big"
                                    handleOnClick={() => {
                                        this.props.viewsActions.toggleModalState(
                                            'showFilter',
                                            'userView'
                                        );
                                    }}
                                    color={
                                        this.props.filterStore.state.selectedOptionsId
                                        && !this.props.viewsStore.modal.userView.showFilter
                                            ? 'white'
                                            : 'blue'
                                    }
                                >
                                    <Icon
                                        name="filter-options"
                                        iconColor={
                                            this.props.filterStore.state.selectedOptionsId
                                            && !this.props.viewsStore.modal.userView.showFilter
                                                ? 'blue'
                                                : 'white'
                                        }
                                        width="23px"
                                        inline={true}
                                    />
                                </Button>
                            </Notification>
                        </div>
                    </div>
                    <AddEditUser
                        ref={(c) => this.addEditUser = c}
                        openUserModal={this.props.viewsStore.modal.userView.showAddEdit}
                        closeUserModal={() => this.props.viewsActions.toggleModalState('showAddEdit', 'userView')}
                        titleCardModal={this.props.userStore.currentUser.type === 'edit' ? 'Editar de Usuário' : 'Usuário'}
                        user={this.props.userStore.currentUser}
                        userPasswordValidate={this.props.userStore.currentUser.type === 'edit' ? false : true}
                        profiles={parsedProfiles()}
                        userDepartmentsValues={this.props.filterStore.department}
                        userDepartmentsChanged={(filterId, optionIndex, all) => this.props.filterActions.updateFilter(filterId, optionIndex, all)}
                        userProfileChanged={this.selectProfiles}
                        userChanged={this._handleChange.bind(this)}
                        saveUser={this._saveUser.bind(this)}
                        modalParentSelector={this._getParent.bind(this)}
                    />
                    <OMZTable
                        data={tableData}
                        hasActions={true}
                        loadingData={this.props.userStore.status === 'LOADING'}
                        onTableBottom={this.fetchUser}
                        onHeaderClick={(id) => {this.props.tableActions.changeTableOrder('user', id); this.fetchUser(true);}}
                    />
                    <ModalFilter
                        isOpen={this.props.viewsStore.modal.userView.showFilter}
                        modalParentSelector={this._getParent.bind(this)}
                        handleOnChange={(filterId, optionIndex, all) => this.props.filterActions.updateFilter(filterId, optionIndex, all)}
                        filters={[
                            this.props.filterStore.state
                        ]}
                        handleFilterClick={() => {this.props.viewsActions.toggleModalState('showFilter', 'userView'); this.fetchUser(true);}}
                        onCloseModal={() => this.props.viewsActions.toggleModalState('showFilter', 'userView')}
                        onClearFilter={() => {
                            this.props.filterActions.clearAllSelecteds();
                            this.props.viewsActions.toggleModalState('showFilter', 'userView');
                            this.fetchUser(true);
                        }}
                    />
                </Card>
            </section>
        );
    }
}

export default View;
