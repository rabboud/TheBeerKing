import React from 'react';
import {Card, Button, InputFile, StateMessage, Response} from 'app/screens/Components';
import Modal from 'react-modal';
import AvatarEditor from 'react-avatar-editor';

class Crop extends React.Component {
    constructor (props) {
        super(props);

        this._setEditorRef = this._setEditorRef.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleFileLoad = this.handleFileLoad.bind(this);
        this.handleAvatarScale = this.handleAvatarScale.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleZoom = this.handleZoom.bind(this);
    }

    _setEditorRef (editor) {
        this.editor = editor;
    }

    handleFileLoad (params) {
        const Reader = new FileReader();

        Reader.onload = (e) => {
            this.props.currentUserActions.addAvatarPreview(e.target.result);
        };

        Reader.readAsDataURL(params.files[0]);
    }

    handleAvatarScale (element) {
        this.props.currentUserActions.changeAvatarScale(element.value);
    }

    handleSave (event) {
        if (typeof event === 'object') {
            event.preventDefault();
        }

        const imageCanvas = this.editor.getImageScaledToCanvas();

        this.props.currentUserActions.saveAvatar(
            this.props.currentUserStore.information.id,
            imageCanvas.toDataURL('image/jpeg')
        );
    }

    handleClose (event) {
        event.preventDefault();

        this.props.viewsActions.closeAvatar();
    }

    handleZoom (event, zoom) {
        event.preventDefault();
        const newScale = (zoom === 'out') ? this.props.currentUserStore.changeAvatarState.scale - 0.1 : this.props.currentUserStore.changeAvatarState.scale + 0.1;

        this.props.currentUserActions.zoomAvatar(newScale);
    }

    render () {
        const cardHeader = (
            <label>
                <h3 className="title title--card">
                    Alterar foto
                </h3>
            </label>
        );

        const getMainContent = () => {
            if (this.props.currentUserStore.changeAvatarState.status === 'DONE') {
                return (
                    <form className="centralize">
                        <div>
                            <Response title="Alteração realizada!" noTopSpace={true}>
                                <p>
                                    {this.props.currentUserStore.changeAvatarState.message}
                                </p>
                                <Button className="rythm--margin-t-2" size="big" color="gray" full={true} handleOnClick={(event) => this.handleClose(event)}>Fechar</Button>
                            </Response>
                        </div>
                    </form>
                );
            }


            if (this.props.currentUserStore.changeAvatarState.status === '') {
                return (
                    <form className="centralize">
                        <div>
                            <InputFile className="rythm--margin-b-2" ref="avatarInput" label="Selecione uma foto" onChange={this.handleFileLoad} />

                            <div className="Crop__zoom">
                                <Button className="Crop__zoom__btn" link={true} handleOnClick={(event) => this.handleZoom(event, 'out')}>-</Button>
                            </div>

                            <div className="Crop__editor-container">
                                <AvatarEditor
                                    ref={this._setEditorRef}
                                    image={this.props.currentUserStore.changeAvatarState.image !== '' ? this.props.currentUserStore.changeAvatarState.image : this.props.currentUserStore.information.photo}
                                    width={150}
                                    height={150}
                                    color={[255, 255, 255, 0.6]}
                                    scale={this.props.currentUserStore.changeAvatarState.scale}
                                    rotate={0}
                                    border={0}
                                />
                            </div>

                            <div className="Crop__zoom">
                                <Button className="Crop__zoom__btn" link={true} handleOnClick={(event) => this.handleZoom(event, 'in')}>+</Button>
                            </div>

                            <div className="row">
                                <Button className="rythm--margin-t-8" color="green" full={true} size="medium" handleOnClick={(event) => this.handleSave(event)}>Salvar</Button>
                            </div>
                        </div>
                    </form>
                );
            }

            return (
                <StateMessage
                    messageState={this.props.currentUserStore.changeAvatarState.status}
                    hasLoader={true}
                    loaderColor="black"
                    middle={true}
                    icon="user"
                    context={'Alteração da imagem de perfil'}
                />
            );
        };

        return (
            <Modal className="Crop"
                isOpen={this.props.viewsStore.changeAvatarState === 'opened' ? true : false}
                contentLabel="Alterar foto"
                style={{overlay: {backgroundColor: 'rgba(0, 0, 0, 0.75)'}}}
                shouldCloseOnOverlayClick={true}
                onRequestClose={this.handleClose}
            >
                <Card
                    title={cardHeader}
                    helpers="card--full-size"
                    scrollable={false}
                    contentPadded={true}
                >
                    {getMainContent()}
                </Card>
            </Modal>
        );
    }
}

export default Crop;
