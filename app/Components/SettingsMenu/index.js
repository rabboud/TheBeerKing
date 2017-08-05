import _ from 'lodash';
import React from 'react';
import Modal from 'react-modal';
import Icon from '../Icon';
import Link from '../Link';
import Avatar from '../Avatar';
import Text from '../Text';

class SettingsMenu extends React.Component {
    constructor (props) {
        super(props);
        this.closing = '';
        this.state = {
            modalClosed: true,
            menuClosed: true,
            closing: false,
            menuItems: [
                {
                    id: 'panel',
                    name: 'Painel',
                    status: '',
                    active: false,
                    location: {
                        external: false,
                        url: '/dashboard'
                    },
                    icon: {
                        name: 'panel',
                        color: ''
                    }
                },
                {
                    id: 'widget',
                    name: 'Widget',
                    status: '',
                    active: false,
                    location: {
                        external: false,
                        url: '/widget'
                    },
                    icon: {
                        name: 'window',
                        color: ''
                    }
                },
                {
                    id: 'channels',
                    name: 'Canais',
                    status: '',
                    active: false,
                    location: {
                        external: false,
                        url: ''
                    },
                    icon: {
                        name: 'channels',
                        color: ''
                    },
                    subItems: [
                        {
                            id: 'facebook',
                            name: 'Facebook',
                            status: '',
                            active: false,
                            location: {
                                external: false,
                                url: '/facebook'
                            }
                        },
                        {
                            id: 'telegram',
                            name: 'Telegram',
                            status: '',
                            active: false,
                            location: {
                                external: false,
                                url: '/telegram'
                            }
                        },
                        {
                            id: 'email',
                            name: 'Email',
                            status: '',
                            active: false,
                            location: {
                                external: false,
                                url: '/email'
                            }
                        },
                        {
                            id: 'meli',
                            name: 'Mercado Livre',
                            status: '',
                            active: false,
                            location: {
                                external: false,
                                url: '/meli'
                            }
                        }
                    ]
                },
                {
                    id: 'config',
                    name: 'Configurações',
                    status: '',
                    active: false,
                    icon: {
                        name: 'config',
                        color: ''
                    },
                    subItems: [
                        {
                            id: 'users',
                            name: 'Usuários',
                            status: '',
                            active: false,
                            location: {
                                external: false,
                                url: '/users'
                            }
                        },
                        {
                            id: 'departments',
                            name: 'Departamentos',
                            status: '',
                            active: false,
                            location: {
                                external: false,
                                url: '/departments'
                            }
                        },
                        {
                            id: 'tags',
                            name: 'Tags',
                            status: '',
                            active: false,
                            location: {
                                external: false,
                                url: '/tags'
                            }
                        },
                        {
                            id: 'responses',
                            name: 'Repostas automáticas',
                            status: 'Em breve',
                            active: false,
                            location: {
                                external: false,
                                url: ''
                            }
                        },
                        {
                            id: 'officeHour',
                            name: 'Horário de atendimento',
                            status: '',
                            active: true,
                            location: {
                                external: false,
                                url: '/officeHour'
                            }
                        },
                        {
                            id: 'integrations',
                            name: 'Integrações',
                            status: '',
                            active: false,
                            location: {
                                external: false,
                                url: '/integrations'
                            }
                        }
                    ]
                },
                {
                    id: 'reports',
                    name: 'Relatórios',
                    status: 'Em breve',
                    active: false,
                    location: {
                        external: false,
                        url: ''
                    },
                    icon: {
                        name: 'report',
                        color: ''
                    }
                },
                {
                    id: 'account',
                    name: 'Conta',
                    status: '',
                    active: false,
                    location: {
                        external: false,
                        url: '/account'
                    },
                    icon: {
                        name: 'user',
                        color: 'gray-secondary'
                    }
                },
                {
                    id: 'help',
                    name: 'Ajuda',
                    status: '',
                    active: false,
                    hidePartner: true,
                    location: {
                        external: true,
                        url: 'https://www.omnize.com.br/ajuda/nova-versao-omnize-atendimento'
                    },
                    icon: {
                        name: 'help',
                        color: ''
                    }
                },
                {
                    id: 'licences',
                    name: 'Licenças',
                    status: 'Em breve',
                    active: false,
                    location: {
                        external: false,
                        url: ''
                    },
                    icon: {
                        name: 'cart',
                        color: ''
                    }
                }
            ]

        };
    }

    componentDidUpdate () {
        if (!this.props.closed && this.state.modalClosed) {
            this._open();
        }

        if (this.props.closed && !this.state.modalClosed && !this.state.menuClosed && !this.closing) {
            this._close();
        }

        if (!this.props.closed && !this.state.modalClosed && this.state.menuClosed && this.closing) {
            this._stopClose();
            this._openMenu();
        }
    }

    _open () {
        this.setState({
            modalClosed: false
        });
    }

    _openMenu () {
        this.setState({
            menuClosed: false
        });
    }

    _close () {
        this._closeMenu();
        this._closingModal();
    }

    _closeMenu () {
        if (this.closing) {
            return;
        }

        this.setState({
            menuClosed: true
        });
    }

    _closingModal () {
        this.closing = setTimeout(() => {
            this.setState({
                modalClosed: true
            });
            this.closing = '';
        }, 300);
    }

    _stopClose () {
        clearTimeout(this.closing);
        this.closing = '';
    }

