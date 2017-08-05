import _ from 'lodash';
import React from 'react';
import {FormattedNumber} from 'react-intl';
import {TimeHelper} from 'app/helpers';
import {
    Card,
    InputText,
    Form,
    Button,
    Icon,
    OMZTable,
    ModalFilter,
    Tag,
    Avatar,
    FloatButton,
    Switcher,
    Text,
    InteractionTag,
    PeriodModal,
    Notification
} from 'app/screens/Components';

class View extends React.Component {
    constructor (props) {
        super(props);
        this.startDate = '';
        this.endDate = '';
    }

    componentWillUnmount () {
        this.props.tagActions.resetAll();
        this.props.filterActions.clearAllSelecteds();
        this.props.tableActions.clearAllOrder();
    }

    _getParent () {
        return document.querySelector('.tags');
    }

    _fetchTags (reset = false) {
        const header = this.props.tableStore.tag.selectedHeader;

        if (!(this.props.tagStore.status === 'ENDED' && !reset || this.props.tagStore.status === 'LOADING')) {
            const params = {
                reset: reset,
                accountId: this.props.currentUserStore.information.account.id,
                page: reset ? 0 : this.props.tagStore.page,
                headerId: header ? header.id : '',
                orderDirection: header ? header.direction : '',
                search: this.props.tagStore.search,
                agents: this.props.filterStore.agents.selectedOptionsId,
                state: this.props.filterStore.state.selectedOptionsId,
                from: this.startDate ? this.startDate.format('YYYY-MM-DD') : '',
                to: this.endDate ? this.endDate.format('YYYY-MM-DD') : ''
            };

            this.props.tagActions.fetchAll(params);
        }
    }

    _deleteTags (tagSelected) {
        const tags = [];

        if (tagSelected instanceof Object) {
            tags.push(tagSelected.id);
        } else {
            _.map(this.props.tagStore.tags, (tag) => {
                if (tag.selected) {
                    tags.push(tag.id);
                }
            });
        }

        this.props.tagActions.deleteTags(tags, this.props.currentUserStore.information.id, () => this._fetchTags(true));
    }

    _applyPeriodFilter (startDate, endDate) {
        this.startDate = startDate;
        this.endDate = endDate;
        this._fetchTags(true);
        this.props.viewsActions.toggleModalState('showPeriod', 'tagView');
    }

    _clearPeriodFilter () {
        this.startDate = '';
        this.endDate = '';
        this.props.viewsActions.toggleModalState('showPeriod', 'tagView');
    }

    _onSearchTag (e) {
        e.preventDefault();
        this._fetchTags(true);
    }

    _addTag () {
        this.props.tagActions.changeCurrentTag();
        this.props.viewsActions.toggleModalState('showAddEdit', 'tagView');
    }

    _editTags (tag) {
        this.props.tagActions.changeCurrentTag(tag);
        this.props.viewsActions.toggleModalState('showAddEdit', 'tagView');
    }

    _handleTagNameChanged () {
        const tag = this.interactionTag.tagName.state.value;

        this.props.tagActions.updateCurrentTag(tag);
    }

    _saveTag (e) {
        e.preventDefault();
        this.props.tagActions.saveTag(
            this.props.currentUserStore.information.id,
            this.props.currentUserStore.information.account.id,
            this.props.tagStore.currentTag,
            () => this._fetchTags(true)
        );
        this.props.viewsActions.toggleModalState('showAddEdit', 'tagView');
    }

