import alt from 'app/flux/Alt';
import {Tags} from 'app/flux/DataSource';
import Honeybadger from 'honeybadger-js';

class TagActions {
    constructor () {
        this.generateActions(
            'fetchingAll',
            'fetchedAll',
            'resettingAll',
            'togglingTagState',
            'toggledTagState',
            'deletingTags',
            'deletedTags',
            'parsingFilters',
            'parsedFilters',
            'updatingFilters',
            'updatingTagsCheck',
            'resettingAll',
            'updatingCurrentTag',
            'updatingCurrentTagColor',
            'changingCurrentTag',
            'changingSearchValue',
            'fetchingUseCount',
            'fetchedUseCount'
        );
    }

    fetchAll (receiveParams) {
        const params = {
            accountId: receiveParams.accountId,
            status: 'LOADING',
            headerId: receiveParams.headerId,
            orderDirection: receiveParams.orderDirection,
            search: receiveParams.search,
            page: receiveParams.page,
            from: receiveParams.from,
            to: receiveParams.to,
            state: receiveParams.state,
            agents: receiveParams.agents,
            results: []
        };

        if (receiveParams.reset) {
            this.resetAll();
        }

        this.fetchingAll(params);
        Tags.fetchAll(params).then((results) => {
            params.status = '';
            params.results = results;
            this.fetchedAll(params);
        }, (error) => {
            if (error.timeout) {
                params.status = 'TIMEOUT';
                this.fetchedAll(params);
            } else {
                params.status = 'ERROR';
                this.fetchedAll(params);
            }
        });
    }

    resetAll () {
        this.resettingAll();
    }

    toggleTagState (tag, tagKey, agentId) {
        const params = {
            tag: tag,
            tagKey: tagKey
        };

        const onError = (error) => {
            if (error.timeout) {
                params.error = 'TIMEOUT';
                Honeybadger.notify(error, {
                    name: 'Timeout on Bodylift - Change tag state',
                    context: {userId: agentId}
                });
                this.toggledTagState(params);
            } else {
                params.error = 'ERROR';
                Honeybadger.notify(error, {
                    name: 'Timeout on Bodylift - Change tag state',
                    context: {userId: agentId}
                });
                this.toggledTagState(params);
            }
        };

        if (tag.state === 'ACTIVE') {
            this.togglingTagState(params);
            Tags.inactiveTag(tag.id, agentId).then((response) => {
                this.toggledTagState(params);
            }, (error) => {
                onError(error, params);
            });
            return;
        }

        if (tag.state === 'INACTIVE') {
            this.togglingTagState(params);
            Tags.activeTag(tag.id, agentId).then((response) => {
                this.toggledTagState(params);
            }, (error) => {
                onError(error, params);
            });
            return;
        }
    }

    deleteTags (tags, agentId, resetAndLoad) {
        const params = {
            tags: tags.join(','),
            agentId: agentId,
            status: 'LOADING'
        };

        this.deletingTags(params);
        Tags.deleteTags(params.tags, params.agentId).then((results) => {
            params.status = '';
            this.deletedTags(params);
            resetAndLoad();
        }, (error) => {
            if (error.timeout) {
                params.status = 'TIMEOUT';
                this.deletedTags(params);
            } else {
                params.status = 'ERROR';
                this.deletedTags(params);
            }
        });
    }

    updateFilters (filterId, filterIndex, valueId, valueIndex) {
        const params = {
            filterId: filterId,
            filterIndex: filterIndex,
            valueId: valueId,
            valueIndex: valueIndex
        };

        this.updatingFilters(params);
    }

    updateTagsCheck (tagIndex, allChecked) {
        const params = {
            tagIndex: tagIndex,
            allChecked: allChecked
        };

        this.updatingTagsCheck(params);
    }

    updateCurrentTag (tagName) {
        this.updatingCurrentTag(tagName);
    }

    updateCurrentTagColor (key) {
        this.updatingCurrentTagColor(key);
    }

    changeCurrentTag (tagSelected) {
        this.changingCurrentTag(tagSelected);
    }

    saveTag (agentId, accountId, tag, resetAndLoad) {
        if (tag.type === 'add') {
            Tags.createTag(agentId, accountId, tag).then((result) => {
                resetAndLoad();
            });
        } else {
            Tags.updateTag(agentId, tag).then((result) => {
                resetAndLoad();
            });
        }
    }

    changeSearchValue (value) {
        this.changingSearchValue(value);
    }

    fetchUseCount (receivedParams) {
        const params = {
            accountId: receivedParams.accountId,
            status: 'LOADING',
            data: []
        };

        this.fetchingUseCount(params);
        Tags.fetchUseCount(params.accountId).then((response) => {
            params.data = response;
            params.status = '';
            this.fetchedUseCount(params);
        }, (error) => {
            if (error.timeout) {
                params.status = 'TIMEOUT';
                this.fetchedUseCount(params);
                Honeybadger.notify(error, {
                    name: 'REPORTS - Timeout on getting tag count',
                    context: {accountId: params.accountId}
                });
            } else {
                params.status = 'ERROR';
                this.fetchedUseCount(params);
                Honeybadger.notify(error, {
                    name: 'REPORTS - Error on getting tag count',
                    context: {accountId: params.accountId}
                });
            }
        });
    }
}

export default alt.createActions(TagActions);
