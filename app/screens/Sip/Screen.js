import React from 'react';
import {Card} from 'app/screens/Components';
import {interactionActions} from 'app/flux/Actions';
import {visitorTrackerActions} from 'app/flux/Actions';
import {mercadolivreActions} from 'app/flux/Actions';
import {departmentActions} from 'app/flux/Actions';
import map from 'lodash/map';

class Component extends React.Component {
    constructor (props) {
        super(props);
    }

    _acceptInteraction (sessionId) {
        if (this.props.interactionStore.inbox[sessionId]) {
            interactionActions.retrieveMessages(sessionId);
        } else {
            interactionActions.connect(sessionId);
        }
        this.props.currentUserStore.OmzSip.profile.acceptText(sessionId);
    }

    _closeInteraction (sessionId) {
        this.props.currentUserStore.OmzSip.profile.finishSession(sessionId);
        interactionActions.close(sessionId);
    }

    _endInteraction (sessionId) {
        this.props.currentUserStore.OmzSip.profile.finishText(sessionId);
    }

    _finishInteraction (sessionId) {
        this.props.currentUserStore.OmzSip.profile.finishText(sessionId);
        this.props.currentUserStore.OmzSip.profile.finishSession(sessionId);
        interactionActions.close(sessionId);
    }

    _finishPostponedInteraction (sessionId) {
        const interaction = this.props.interactionStore.interactions[sessionId];
        const target = interaction.departmentUri;
        const agentId = this.props.currentUserStore.information.id;

        this.props.currentUserStore.OmzSip.profile.finishPostponed(sessionId, target, agentId);
        interactionActions.close(sessionId);
    }

    _postponedInteraction (sessionId) {
        interactionActions.postponed(sessionId);
        this.props.currentUserStore.OmzSip.profile.postponeText(sessionId);
    }

    _sendMessage (sessionId) {
        if (this.refs[sessionId].value !== '') {
            const text = this.refs[sessionId].value;

            interactionActions.sendMessage(text, sessionId);
        }
        this.refs[sessionId].value = '';
    }

    _typeMessage (sessionId) {
        interactionActions.typeMessage(sessionId);
    }

    _clearMessage (sessionId) {
        interactionActions.clearMessage(sessionId);
    }

    _acceptCallInteraction (sessionId) {
        interactionActions.acceptCall(sessionId);
        this.props.currentUserStore.OmzSip.profile.acceptCall();
    }

    _closeCallInteraction (sessionId) {
        this.props.currentUserStore.OmzSip.profile.finishSession();
        interactionActions.close(sessionId);
    }

    _endCallInteraction (sessionId) {
        this.props.currentUserStore.OmzSip.profile.finishCall();
    }

    _finishCallInteraction (sessionId) {
        this.props.currentUserStore.OmzSip.profile.finishCall();
        this.props.currentUserStore.OmzSip.profile.finishSession();
        interactionActions.close(this.currentSessionId);
    }

    _saveCustomerInfo (customerInfo, sessionId) {
        customerInfo.customerId = this.refs.customerId.value;
        customerInfo.name = this.refs.name.value;
        customerInfo.email = this.refs.email.value;
        customerInfo.phone = this.refs.phone.value;
        customerInfo.cpf = this.refs.cpf.value;
        customerInfo.accountId = this.props.currentUserStore.information.account.id;
        customerInfo.interactionHash = sessionId;
        interactionActions.saveCustomerInfo(customerInfo);
    }

    _searchCustomerInfo (sessionId) {
        if (this.refs.search.value !== '') {
            const name = this.refs.search.value;

            interactionActions.searchCustomerInfo(name, sessionId, this.props.currentUserStore.information.account.id);
        }
    }

    _visitorTracker () {
        visitorTrackerActions.getVisitors(this.props.currentUserStore.information.account.id);
    }

    _visitorTrackerDetail (customerId) {
        visitorTrackerActions.getVisitorDetails(customerId);
    }

    _visitorTrackerInvite (customerId) {
        visitorTrackerActions.inviteVisitor(customerId);
    }

    _inbox () {
        const agentId = this.props.currentUserStore.information.id;
        const accountId = this.props.currentUserStore.information.account.id;

        interactionActions.getInbox(accountId, agentId);
    }

    _loadDepartments () {
        const params = {
            reset: null,
            accountId: this.props.currentUserStore.information.account.id,
            page: 0,
            headerId: '',
            orderDirection: '',
            search: this.props.departmentStore.search,
            state: true
        };

        departmentActions.fetchAll(params);
    }

    _loadIntegrations () {
        mercadolivreActions.fetchAll(this.props.currentUserStore.information.account.id);
    }

