import React from 'react';
import _ from 'lodash';
import {Card, FlipCard, ChartArea, ChartPie, Avatar, Shape, Tooltip, Icon, InfiniteList, Line} from 'app/screens/Components';

class View extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            inAttendanceBack: false,
            pendingBack: false,
            attendedBack: false,
            notAttendedBack: false
        };
        this.interval = null;
    }

    componentDidUpdate () {
        this._checkForWindowFocused();
    }

    componentDidMount () {
        this._startInterval();
    }

    componentWillUnmount () {
        this._endInterval();
    }

    _checkForWindowFocused () {
        if (!this.props.viewsStore.isWindowFocused && this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }

        if (this.props.viewsStore.isWindowFocused && !this.interval) {
            this._startInterval();
        }
    }

    _startInterval () {
        if (this.interval) {
            return;
        }

        this.interval = setInterval(() => {
            const accountId = this.props.currentUserStore.information.account.id;

            this.props.interactionActions.fetchLastWeek({accountId: accountId});
            this.props.interactionActions.fetchTalking({accountId: accountId});
            this.props.interactionActions.fetchPending({accountId: accountId});
            this.props.interactionActions.fetchAnswered({accountId: accountId});
            this.props.interactionActions.fetchNotAnswered({accountId: accountId});
            this.props.visitorTrackerActions.fetchTotalCount({accountId: accountId});
            this.props.accountActions.fetchScore({accountId: accountId});
            this.props.userActions.fetchOnline({accountId: accountId});
            this.props.tagActions.fetchUseCount({accountId: accountId});
        }, 30000);
    }

    _endInterval () {
        clearInterval(this.interval);
        this.interval = null;
    }

    render () {
        const _getIconType = (type) => {
            const parsedType = type ? type.toLocaleLowerCase() : '';

            switch (parsedType) {
                case 'telegram':
                    return {name: 'telegram', width: '15px', height: '15px', class: '', color: ''};
                case 'facebook':
                    return {name: 'messenger', width: '15px', height: '15px', class: '', color: ''};
                case 'email':
                case 'offcontact':
                    return {name: 'mail', width: '15px', height: '15px', class: 'rythm--margin-t-1', color: 'gray-primary'};
                case 'audio':
                    return {name: 'voice', width: '12px', height: '23px', color: 'gray-primary'};
                case 'video':
                    return {name: 'video', width: '15px', height: '15px', color: 'gray-primary'};
                case 'meli_qst':
                case 'meli_msg':
                    return {name: 'meli', width: '15px', height: '10px', class: ''};
                default:
                    return {name: 'ballon-secondary', width: '15px', height: '15px', class: '', color: 'gray-primary'};
            }
        };
        const maxTagCount = () => {
            const tagsValues = _.mapValues(this.props.tagStore.useCount.data, (tag) => {
                return tag.value;
            });

            return _.max(_.values(tagsValues));
        };
        const getAggregatedMedias = (medias) => {
            const allMedias = [];

            _.map(medias, (media) => {
                const index = _.findIndex(allMedias, (m) => {
                    return m.name === media;
                });

                if (index === -1) {
                    allMedias.push({name: media, count: 1});
                } else {
                    allMedias[index].count = allMedias[index].count + 1;
                }
            });

            return (
                <ul>
                    {_.map(allMedias, (media, key) => {
                        const icon = _getIconType(media.name.toLocaleLowerCase());

                        return (
                            <li key={key}>
                                <span className="text--tertiary zeta">{media.count}</span>
                                <Icon
                                    name={icon.name}
                                    iconColor={icon.color}
                                    width={icon.width}
                                    height={icon.height}
                                    inline={true}
                                />
                            </li>
                        );
                    })}
                </ul>
            );
        };

        return (
            <section className="dashboard">
                <Card
                    helpers="card--full-height card--header-padding"
                    contentPadded={true}
                    title="Painel"
                    titleSize="big"
                >
                    <div className="row collapse" style={{height: '60%'}}>
                        <div className="large-9 columns" style={{height: '100%'}}>
                            <div className="row collapse" style={{height: 'calc(100% / 2)'}}>
                                <div
                                    className="large-4 columns pr10"
                                    style={{height: '100%', paddingBottom: '5px'}}
                                >
                                    <FlipCard
                                        title="Em atendimento"
                                        value={this.props.interactionStore.talking.data.total}
                                        clickable={true}
                                        showBack={this.state.inAttendanceBack}
                                        backContent={(
                                            <ChartPie
                                                name="inAttendanceChart"
                                                data={this.props.interactionStore.talking.data.details}
                                            />
                                        )}
                                        onFrontClick={
                                            () => {
                                                this.setState({inAttendanceBack: true});
                                            }
                                        }
                                        onCloseClick={
                                            () => {
                                                this.setState({inAttendanceBack: false});
                                            }
                                        }
                                    />
                                </div>
                                <div
                                    className="large-4 columns pr10"
                                    style={{height: '100%', paddingBottom: '5px'}}
                                >
                                    <FlipCard
                                        title="Pendentes"
                                        value={this.props.interactionStore.pending.data.total}
                                        clickable={true}
                                        showBack={this.state.pendingBack}
                                        backContent={(
                                            <ChartPie
                                                name="pendingChart"
                                                data={this.props.interactionStore.pending.data.details}
                                            />
                                        )}
                                        onFrontClick={
                                            () => {
                                                this.setState({pendingBack: true});
                                            }
                                        }
                                        onCloseClick={
                                            () => {
                                                this.setState({pendingBack: false});
                                            }
                                        }
                                    />
                                </div>
                                <div className="large-4 columns pr10" style={{height: '100%', paddingBottom: '5px'}}>
                                    <FlipCard
                                        title="Visitantes"
                                        value={this.props.visitorTrackerStore.total.data}
                                    />
                                </div>
                            </div>
                            <div className="row collapse" style={{height: 'calc(100% / 2)'}}>
                                <div className="large-4 columns pr10" style={{height: '100%', paddingTop: '5px'}}>
                                    <FlipCard
                                        title="Atendidos"
                                        value={this.props.interactionStore.answered.data.total}
                                        clickable={true}
                                        showBack={this.state.attendedBack}
                                        backContent={(
                                            <ChartPie
                                                name="attendendChart"
                                                data={this.props.interactionStore.answered.data.details}
                                            />
                                        )}
                                        onFrontClick={
                                            () => {
                                                this.setState({attendedBack: true});
                                            }
                                        }
                                        onCloseClick={
                                            () => {
                                                this.setState({attendedBack: false});
                                            }
                                        }
                                    />
                                </div>
                                <div className="large-4 columns pr10" style={{height: '100%', paddingTop: '5px'}}>
                                    <FlipCard
                                        title="Não atendidos"
                                        value={this.props.interactionStore.notAnswered.data.total}
                                        clickable={true}
                                        showBack={this.state.notAttendedBack}
                                        backContent={(
                                            <ChartPie
                                                name="notAttendedChart"
                                                data={this.props.interactionStore.notAnswered.data.details}
                                            />
                                        )}
                                        onFrontClick={
                                            () => {
                                                this.setState({notAttendedBack: true});
                                            }
                                        }
                                        onCloseClick={
                                            () => {
                                                this.setState({notAttendedBack: false});
                                            }
                                        }
                                    />
                                </div>
                                <div className="large-4 columns pr10" style={{height: '100%', paddingTop: '5px'}}>
                                    <FlipCard
                                        title="Pesquisa de satisfação"
                                        value={`${this.props.accountStore.score.data}%`}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="large-3 columns" style={{height: '100%'}}>
                            <FlipCard
                                title="Atendentes online"
                                content={(
                                    <InfiniteList scrollDirection="vertical">
                                        {_.map(this.props.userStore.online.data, (user, key) => (
                                            <li className="rythm--margin-t-1 rythm--margin-b-2" key={key}>
                                                <div className="row collapse">
                                                    <div className="large-10 columns">
                                                        <Avatar
                                                            name={user.name}
                                                            src={user.photo}
                                                            pieGraph={true}
                                                            graphPercentage={user.percent}
                                                        />
                                                    </div>
                                                    <div className="large-2 columns">
                                                        <Tooltip
                                                            header={(
                                                                <Shape
                                                                    type="circle"
                                                                    width="30px"
                                                                    height="30px"
                                                                    color="white"
                                                                    borderColor="gray"
                                                                    contentColor="blue-secondary"
                                                                >
                                                                    {user.medias.length}
                                                                </Shape>
                                                            )}
                                                        >
                                                            {getAggregatedMedias(user.medias)}
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </InfiniteList>
                                )}
                            />
                        </div>
                    </div>
                    <div className="row collapse" style={{height: '40%', paddingTop: '10px'}}>
                        <div className="large-9 columns pr10" style={{height: '100%'}}>
                            <FlipCard
                                title="Atendimentos"
                                content={(
                                    <ChartArea
                                        data={this.props.interactionStore.lastWeekInteractions.data}
                                        className="rythm--margin-t-1"
                                    />
                                )}
                            />
                        </div>
                        <div className="large-3 columns" style={{height: '100%'}}>
                            <FlipCard
                                title="Tags mais usadas"
                                content={(
                                    <InfiniteList scrollDirection="vertical">
                                        {_.map(this.props.tagStore.useCount.data, (tag, key) => (
                                            <li className="rythm--margin-t-1" key={key}>
                                                <div className="row collapse">
                                                    <div className="large-4 columns">
                                                        <p
                                                            style={{marginTop: '3px'}}
                                                            className="text--quinquennary text--wrap full--width"
                                                        >
                                                            #{tag.name}
                                                        </p>
                                                    </div>
                                                    <div className="large-6 columns">
                                                        <Line
                                                            hexColor={tag.color}
                                                            height="2px"
                                                            noLeftMargin={true}
                                                            rounded={true}
                                                            width={`${(tag.value / maxTagCount()) * 100}%`}
                                                        />
                                                    </div>
                                                    <div className="large-2 columns text-right">
                                                        <p
                                                            style={{marginTop: '3px'}}
                                                            className="text--quaternary text--black text--wrap full--width"
                                                        >
                                                            {tag.value}
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </InfiniteList>
                                )}
                            />
                        </div>
                    </div>
                </Card>
            </section>
        );
    }
}

export default View;
