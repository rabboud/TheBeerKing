import React from 'react';

class Component extends React.Component {
    constructor (props) {
        super(props);
        this.script = `<!-- Início do script Omnize -->\n<script>document.addEventListener('DOMContentLoaded',function(){var JSLink=location.protocol+'//widget.omnize.com',JSElement=document.createElement('script');JSElement.async=!0;JSElement.charset='UTF-8';JSElement.src=JSLink;JSElement.onload=OnceLoaded;document.getElementsByTagName('body')[0].appendChild(JSElement);function OnceLoaded(){wOmz.init({id:${this.props.id});}},false);</script>\n<!-- Fim do script Omnize -->`;
        this.handleSelect = this.selectText.bind(this);
    }

    selectText (event) {
        this.refs.script.select();
    }

    render () {
        return (
            <textarea ref="script" className="widget-code" defaultValue={this.script} onClick={this.handleSelect} data-readOnly="true"></textarea>
        );
    }
}

Component.propTypes = {
    id: React.PropTypes.number.isRequired
};


export default Component;
