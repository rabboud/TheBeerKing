import React from 'react';
import Icon from '../Icon';
import AddNote from '../AddNote';
import MessageList from '../MessageList';
import StateMessage from '../StateMessage';

class InteractionNotes extends React.Component {
    constructor (props) {
        super(props);
    }

    _createNote (e) {
        if (this.props.handleCreateNote) {
            this.props.handleCreateNote(e);
        }
    }

    render () {
        const getMainContent = () => {
            if (this.props.interaction.notes.status !== '') {
                return (
                    <div className="rythm--padding-t-10">
                        <StateMessage
                            messageState={this.props.interaction.notes.status}
                            hasLoader={true}
                            loaderColor="black"
                            icon="notes"
                            size="big"
                            context={this.props.interaction.currentNote.adding ? 'Criação da nota' : 'Carregamento das notas'}
                            action={this.props.interaction.currentNote.adding ? this.props.handleCreateNote : this.props.handleLoadNotes}
                            back={this.props.handleToggleAddNote}
                        />
                    </div>
                );
            }

            if (this.props.interaction.notes.data.length) {
                return (
                    <div className="InteractionNotes__notes">
                        <p className="rythm--margin-b-1 text--quaternary text--gray  InteractionNotes__notes__title">
                            Anotações referentes ao protocolo atual
                        </p>
                        <div className="InteractionNotes__notes__list">
                            <MessageList searchable={false} messages={this.props.interaction.notes.data} title="agent" type="note" itemColor="gray" editableItem={true} handleEditItem={this.props.handleEditNote}/>
                        </div>
                        <div className="InteractionNotes__add">
                            <Icon name="close" iconClass="icon--inline icon--clickable" width="15px" height="15px" rotate="45" bkg={true} bkgSize="big" bkgRounded={true} bkgColor="gray-primary" handleClick={this.props.handleToggleAddNote}/>
                        </div>
                    </div>
                );
            }

            return (
                <div className="rythm--padding-t-10 InteractionNotes__empty">
                    <div className="rythm--margin-b-2 InteractionNotes__empty__icon">
                        <Icon iconClass="icon--pull-container-left" name="notes" width="100px" height="100px"/>
                    </div>
                    <h1 className="rythm--margin-b-1 title--tertiary title--gray centralize InteractionNotes__empty__title">
                        Anotações
                    </h1>
                    <p className="text--quaternary text--gray--quinquennary centralize InteractionNotes__empty__desc">
                        Você não possui nenhuma anotação.
                    </p>
                    <div className="InteractionNotes__add">
                        <Icon name="close" iconClass="icon--inline icon--clickable" width="15px" height="15px" rotate="45" bkg={true} bkgSize="big" bkgRounded={true} bkgColor="gray-primary" handleClick={this.props.handleToggleAddNote}/>
                    </div>
                </div>
            );
        };

        return (
            <div className="InteractionNotes">
                {
                    !this.props.interaction.currentNote.adding || this.props.interaction.notes.status !== '' ? (
                        <div className="InteractionNotes__container">
                            {getMainContent()}
                        </div>
                    ) : (
                        <div className="InteractionNotes__notes">
                            <p className="rythm--margin-b-1 text--quaternary text--gray InteractionNotes__notes__title">
                                Crie uma anotação referentes ao protocolo atual
                            </p>
                            <AddNote
                                ref="AddNote"
                                currentNote={this.props.interaction.currentNote}
                                tags={this.props.interaction.availableTags}
                                showTags={this.props.interaction.currentNote.showTags}
                                handleClose={this.props.handleToggleAddNote}
                                handleSave={this._createNote.bind(this)}
                                handleNoteChange={this.props.handleNoteChange}
                                handleToggleShowTags={this.props.handleToggleShowTags}
                                handleChangeTags={this.props.handleChangeTags}
                                handleSearchTagChange={this.props.handleSearchTagChange}
                                handleLoadTags={this.props.handleLoadTags}
                            />
                        </div>
                    )
                }
            </div>
        );
    }
}

InteractionNotes.PropTypes = {
    interaction: React.PropTypes.object,
    handleLoadTags: React.PropTypes.func,
    handleNoteChange: React.PropTypes.func,
    handleCreateNote: React.PropTypes.func,
    handleToggleAddNote: React.PropTypes.func,
    handleToggleShowTags: React.PropTypes.func,
    handleChangeTags: React.PropTypes.func,
    handleSearchTagChange: React.PropTypes.func,
    handleLoadNotes: React.PropTypes.func,
    handleEditNote: React.PropTypes.func
};

export default InteractionNotes;