    render () {
        const tableData = {
            headers: this.props.tableStore.tag.headers
        };

        tableData.items = _.map(this.props.tagStore.tags, (tagItem, tagKey) => {
            const row = {
                highlight: false,
                selected: tagItem.selected,
                fields: [
                    {
                        id: 'name',
                        type: 'data',
                        content: <Tag color={tagItem.baseColor} title={tagItem.name}/>
                    },
                    {
                        id: 'agent_name',
                        type: 'data',
                        content: <Avatar name={tagItem.agentName} src={tagItem.agentPhoto} size="small"/>
                    },
                    {
                        id: 'change_date',
                        type: 'data',
                        content: <Text iconName="calendar" iconWidth="12px" iconColor="gray-secondary" content={TimeHelper.formatDate(tagItem.dateCreation)}/>
                    },
                    {
                        id: 'tag_count',
                        type: 'data',
                        content: <Text iconName="tag-outline" iconWidth="12px" content={tagItem.count}/>
                    },
                    {
                        id: 'state',
                        type: 'data',
                        content: <Switcher on={tagItem.state === 'ACTIVE'} onClick={() => this.props.tagActions.toggleTagState(tagItem, tagKey, this.props.currentUserStore.information.id)}/>
                    },
                    {
                        id: 'actions',
                        type: 'action',
                        actions: [
                            <Icon name="pencil" width="14px" height="15px" padding="9px 10.5px" iconColor="blue" bkgColor="white" bkgCircle={true} bkgBorder="gray-octonary" inline={true} clickable={true} handleClick={() => this._editTags(tagItem)}/>,
                            <Icon name="trash" width="14px" height="15px" padding="8px 10.5px" iconColor="blue" bkgColor="white" bkgCircle={true} bkgBorder="gray-octonary" inline={true} clickable={true} handleClick={() => this._deleteTags(tagItem)}/>
                        ]
                    }
                ]
            };

            return row;
        });

        const tagsSelected = _.filter(this.props.tagStore.tags, (tag) => {
            if (tag.selected) {
                return tag;
            }
        });

        return (
            <section className="tags">
                <Card
                    helpers="card--full-height card--header-padding"
                    contentPadded={true}
                    title="Administração de Tags"
                    subtitle={
                        tagsSelected.length ? (
                            <span><FormattedNumber value={tagsSelected.length}/> Tags selecionadas</span>
                        ) : (
                            <span>
                                <span>Total de tags cadastradas: <FormattedNumber value={this.props.tagStore.total}/></span>
                                <span className="alpha">Ativas: <FormattedNumber value={this.props.tagStore.totalActive}/></span>
                                <span className="alpha">Inativas: <FormattedNumber value={this.props.tagStore.totalInactive}/></span>
                            </span>
                        )
                    }
                >
                    <div className="row">
                        <div className="large-5 columns rythm--margin-b-2">
                            <Form onSubmit={this._onSearchTag.bind(this)}>
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
                                    value={this.props.tagStore.search}
                                    onChange={() => this.props.tagActions.changeSearchValue(this.searchField.state.value)}
                                />
                            </Form>
                        </div>

                        <div className="large-3 columns text-right rythm--margin-b-2">
                            <Button className="vTop" size="big" color="green" handleOnClick={this._addTag.bind(this)}>
                                <Icon name="add-tag" width="25px" inline={true}/>
                            </Button>
                            <Notification
                                show={
                                    this.startDate
                                    && this.endDate
                                        ? true
                                        : false
                                }
                                notificationIcon={
                                    <Icon
                                        name="check"
                                        iconColor="white"
                                        width="10px"
                                    />
                                }
                            >
                                <Button
                                    className="vTop alpha-10 datePickerButton"
                                    size="big"
                                    color={
                                        this.startDate
                                        && this.endDate
                                            ? 'white'
                                            : 'blue'
                                    }
                                    handleOnClick={() =>
                                        this.props.viewsActions.toggleModalState('showPeriod', 'tagView')
                                    }
                                >
                                    <Icon
                                        name="calendar"
                                        iconColor={
                                            this.startDate
                                            && this.endDate
                                                ? null
                                                : 'white'
                                        }
                                        width="23px"
                                        inline={true}
                                    />
                                </Button>
                            </Notification>
                            <Notification
                                show={
                                    (this.props.filterStore.state.selectedOptionsId
                                    || this.props.filterStore.agents.selectedOptionsId)
                                    && !this.props.viewsStore.modal.tagView.showFilter
                                        ? true
                                        : false
                                }
                                notificationIcon={
                                    <Icon
                                        name="check"
                                        iconColor="white"
                                        width="10px"
                                    />
                                }
                            >
                                <Button
                                    className="vTop alpha-10"
                                    size="big"
                                    handleOnClick={() =>
                                        this.props.viewsActions.toggleModalState('showFilter', 'tagView')
                                    }
                                    color={
                                        (this.props.filterStore.state.selectedOptionsId
                                        || this.props.filterStore.agents.selectedOptionsId)
                                        && !this.props.viewsStore.modal.tagView.showFilter
                                            ? 'white'
                                            : 'blue'
                                    }
                                >
                                    <Icon
                                        name="filter-options"
                                        iconColor={
                                            (this.props.filterStore.state.selectedOptionsId
                                            || this.props.filterStore.agents.selectedOptionsId)
                                            && !this.props.viewsStore.modal.tagView.showFilter
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
                    <InteractionTag
                        ref={(c) => this.interactionTag = c}
                        openTagModal={this.props.viewsStore.modal.tagView.showAddEdit}
                        closeTagModal={() => this.props.viewsActions.toggleModalState('showAddEdit', 'tagView')}
                        inputTextValue={this.props.tagStore.currentTag.name}
                        colorPickerColors={this.props.tagStore.colors}
                        selectedColorTag={this.props.tagStore.currentTag.color}
                        titleCardModal={this.props.tagStore.currentTag.type === 'edit' ? 'Editar de Tag' : 'Cadastro de Tag'}
                        tagNameChanged={this._handleTagNameChanged.bind(this)}
                        tagColorChanged={(key) => this.props.tagActions.updateCurrentTagColor(key)}
                        saveTag={this._saveTag.bind(this)}
                        modalParentSelector={this._getParent.bind(this)}
                    />
                    <OMZTable
                        selectable={true}
                        data={tableData}
                        hasActions={true}
                        loadingData={this.props.tagStore.status === 'LOADING'}
                        onTableBottom={this._fetchTags.bind(this)}
                        onHeaderClick={(id) => {this.props.tableActions.changeTableOrder('tag', id); this._fetchTags(true);}}
                        onCheck={(rowIndex, allChecked) => this.props.tagActions.updateTagsCheck(rowIndex, allChecked)}
                    />
                    <PeriodModal
                        isOpen={this.props.viewsStore.modal.tagView.showPeriod}
                        modalParentSelector={this._getParent.bind(this)}
                        onApplyFilter={this._applyPeriodFilter.bind(this)}
                        onClearFilter={this._clearPeriodFilter.bind(this)}
                        onCloseModal={() => this.props.viewsActions.toggleModalState('showPeriod', 'tagView')}
                    />
                    <ModalFilter
                        isOpen={this.props.viewsStore.modal.tagView.showFilter}
                        modalParentSelector={this._getParent.bind(this)}
                        handleOnChange={(filterId, optionIndex, all) => this.props.filterActions.updateFilter(filterId, optionIndex, all)}
                        filters={[
                            this.props.filterStore.agents,
                            this.props.filterStore.state
                        ]}
                        handleFilterClick={() => {this.props.viewsActions.toggleModalState('showFilter', 'tagView'); this._fetchTags(true);}}
                        onCloseModal={() => this.props.viewsActions.toggleModalState('showFilter', 'tagView')}
                        onClearFilter={() => {
                            this.props.filterActions.clearAllSelecteds();
                            this.props.viewsActions.toggleModalState('showFilter', 'tagView');
                            this._fetchTags(true);
                        }}
                    />
                    {
                        tagsSelected.length ? (
                            <FloatButton
                                position="bottom-right"
                                handleClick={this._deleteTags.bind(this)}
                            />
                        ) : ''
                    }
                </Card>
            </section>
        );
    }
}

export default View;
