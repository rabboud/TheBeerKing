import React from 'react';
import _ from 'underscore';
import {
    Card,
    Form,
    InputText,
    Button,
    Icon,
    Switcher,
    Text,
    Avatar,
    OMZTable,
    AddEditEmail
} from 'app/screens/Components';

class Component extends React.Component {
    constructor (props) {
        super(props);

        this.fetchAll = this.fetchAll.bind(this);
        this.saveEmail = this.saveEmail.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.searchEmail = this.searchEmail.bind(this);
        this.selectDepartment = this.selectDepartment.bind(this);
    }

    componentWillUnmount () {
        this.props.emailActions.resetAll();
        this.props.tableActions.clearAllOrder();
        this.props.departmentActions.resetAll();
    }

    fetchAll (reset = false) {
        if (!(this.props.emailStore.status === 'ENDED' && !reset || this.props.emailStore.status === 'LOADING')) {
            const params = {
                reset: reset,
                accountId: this.props.currentUserStore.information.account.id,
                page: reset ? 1 : this.props.emailStore.page,
                search: this.props.emailStore.search
            };

            this.props.emailActions.fetchAll(params);
        }
    }

    saveEmail (e) {
        const selectedDepartment = this.props.departmentStore.departments.find((department) => department.selected);

        e.preventDefault();
        this.props.emailActions.save(
            this.props.currentUserStore.information.account.id,
            this.props.currentUserStore.information.id,
            this.props.emailStore.currentEmail,
            selectedDepartment ? selectedDepartment.id : null,
            () => {
                this.handleClose();
                this.fetchAll(true);
            }
        );
    }

    toggleModal () {
        this.props.viewsActions.toggleModalState('showAddEdit', 'emailView');
    }

    handleClose () {
        this.toggleModal();
        this.props.emailActions.changeCurrent();
    }

    getParent () {
        return document.querySelector('.email');
    }

    searchEmail (e) {
        e.preventDefault();
        this.fetchAll(true);
    }

    selectDepartment (departmentId) {
        this.props.departmentActions.selectSingle(departmentId);
    }

    render () {
        const tableData = {
            headers: this.props.tableStore.email.headers
        };

        tableData.items = _.map(this.props.emailStore.emails, (emailItem, index) => {
            const row = {
                fields: [
                    {
                        id: 'email',
                        type: 'data',
                        content: (
                            <span className="OMZTable__content__container__row__data__text">
                                {emailItem.email}
                            </span>
                        )
                    },
                    {
                        id: 'department',
                        type: 'data',
                        content: (
                            <Text content={emailItem.department.name} />
                        )
                    },
                    {
                        id: 'user',
                        type: 'data',
                        content: (
                            <Avatar
                                name={emailItem.agent.name}
                                src={emailItem.agent.photo}
                                size="small"
                                noBorder={true}
                            />
                        )
                    },
                    {
                        id: 'state',
                        type: 'data',
                        content: (
                            <Switcher
                                on={emailItem.state === 'ACTIVE'}
                                onClick={() => {
                                    this.props.emailActions.toggleState(
                                        emailItem,
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
                                    this.props.emailActions.changeCurrent(emailItem);
                                    this.selectDepartment(emailItem.department.id);
                                    this.toggleModal();
                                }}
                            />
                        ]
                    }
                ]
            };

            return row;
        });

        const modalData = this.props.emailStore.currentEmail;

        modalData.departments = this.props.departmentStore.departments;

        return (
            <section className="email">
                <Card
                    helpers="card--full-height card--header-padding"
                    contentPadded={true}
                    title="E-mail"
                    subtitle="Administração de e-mails"
                >
                    <div className="row">
                        <div className="large-6 columns rythm--margin-b-2">
                            <Form onSubmit={this.searchEmail}>
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
                                    value=""
                                    onChange={() => this.props.emailActions.changeSearch(this.searchField.state.value)}
                                />
                            </Form>
                        </div>
                        <div className="large-3 columns text-right rythm--margin-b-2">
                            <Button className="vTop" size="big" color="green" handleOnClick={this.toggleModal}>
                                <Icon name="add-tag" width="25px" inline={true}/>
                            </Button>
                        </div>
                    </div>

                    <OMZTable
                        data={tableData}
                        hasActions={true}
                        loadingData={this.props.emailStore.status === 'LOADING'}
                        onTableBottom={this.fetchAll}
                    />
                    <AddEditEmail
                        ref={(c) => this.AddEditEmail = c}
                        isOpen={this.props.viewsStore.modal.emailView.showAddEdit}
                        data={modalData}
                        departmentChanged={this.selectDepartment}
                        onClose={this.handleClose}
                        modalParentSelector={this.getParent}
                        onChange={() => this.props.emailActions.updateCurrent(this.AddEditEmail.email.state.value)}
                        onSave={this.saveEmail}
                    />
                </Card>
            </section>
        );
    }
}

export default Component;
