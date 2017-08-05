import React from 'react';
import Helmet from 'react-helmet';
import favicon from 'app/assets/images/icons/favicon.png';

class OMZHelmet extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <div className={`OMZHelmet ${this.props.className}`}>
                <Helmet
                    title={this.props.title}
                >
                    <meta httpEquiv="Content-type" content="text/html; charset=utf-8"/>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                    <link rel="shortcut icon" href={favicon} type="image/x-icon"/>
                </Helmet>
            </div>
        );
    }
}

OMZHelmet.PropTypes = {
    className: React.PropTypes.string,
    title: React.PropTypes.string
};

export default OMZHelmet;
