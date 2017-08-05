import React from 'react';
import {Link} from 'react-router';
import {AccountMenu} from 'app/screens/Components';
import Icon from '../Icon';

class Header extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <header className="Header">
                <div className="row collapse rythm--center">
                    <div className="small-6 large-6 columns">
                        <Link to="/">
                            {
                                this.props.currentUserStore.information.licenseCode !== 'PARTNER' ? (
                                    <Icon name="logo" width="126px" inline={true}/>
                                ) : (
                                    <div className="logo">
                                        {
                                            this.props.viewsStore.partner && this.props.viewsStore.partner.logoUrl ? (
                                                <img
                                                    className="logo__partner"
                                                    src={this.props.viewsStore.partner.logoUrl}
                                                />
                                            ) : ' '
                                        }
                                    </div>
                                )
                            }
                        </Link>
                    </div>
                    {
                        this.props.defaultProps.hideAccount
                            ? null : (
                            <div className="small-6 large-6 columns">
                                <div className="Header__account">
                                    <AccountMenu
                                        closed={this.props.viewsStore.accountMenuState === 'closed'}
                                        changePasswordClosed={this.props.viewsStore.changePasswordState === 'closed'}
                                    />
                                </div>
                            </div>
                        )
                    }
                </div>
            </header>
        );
    }
}

Header.PropTypes = {
    hideAccount: React.PropTypes.bool
};

Header.defaultProps = {
    hideAccount: false
};

export default Header;
