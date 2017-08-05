#!/usr/bin/env node
import fs from 'fs';
import Inquirer from 'inquirer';
import Figlet from 'figlet';
import Chalk from 'chalk'
import _ from 'lodash';
import Ejs from 'ejs';

class Component {
    constructor () {
        this.kind = '';
        this.params = '';
        this.stores = [];
        this.actions = [];
    }

    _registerStyle() {
        fs.appendFile('../style/main.sass', `@import '../${this.name}/index.sass'\n`, (err) => {
            if (err) return console.log(err);
        });
    }

    _registerComponent() {
        fs.appendFile('../index.js', `export {default as ${this.name}} from './${this.name}';\n`, (err) => {
            if (err) return console.log(err);

            console.log('Done!');
        });
    }

    _createStyle() {
        const templateContent = fs.readFileSync('./src/templates/style.ejs', 'utf8');
        const renderedStyle = Ejs.render(templateContent, {component: {name: this.name}});

        fs.writeFileSync(`../${this.name}/_index.sass`, renderedStyle);
    }

    _createHocMarkup() {
        const templateIndexContent = fs.readFileSync(`./src/templates/${this.kind}.ejs`, 'utf8');
        const templateContent = fs.readFileSync('./src/templates/defaultComponent.ejs', 'utf8');
        const renderedIndexComponent = Ejs.render(templateIndexContent, {
            component: {
                name: this.name,
                params: this.params,
                stores: _.map(this.stores, (store) => {
                    return `${store}Store`;
                }),
                actions: _.map(this.actions, (action) => {
                    return `${action}Actions`;
                })
            }
        });
        const renderedComponent = Ejs.render(templateContent, {
            component: {
                name: this.name,
                params: this.params
            }
        });

        if (!fs.existsSync(`../${this.name}`)) {
            fs.mkdirSync(`../${this.name}`);
            fs.writeFileSync(`../${this.name}/index.js`, renderedIndexComponent);
            fs.writeFileSync(`../${this.name}/Screen.js`, renderedComponent);
            this._registerComponent();
            this._registerStyle();
        }
    }

    _createMarkup() {
        const templateContent = fs.readFileSync(`./src/templates/${this.kind}.ejs`, 'utf8');
        const renderedComponent = Ejs.render(templateContent, {component: {name: this.name, params: this.params}});

        if (!fs.existsSync(`../${this.name}`)) {
            fs.mkdirSync(`../${this.name}`);
        }

        fs.writeFileSync(`../${this.name}/index.js`, renderedComponent);
        this._registerComponent();
        this._registerStyle();
    }

    setStores (stores) {
        this.stores = stores.split(',');
    }

    setActions (actions) {
        this.actions = actions.split(',');
    }

    setName (name) {
        this.name = name.charAt(0).toUpperCase() + name.slice(1)
    }

    setKind (kind) {
        this.kind = kind;
    }

    setParams (params) {
        this.params = params || '';
    }

    render () {
        if (!fs.existsSync(`./src/templates/${this.kind}.ejs`)) {
            console.log('Missing template file.');
            return;
        }

        if (this.kind === 'hocComponent') {
            this._createHocMarkup();
        } else {
            this._createMarkup();
        }
        this._createStyle();
    }
}

const questions = [
    {
        name: 'componentName',
        message: 'Component name:'
    },
    {
        name: 'componentParams',
        message: 'Component parameters (className, color, disabled...):'
    },
    {
        name: 'componentType',
        type: 'list',
        message: 'Choose a component type:',
        choices: ['Default', 'Stateless', 'High Order']
    }
];


Figlet('omz', (err,data) => {
    console.log(Chalk.red(data), '\n  C O M P O N E N T S\n');
    const NewComponent = new Component();

    Inquirer.prompt(questions).then((answers) => {
        if (fs.existsSync(`../${answers.componentName}`)) {
            console.log(Chalk.yellow('[WARNING] Component already created.'));
            return;
        }

        NewComponent.setName(answers.componentName);

        if (answers.componentParams)
            NewComponent.setParams(answers.componentParams);

        switch (answers.componentType) {
            case 'Default':
                NewComponent.setKind('defaultComponent')
                NewComponent.render();
            break;
            case 'Stateless':
                NewComponent.setKind(`statelessComponent`);
                NewComponent.render();
            break;
            case 'High Order':
                const hocQuestions = [
                    {
                        name: 'hocStores',
                        message: 'Insert the component\'s Stores (User, Interaction, Views, ...):'
                    },
                    {
                        name: 'hocActions',
                        message: 'Insert the component\'s Actions (User, Interaction, Views, ...):'
                    }
                ];

                Inquirer.prompt(hocQuestions).then((hocAnswers) => {
                    NewComponent.setKind(`hocComponent`);
                    NewComponent.setStores(hocAnswers.hocStores);
                    NewComponent.setActions(hocAnswers.hocActions);
                    NewComponent.render();
                    return;
                });

            break;
        }
    });
});
