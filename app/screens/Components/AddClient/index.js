import React from 'react';
import Icon from 'Icon';

class AddClient extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <div className={`AddClient ${this.props.className}`}>
                <div className="AddClient__icon">
                    <Icon name="add-user" width="65px" height="63px" clickable={true} inline={true} handleClick={this.props.handleAdd}/>
                </div>
                <div className="AddClient__text rythm--margin-t-1">
                    <p className="text--quaternary text--gray-secondary">Não encontrou o cliente? <span className="AddClient__text__link text--gray" onClick={this.props.handleAdd}>Crie um novo cadastro</span></p>
                </div>
            </div>
        );
    }
}

AddClient.PropTypes = {
    className: React.PropTypes.string,
    handleAdd: React.PropTypes.func
};

export default AddClient;
