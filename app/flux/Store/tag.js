import _ from 'lodash';
import alt from 'app/flux/Alt';
import {tagActions} from 'app/flux/Actions';
import {TagModel} from 'app/flux/Model';

class TagStore {
    constructor () {
        this.state = {
            status: '',
            search: '',
            total: 0,
            totalActive: 0,
            totalInactive: 0,
            page: 0,
            allChecked: false,
            tags: [],
            colors: ['#516274', '#924caf', '#1f74b3', '#4ea2e0', '#ba3121', '#e5730a', '#f5a623', '#00b592'],
            currentTag: {
                id: '',
                type: 'add',
                color: '#516274',
                name: ''
            },
            useCount: {
                status: '',
                data: []
            }
        };
        this.bindActions(tagActions);
    }

    onResettingAll () {
        this.state.tags = [];
        this.state.page = 0;
        this.state.status = '';

        this.setState({
            tags: this.state.tags,
            page: this.state.page,
            status: this.state.status
        });
    }

    onFetchingAll (params) {
        this.state.status = params.status;
        this.setState({
            status: this.state.status
        });
    }

    onFetchedAll (params) {
        this.state.page = this.state.page + 1;

        if (params.results.tags.length === 0) {
            this.state.status = 'ENDED';
        } else {
            _.map(params.results.tags, (tag) => {
                const newTag = new TagModel(tag);

                newTag.selected = false;
                this.state.tags.push(newTag);
                this.state.status = '';
            });
        }

        if (params.results.stats) {
            this.state.total = params.results.stats.total;
            this.state.totalActive = params.results.stats.active;
            this.state.totalInactive = params.results.stats.inactive;
        }

        this.setState({
            tags: this.state.tags,
            status: this.state.status,
            total: this.state.total,
            totalActive: this.state.totalActive,
            totalInactive: this.state.totalInactive
        });
    }

    updatingTagsCheck (params) {
        const changeCheck = (state) => {
            _.map(this.state.tags, (tag) => {
                tag.selected = state;
            });
        };

        if (params.tagIndex === -1) {
            if (params.allChecked) {
                changeCheck(false);
            } else {
                changeCheck(true);
            }
        } else {
            this.state.tags[params.tagIndex].selected = !this.state.tags[params.tagIndex].selected;
        }

        this.setState({
            tag: this.state.tag
        });
    }

    onTogglingTagState (params) {
        this.state.tags[params.tagKey].state = params.tag.state === 'INACTIVE' ? 'ACTIVE' : 'INACTIVE';
        this.setState({
            tags: this.state.tags
        });
    }

    onToggledTagState (params) {
        if (params.error) {
            this.state.tags[params.tagKey].state = params.tag.state === 'INACTIVE' ? 'ACTIVE' : 'INACTIVE';
            this.setState({
                tags: this.state.tags
            });
        }
    }

    onDeletingTags (params) {
        this.setState({
            status: params.status
        });
    }

    onDeletedTags (params) {
        if (params.error) {
            this.state.status = params.status;
        } else {
            this.state.status = '';
        }

        this.setState({
            status: this.state.status
        });
    }

    onUpdatingCurrentTag (tagName) {
        this.state.currentTag.name = tagName;
        this.setState({
            currentTag: this.state.currentTag
        });
    }

    onUpdatingCurrentTagColor (key) {
        this.state.currentTag.color = this.state.colors[key];
        this.setState({
            currentTag: this.state.currentTag
        });
    }

    onChangingCurrentTag (tagSelected) {
        if (tagSelected) {
            this.state.currentTag.id = tagSelected.id;
            this.state.currentTag.color = tagSelected.baseColor;
            this.state.currentTag.name = tagSelected.name;
            this.state.currentTag.type = 'edit';
            this.state.currentTag.action = 'Editar de Tag';
        } else {
            this.state.currentTag.id = '';
            this.state.currentTag.type = 'add';
            this.state.currentTag.color = '#516274';
            this.state.currentTag.name = '';
            this.state.currentTag.action = 'Cadastro de Tag';
        }

        this.setState({
            currentTag: this.state.currentTag
        });
    }

    onChangingSearchValue (value) {
        this.setState({
            search: value
        });
    }

    onFetchingUseCount (params) {
        this.state.useCount.status = params.status;
    }

    onFetchedUseCount (params) {
        this.state.useCount.status = params.status;
        this.state.useCount.data = [];

        _.map(params.data, (tag) => {
            this.state.useCount.data.push(tag);
        });
    }
}

export default alt.createStore(TagStore, 'TagStore');