    render () {
        return (
            <section className="sip">
                <div className="sip__container">
                    <Card className="card--full-height">
                        <div>
                            <div className="rythm--5">
                                <div className="large-2 columns rythm--center">
                                    <span className="title title--secondary">Sip interaction</span>
                                </div>
                                <div className="large-2 columns rythm--center">
                                    <p>{this.props.currentUserStore.registerState}</p>
                                </div>
                                <div className="large-6 columns rythm--center">
                                </div>
                            </div>
                            <br/>
                            {map(this.props.interactionStore.interactions, (item, key) => {
                                return (
                                    <Card className="card--full-height">
                                        {(item.type === 'audio') || (item.type === 'video') ? (
                                            <div className="large-6 columns">
                                                <h4>{item.type}</h4>
                                                SessionId: {key}<br/>
                                                Status: {item.state}<br/>
                                                {item.state === 'RINGING' ? (
                                                    <button onClick={() => this._acceptCallInteraction(key)}>Accept</button>
                                                ) : (
                                                    item.state === 'ENDED' ? (
                                                        <button onClick={() => this._closeCallInteraction(key)}>Close</button>
                                                    ) : (
                                                        <div>
                                                            <button onClick={() => this._endCallInteraction(key)}>End/Edit</button>
                                                            <button onClick={() => this._finishCallInteraction(key)}>Finish</button>
                                                        </div>
                                                    )
                                                )}
                                                <section>
                                                    <div id="stream-container"></div>
                                                    <video id="local-stream"></video>
                                                    <video id="remote-stream"></video>

                                                    <audio id="local-audio-stream"></audio>
                                                    <audio id="remote-audio-stream"></audio>
                                                </section>
                                                {item.state === 'TALKING' ? (
                                                    <div>
                                                        <h4>Messages</h4>
                                                        {map(item.messages, (message, mkey) => {
                                                            return (
                                                                <p>{message.content}, {message.state}</p>
                                                            );
                                                        })}
                                                        <p>Digitando: {item.typing}</p>
                                                        <input type="text" ref={key}></input>
                                                        <button onClick={() => this._sendMessage(key)}>Send</button>
                                                        <button onClick={() => this._typeMessage(key)}>Typing</button>
                                                        <button onClick={() => this._clearMessage(key)}>Cleared</button>
                                                    </div>
                                                ) : (
                                                    <div></div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="large-6 columns">
                                                <h3>
                                                    SessionId: {key}<br/>
                                                    Status: {item.state}<br/>
                                                    {item.state === 'RINGING' ? (
                                                        <button onClick={() => this._acceptInteraction(key)}>Accept</button>
                                                    ) : (
                                                        item.state === 'ENDED' ? (
                                                            <button onClick={() => this._closeInteraction(key)}>Close</button>
                                                        ) : (
                                                            item.state === 'POSTPONED' ? (
                                                                <div>
                                                                    <button onClick={() => this._closeInteraction(key)}>Close</button>
                                                                    <button onClick={() => this._finishPostponedInteraction(key)}>FinishP</button>
                                                                </div>
                                                            ) : (
                                                                item.type === 'text' ? (
                                                                    <div>
                                                                        <button onClick={() => this._endInteraction(key)}>End/Edit</button>
                                                                        <button onClick={() => this._finishInteraction(key)}>Finish</button>
                                                                    </div>
                                                                ) : (
                                                                    <div>
                                                                        <button onClick={() => this._postponedInteraction(key)}>Postponed</button>
                                                                        <button onClick={() => this._finishInteraction(key)}>Finish</button>
                                                                    </div>
                                                                )
                                                            )
                                                        )
                                                    )}
                                                </h3>
                                                {(item.state === 'TALKING') || (item.state === 'POSTPONED') || (item.state === 'PENDING') ? (
                                                    <div>
                                                        <h4>Messages</h4>
                                                        {map(item.messages, (message, mkey) => {
                                                            return (
                                                                <p>{message.content}, {message.state}</p>
                                                            );
                                                        })}
                                                        <p>Digitando: {item.typing}</p>
                                                        <input type="text" ref={key}></input>
                                                        <button onClick={() => this._sendMessage(key)}>Send</button>
                                                        <button onClick={() => this._typeMessage(key)}>Typing</button>
                                                        <button onClick={() => this._clearMessage(key)}>Cleared</button>
                                                    </div>
                                                ) : (
                                                    <div></div>
                                                )}
                                            </div>
                                        )}
                                        <div className="large-6 columns">
                                            <div>
                                                <h3>Customer Info</h3>
                                                <p>Name: {item.customerInfo.name}</p>
                                                <p>Email: {item.customerInfo.email}</p>
                                                <p>Browser: {item.customerInfo.browser}</p>
                                                <p>Os: {item.customerInfo.so}</p>
                                                <p>Source: {item.customerInfo.source}</p>
                                                <p>Ip: {item.customerInfo.ip}</p>
                                                <p>Department: {item.customerInfo.department}</p>
                                                <p>CustomerId: {item.customerInfo.customerId}</p>
                                                <p>New customerId: <input type="text" ref="customerId" defaultValue={item.customerInfo.customerId}></input></p>
                                                <p>New name: <input type="text" ref="name" defaultValue={item.customerInfo.name}></input></p>
                                                <p>New email: <input type="text" ref="email" defaultValue={item.customerInfo.email}></input></p>
                                                <p>New phone: <input type="text" ref="phone" defaultValue={item.customerInfo.phone}></input></p>
                                                <p>New cpf: <input type="text" ref="cpf" defaultValue={item.customerInfo.cpf}></input></p>
                                                <button onClick={() => this._saveCustomerInfo(item.customerInfo, key)}>Save</button>
                                                <br />
                                                <input type="text" ref="search"></input>
                                                <button onClick={() => this._searchCustomerInfo(key)}>Search</button>
                                                {map(this.props.interactionStore.customers, (customer, ckey) => {
                                                    return (
                                                        <div>
                                                            <p>Name: {customer.name}</p>
                                                            <p>Email: {customer.email}</p>
                                                            <p>CustomerId: {customer.customer_id}</p>
                                                            <br />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    </Card>
                    <br/>
                    <Card className="card--full-height">
                        <div className="large-12 columns">
                            <div className="large-2 columns">
                                <span className="title title--secondary">Mercado Livre</span>
                            </div>
                            <div className="large-2 columns">
                                <button onClick={() => this._loadDepartments()}>Load departments</button>
                                <button onClick={() => this._loadIntegrations()}>Load integrations</button>
                            </div>
                            <div className="large-4 columns">
                                {map(this.props.departmentStore.departments, (item, key) => {
                                    return (
                                        <div>
                                            <div className="large-6 columns">
                                                {`${item.name} (${item.id})`}
                                            </div>
                                            <div className="large-6 columns">
                                                <a href={`http://auth.mercadolibre.com/authorization?response_type=code&client_id=3661238920521397&redirect_uri=https://servicos.omnize.com/mercadolivre?departmentId=${item.id}`} title="Auth ML" target="_blank">
                                                    Liberar
                                                </a>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="large-4 columns">
                                {map(this.props.mercadolivreStore.integrations, (item, key) => {
                                    return (
                                        <div>
                                            <div className="large-12 columns">
                                                Id: {item.id}<br/>
                                                SellerId: {item.sellerId}<br/>
                                                DepartmentId: {item.departmentId}<br/>
                                                AccessToken: {item.accessToken}<br/>
                                                RefreshToken: {item.refreshToken}<br/>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </Card>
                    <br/>
                    <Card className="card--full-height">
                        <div className="large-12 columns">
                            <div className="large-2 columns">
                                <span className="title title--secondary">Visitor Tracker</span>
                            </div>
                            <div className="large-2 columns">
                                <button onClick={() => this._visitorTracker()}>Reload</button>
                            </div>
                            <div className="large-8 columns">
                            </div>
                        </div>
                        {map(this.props.visitorTrackerStore.visitors, (item, key) => {
                            return (
                                <div>
                                    <div className="large-7 columns">
                                        {item.customerId}
                                    </div>
                                    <div className="large-2 columns">
                                        {item.os}
                                    </div>
                                    <div className="large-1 columns">
                                        {item.visits}
                                    </div>
                                    <div className="large-1 columns">
                                        <button onClick={() => this._visitorTrackerDetail(item.customerId)}>Detail</button>
                                    </div>
                                    <div className="large-1 columns">
                                        <button onClick={() => this._visitorTrackerInvite(item.customerId)}>Invite</button>
                                    </div>
                                </div>
                            );
                        })}
                        {map(this.props.visitorTrackerStore.detail, (item, key) => {
                            return (
                                <div className="large-12 columns">
                                    <br/>
                                    <h4>Details:</h4>
                                    PageUrl: {item.pageUrl}<br/>
                                    Ip: {item.ip}<br/>
                                    Browser: {item.browser}<br/>
                                    CustomerName: {item.customerName}<br/>
                                </div>
                            );
                        })}
                    </Card>
                    <br/>
                    <Card className="card--full-height">
                        <div className="large-12 columns">
                            <div className="large-2 columns">
                                <span className="title title--secondary">Inbox</span>
                            </div>
                            <div className="large-2 columns">
                                <button onClick={() => this._inbox()}>Reload</button>
                            </div>
                            <div className="large-8 columns">
                            </div>
                        </div>
                        {map(this.props.interactionStore.inbox, (item, key) => {
                            return (
                                <div>
                                    <div className="large-6 columns">
                                        {item.hash}
                                    </div>
                                    <div className="large-1 columns">
                                        {item.department}
                                    </div>
                                    <div className="large-2 columns">
                                        {item.state}
                                    </div>
                                    <div className="large-1 columns">
                                        {item.type}
                                    </div>
                                    <div className="large-1 columns">
                                    </div>
                                    <div className="large-1 columns">
                                    </div>
                                    {map(item.messages, (m, mkey) => {
                                        return (
                                            <div>
                                                <div className="large-4 columns">
                                                    Message: {m.content}
                                                </div>
                                                <div className="large-2 columns">
                                                    {m.direction}
                                                </div>
                                                <div className="large-3 columns">
                                                    {m.state}
                                                </div>
                                                <div className="large-3 columns">
                                                    {m.type}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </Card>
                </div>
            </section>
        );
    }
}

export default Component;