    _closeAllMenuItemsBut (index) {
        const menuItems = this.state.menuItems;

        _.map(menuItems, (menuItem, key) => {
            if (key !== index) {
                menuItems[key].active = false;
            }
        });

        this.setState({
            menuItems: menuItems
        });
    }

    _toggleMenuItem (index) {
        const menuItems = this.state.menuItems;

        this._closeAllMenuItemsBut(index);
        menuItems[index].active = !this.state.menuItems[index].active;

        this.setState({
            menuItems: menuItems
        });
    }

    render () {
        const checkPermission = (itemId) => {
            const permissionItem = _.find(this.props.user.information.permissions, (permItem) => {
                return itemId === permItem.id;
            });


            if (permissionItem && !permissionItem.permission.view) {
                return false;
            }

            return true;
        };
        const checkPartner = (item) => {
            if (item.hidePartner && this.props.user.information.licenseCode === 'PARTNER') {
                return false;
            }
            return true;
        };
        const showMenuItem = (item) => {
            let willCheckPermission = false;

            if (this.props.user.information.permissions && Array.isArray(this.props.user.information.permissions)) {
                willCheckPermission = true;
            }

            if (item.subItems) {
                const subItemsToView = _.filter(item.subItems, (subItem) => {
                    if (willCheckPermission) {
                        if (checkPermission(subItem.id) && checkPartner(subItem)) {
                            return subItem;
                        }
                    } else if (checkPartner(subItem)) {
                        return subItem;
                    }
                });

                return subItemsToView.length ? true : false;
            }

            if (willCheckPermission) {
                return checkPermission(item.id) && checkPartner(item);
            }

            return checkPartner(item);
        };

        return (
            <Modal
                isOpen={!this.state.modalClosed}
                onAfterOpen={this._openMenu.bind(this)}
                onRequestClose={this.props.handleOnClose}
                shouldCloseOnOverlayClick={true}
                overlayClassName="SettingsMenu__overlay"
                className="SettingsMenu__content"
                contentLabel="Modal"
                parentSelector={this.props.parentSelector}
            >
                <nav className="SettingsMenu" data-closed={this.state.menuClosed}>
                    <div className="SettingsMenu__user">
                        <div className="SettingsMenu__user__img">
                            <Avatar src={this.props.user.information.photo || 'default'} size="large"/>
                        </div>
                        <div className="SettingsMenu__user__info">
                            <Text content={this.props.user.information.name} textColor="gray-primary"/>
                            <Text content={this.props.user.information.subscription === 'ADMIN' ? 'Administrador' : 'Atendente'} type="userType"/>
                        </div>
                    </div>
                    <ul className="SettingsMenu__list">
                        {
                            _.map(this.state.menuItems, (item, itemKey) => {
                                if (showMenuItem(item) === true) {
                                    return (
                                        <li key={itemKey} className="SettingsMenu__list__parent-item" data-active={item.active} onClick={() => this._toggleMenuItem(itemKey)}>
                                            {
                                                item.location ? (
                                                    <Link url={item.location.url} external={item.location.external}>
                                                        <div className="SettingsMenu__list__parent-item__switcher">
                                                            <Icon name={item.icon.name} width="18px" inline={true} iconColor={item.icon.color}/>
                                                            <Text content={item.name} inline={true} fontSize="15px" textColor="gray-primary"/>
                                                            {
                                                                item.subItems ? (
                                                                    <Icon iconClass="pull--right" name="chevron" width="11px" height="6px" rotate={item.active ? '' : '180'} inline={true} strokeColor="gray-secondary"/>
                                                                ) : ''
                                                            }
                                                            {
                                                                item.status ? (
                                                                    <Text className="pull--right" content={item.status} inline={true} type="bubble"/>
                                                                ) : ''
                                                            }
                                                        </div>
                                                    </Link>
                                                ) : (
                                                    <div className="SettingsMenu__list__parent-item__switcher">
                                                        <Icon name={item.icon.name} width="18px" inline={true} iconColor={item.icon.color}/>
                                                        <Text content={item.name} inline={true} fontSize="15px" textColor="gray-primary"/>
                                                        {
                                                            item.subItems ? (
                                                                <Icon iconClass="pull--right" name="chevron" width="11px" height="6px" rotate={item.active ? '' : '180'} inline={true} strokeColor="gray-secondary"/>
                                                            ) : null
                                                        }
                                                        {
                                                            item.status ? (
                                                                <Text className="pull--right" content={item.status} inline={true} type="bubble"/>
                                                            ) : null
                                                        }
                                                    </div>
                                                )
                                            }
                                            {
                                                item.subItems && item.active ? (
                                                    <ul className="SettingsMenu__list__child-list">
                                                        {
                                                            _.map(item.subItems, (subItem, subItemkey) => {
                                                                if (showMenuItem(subItem.id) === true) {
                                                                    return (
                                                                        <Link url={subItem.location.url} external={subItem.location.external} key={subItemkey}>
                                                                            <li className="SettingsMenu__list__child-list__item" data-disabled={subItem.status !== ''}>
                                                                                {subItem.name}
                                                                            </li>
                                                                        </Link>
                                                                    );
                                                                }
                                                            })
                                                        }
                                                    </ul>
                                                ) : null
                                            }
                                        </li>
                                    );
                                }
                            })
                        }
                    </ul>
                </nav>
            </Modal>
        );
    }
}

SettingsMenu.propTypes = {
    closed: React.PropTypes.bool,
    user: React.PropTypes.object,
    handleOnClose: React.PropTypes.func,
    parentSelector: React.PropTypes.func
};

export default SettingsMenu;
