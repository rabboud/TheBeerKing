import React from 'react';
import Icon from '../Icon';
import {Textarea} from '../Form';
import MultiSelect from '../MultiSelect';
import StateMessage from '../StateMessage';

class AddNote extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <div className="AddNote">
                <div className="AddNote__actions">
                    <div className="large-1 AddNote__actions__item AddNote__actions__close">
                        <Icon name="close" inline={true} clickable={true} iconColor="red-primary" width="12px" height="12px" handleClick={this.props.handleClose}/>
                    </div>
                    <div className="large-10 AddNote__actions__item AddNote__actions__title">
                        <p className="text--tertiary text--bold">Nova Anotação</p>
                    </div>
                    <div className="large-1 AddNote__actions__item AddNote__actions__save">
                        <Icon name="check" inline={true} clickable={true} iconColor="green-secondary" width="20px" height="15px" handleClick={this.props.handleSave}/>
                    </div>
                </div>
                <div className="AddNote__note">
                    <Textarea ref="NotesContent" value={this.props.currentNote.content} bkgColor="yellow-secondary" bkgActive={true} resize="vertical" noBorder={true} noPadding={true} handleOnChange={this.props.handleNoteChange}/>
                </div>
                {
                    this.props.currentNote.tagsStatus === '' ? (
                        <div className="AddNote__tags">
                            <div className="large-1 rythm--center AddNote__tags__item">
                                <Icon name="close" inline={true} clickable={true} width="8px" height="8px" bkg={true} bkgSize="small" bkgCircle={true} rotate={this.props.currentNote.showTags ? '' : '45'} bkgColor={this.props.currentNote.showTags ? 'red-primary' : 'green-primary'} handleClick={this.props.handleToggleShowTags}/>
                            </div>
                            <div className="large-10 AddNote__tags__item">
                                <MultiSelect className="AddNote__tags__select" ref="Tags" placeholder="Use tags para classificar seu atendimento" options={this.props.tags} selecteds={this.props.currentNote.tags} viewResults={this.props.currentNote.showTags} handleChange={this.props.handleChangeTags} unique={true} handleCloseResults={this.props.handleToggleShowTags} currentValue={this.props.currentNote.searchValue} handleSearchChange={this.props.handleSearchTagChange}/>
                            </div>
                            <div className="large-1 rythm--center AddNote__tags__item AddNote__tags__item--pull-down">
                                <Icon name="tag" inline={true} clickable={true} iconColor="gray-primary" opacity={this.props.currentNote.tags.length ? '' : '5'} width="16px" height="16px"/>
                            </div>
                        </div>
                    ) : (
                        <div className="AddNote__tags">
                            <StateMessage
                                messageState={this.props.currentNote.tagsStatus}
                                middle={true}
                                hasLoader={true}
                                loaderColor="black"
                                inline={true}
                                size="small"
                                icon="tag"
                                context={'Carregamento das tags'}
                                action={this.props.handleLoadTags}
                            />
                        </div>
                    )
                }
            </div>
        );
    }
}

AddNote.PropTypes = {
    currentNote: React.PropTypes.object,
    tags: React.PropTypes.array,
    handleToggleShowTags: React.PropTypes.func,
    handleChangeTags: React.PropTypes.func,
    handleClose: React.PropTypes.func,
    handleSave: React.PropTypes.func,
    handleNoteChange: React.PropTypes.func,
    handleSearchTagChange: React.PropTypes.func,
    handleLoadTags: React.PropTypes.func
};

export default AddNote;
