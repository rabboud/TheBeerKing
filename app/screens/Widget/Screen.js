import React from 'react';
import {ValidatorHelper} from 'app/helpers';
import {
    Card,
    Text,
    Accordion,
    WidgetCode,
    WidgetAppearance,
    WidgetMessages,
    WidgetOptions,
    WidgetPreview
} from 'app/screens/Components';

class View extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            activeIndex: 0
        };

        this.changeAccordionItem = this.changeAccordionItem.bind(this);
        this.changeTab = this.changeTab.bind(this);
        this.handleColorBlur = this.handleColorBlur.bind(this);
        this.handleMessagesChange = this.handleMessagesChange.bind(this);
        this.handleMessagesBlur = this.handleMessagesBlur.bind(this);
    }

    changeAccordionItem (key) {
        if (key === this.state.activeIndex) {
            this.setState({
                activeIndex: null
            });
        } else {
            this.setState({
                activeIndex: key
            });
        }
    }

    changeTab (key) {
        this.setState({
            activeTab: key
        });
    }

    handleColorBlur (color) {
        if (color.hex && ValidatorHelper.isHexColor(color.hex)) {
            this.props.widgetActions.updateAppearance(
                this.props.currentUserStore.information.account.id,
                'baseColor',
                color.hex,
                this.props.widgetStore.appearance.id
            );
            return;
        }

        if (ValidatorHelper.isHexColor(this.appearance.color.state.value)) {
            this.props.widgetActions.updateAppearance(
                this.props.currentUserStore.information.account.id,
                'baseColor',
                this.appearance.color.state.value,
                this.props.widgetStore.appearance.id
            );
        }
    }

    handleMessagesChange (id) {
        this.props.widgetActions.saveValue(
            id,
            this.messages.refs[id].state.value
        );
    }

    handleMessagesBlur (id) {
        this.props.widgetActions.updateAppearance(
            this.props.currentUserStore.information.account.id,
            id,
            this.messages.refs[id].state.value,
            this.props.widgetStore.appearance.id
        );
    }

    render () {
        const messages = [
            {
                id: 'mainTitle',
                title: 'Título inicial',
                value: this.props.widgetStore.appearance.mainTitle
            },
            {
                id: 'channelSelectionMsg',
                title: 'Mensagem de seleção do canal',
                value: this.props.widgetStore.appearance.channelSelectionMsg
            },
            {
                id: 'welcomeText',
                title: 'Mensagem de boas vindas de texto',
                value: this.props.widgetStore.appearance.welcomeText
            },
            {
                id: 'welcomeAudio',
                title: 'Mensagem de boas vindas de áudio',
                value: this.props.widgetStore.appearance.welcomeAudio
            },
            {
                id: 'welcomeVideo',
                title: 'Mensagem de boas vindas de video',
                value: this.props.widgetStore.appearance.welcomeVideo
            },
            {
                id: 'deptoSelectionMsg',
                title: 'Título de escolha de departamento',
                value: this.props.widgetStore.appearance.deptoSelectionMsg
            },
            {
                id: 'firstAgentMessage',
                title: 'Mensagem para aguardar atendimento no chat',
                value: this.props.widgetStore.appearance.firstAgentMessage
            },
            {
                id: 'activeInteractionMessage',
                title: 'Mensagem padrão para interação ativa',
                value: this.props.widgetStore.appearance.activeInteractionMessage
            },
            {
                id: 'endInteractionMsg',
                title: 'Mensagem de Finalização',
                value: this.props.widgetStore.appearance.endInteractionMsg
            },
            {
                id: 'deptoTitleMsg',
                title: 'Título de escolha de departamento (select)',
                value: this.props.widgetStore.appearance.deptoTitleMsg
            },
            {
                id: 'feedbackQuestion',
                title: 'Mensagem de avaliação do atendimento',
                value: this.props.widgetStore.appearance.feedbackQuestion
            },
            {
                id: 'textTranscriptionMsg',
                title: 'Mensagem de transcrição da conversa',
                value: this.props.widgetStore.appearance.textTranscriptionMsg
            }
        ];
        const options = [
            {
                id: 'enableCallout',
                title: 'Gatilho - Convite automático para chat',
                value: this.props.widgetStore.appearance.enableCallout
            },
            {
                id: 'enablePreCare',
                title: 'Formulário de pré-atendimento',
                value: this.props.widgetStore.appearance.enablePreCare
            },
            {
                id: 'enableCustomerFeedback',
                title: 'Pesquisa de satisfação',
                value: this.props.widgetStore.appearance.enableCustomerFeedback
            },
            {
                id: 'enableTextTranscription',
                title: 'Cópia da conversa por e-mail',
                value: this.props.widgetStore.appearance.enableTextTranscription
            },
            {
                id: 'enableCpf',
                title: 'Exibir campo CPF (opcional)',
                value: this.props.widgetStore.appearance.enableCpf
            }
        ];
        const primaryItems = [
            {
                name: 'Aparência',
                panel: (
                    <WidgetAppearance
                        ref={(c) => this.appearance = c}
                        color={this.props.widgetStore.appearance.baseColor}
                        version={this.props.widgetStore.appearance.widgetVersion}
                        position={this.props.widgetStore.appearance.positions}
                        icon={this.props.widgetStore.appearance.icon}
                        onBarSelected={() => this.props.widgetActions.updateAppearance(
                            this.props.currentUserStore.information.account.id,
                            'widgetVersion',
                            '1.0',
                            this.props.widgetStore.appearance.id
                        )}
                        onBubbleSelected={() => this.props.widgetActions.updateAppearance(
                            this.props.currentUserStore.information.account.id,
                            'widgetVersion',
                            '1.5',
                            this.props.widgetStore.appearance.id
                        )}
                        onColorChange={() => this.props.widgetActions.saveValue(
                            'baseColor',
                            this.appearance.color.state.value,
                            this.props.widgetStore.appearance.id
                        )}
                        onColorBlur={this.handleColorBlur}
                        onLeftSelected={() => this.props.widgetActions.updateAppearance(
                            this.props.currentUserStore.information.account.id,
                            'positions',
                            'LEFT',
                            this.props.widgetStore.appearance.id
                        )}
                        onRightSelected={() => this.props.widgetActions.updateAppearance(
                            this.props.currentUserStore.information.account.id,
                            'positions',
                            'RIGHT',
                            this.props.widgetStore.appearance.id
                        )}
                        onIconChange={(icon) => this.props.widgetActions.updateAppearance(
                            this.props.currentUserStore.information.account.id,
                            'icon',
                            icon,
                            this.props.widgetStore.appearance.id
                        )}
                    />
                )
            },
            {
                name: 'Mensagens e textos',
                panel: (
                    <WidgetMessages
                        ref={(c) => this.messages = c}
                        messages={messages}
                        onChange={this.handleMessagesChange}
                        onBlur={this.handleMessagesBlur}
                    />
                )
            },
            {
                name: 'Opções',
                panel: (
                    <WidgetOptions
                        options={options}
                        onToggleOption={(id, state) => this.props.widgetActions.updateAppearance(
                            this.props.currentUserStore.information.account.id,
                            id,
                            !state,
                            this.props.widgetStore.appearance.id
                        )}
                        accountFree={this.props.viewsStore.accountFree}
                    />
                )
            }
        ];

        if (this.props.currentUserStore.information.licenseCode !== 'PARTNER') {
            primaryItems.unshift({
                name: 'Código JavaScript',
                panel: (
                    <WidgetCode accountId={this.props.currentUserStore.information.account.id}/>
                )
            });
        }

        return (
            <section className="widget">
                <Card
                    titleSize="big"
                    height="calc(100vh - 90px)"
                    contentPadded={true}
                    title={<Text type="title" textColor="white" content="Widget"/>}
                >
                    <div className="row collapse full--height">
                        <div className="large-6 columns full--height pr10">
                            <Accordion
                                activeIndex={this.state.activeIndex}
                                items={primaryItems}
                                onItemClick={this.changeAccordionItem}
                            />
                        </div>
                        <div className="large-6 columns full--height">
                            <Card
                                title={
                                    `${this.state.activeIndex === 0
                                    && this.props.currentUserStore.information.licenseCode !== 'PARTNER'
                                        ? 'Usa alguma plataforma? Veja os tutoriais abaixo'
                                        : 'Pré visualização do Widget'}`
                                }
                                titleSize="medium"
                                titleColor="gray-secondary"
                                headerSize="x-small"
                                headerColor="gray-secondary"
                                contentColor="gray-tertiary"
                                contentPadded={false}
                                height="100%"
                                tabIndex={this.state.activeTab}
                                onTabClick={this.changeTab}
                            >
                                {
                                    this.state.activeIndex === 0
                                    && this.props.currentUserStore.information.licenseCode !== 'PARTNER' ? (
                                        <iframe
                                            src="https://omnize.github.io/tutorials"
                                            width="100%"
                                            height="100%"
                                            style={{
                                                border: 'none',
                                                margin: '20px'
                                            }}
                                        />
                                    ) : (
                                        <WidgetPreview
                                            version={this.props.widgetStore.appearance.widgetVersion}
                                            color={this.props.widgetStore.appearance.baseColor}
                                            position={this.props.widgetStore.appearance.positions}
                                            icon={this.props.widgetStore.appearance.icon}
                                            contentOpened={this.state.activeIndex !== 1}
                                        />
                                    )
                                }
                            </Card>
                        </div>
                    </div>
                </Card>
            </section>
        );
    }
}

export default View;
