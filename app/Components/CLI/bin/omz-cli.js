#!/usr/bin/env node
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _figlet = require('figlet');

var _figlet2 = _interopRequireDefault(_figlet);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _ejs = require('ejs');

var _ejs2 = _interopRequireDefault(_ejs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Component = function () {
    function Component() {
        _classCallCheck(this, Component);

        this.kind = '';
        this.params = '';
        this.stores = [];
        this.actions = [];
    }

    _createClass(Component, [{
        key: '_registerStyle',
        value: function _registerStyle() {
            _fs2.default.appendFile('../style/main.sass', '@import \'../' + this.name + '/index.sass\'\n', function (err) {
                if (err) return console.log(err);
            });
        }
    }, {
        key: '_registerComponent',
        value: function _registerComponent() {
            _fs2.default.appendFile('../index.js', 'export {default as ' + this.name + '} from \'./' + this.name + '\';\n', function (err) {
                if (err) return console.log(err);

                console.log('Done!');
            });
        }
    }, {
        key: '_createStyle',
        value: function _createStyle() {
            var templateContent = _fs2.default.readFileSync('./src/templates/style.ejs', 'utf8');
            var renderedStyle = _ejs2.default.render(templateContent, { component: { name: this.name } });

            _fs2.default.writeFileSync('../' + this.name + '/_index.sass', renderedStyle);
        }
    }, {
        key: '_createHocMarkup',
        value: function _createHocMarkup() {
            var templateIndexContent = _fs2.default.readFileSync('./src/templates/' + this.kind + '.ejs', 'utf8');
            var templateContent = _fs2.default.readFileSync('./src/templates/defaultComponent.ejs', 'utf8');
            var renderedIndexComponent = _ejs2.default.render(templateIndexContent, {
                component: {
                    name: this.name,
                    params: this.params,
                    stores: _lodash2.default.map(this.stores, function (store) {
                        return store + 'Store';
                    }),
                    actions: _lodash2.default.map(this.actions, function (action) {
                        return action + 'Actions';
                    })
                }
            });
            var renderedComponent = _ejs2.default.render(templateContent, {
                component: {
                    name: this.name,
                    params: this.params
                }
            });

            if (!_fs2.default.existsSync('../' + this.name)) {
                _fs2.default.mkdirSync('../' + this.name);
                _fs2.default.writeFileSync('../' + this.name + '/index.js', renderedIndexComponent);
                _fs2.default.writeFileSync('../' + this.name + '/Screen.js', renderedComponent);
                this._registerComponent();
                this._registerStyle();
            }
        }
    }, {
        key: '_createMarkup',
        value: function _createMarkup() {
            var templateContent = _fs2.default.readFileSync('./src/templates/' + this.kind + '.ejs', 'utf8');
            var renderedComponent = _ejs2.default.render(templateContent, { component: { name: this.name, params: this.params } });

            if (!_fs2.default.existsSync('../' + this.name)) {
                _fs2.default.mkdirSync('../' + this.name);
            }

            _fs2.default.writeFileSync('../' + this.name + '/index.js', renderedComponent);
            this._registerComponent();
            this._registerStyle();
        }
    }, {
        key: 'setStores',
        value: function setStores(stores) {
            this.stores = stores.split(',');
        }
    }, {
        key: 'setActions',
        value: function setActions(actions) {
            this.actions = actions.split(',');
        }
    }, {
        key: 'setName',
        value: function setName(name) {
            this.name = name.charAt(0).toUpperCase() + name.slice(1);
        }
    }, {
        key: 'setKind',
        value: function setKind(kind) {
            this.kind = kind;
        }
    }, {
        key: 'setParams',
        value: function setParams(params) {
            this.params = params || '';
        }
    }, {
        key: 'render',
        value: function render() {
            if (!_fs2.default.existsSync('./src/templates/' + this.kind + '.ejs')) {
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
    }]);

    return Component;
}();

var questions = [{
    name: 'componentName',
    message: 'Component name:'
}, {
    name: 'componentParams',
    message: 'Component parameters (className, color, disabled...):'
}, {
    name: 'componentType',
    type: 'list',
    message: 'Choose a component type:',
    choices: ['Default', 'Stateless', 'High Order']
}];

(0, _figlet2.default)('omz', function (err, data) {
    console.log(_chalk2.default.red(data), '\n  C O M P O N E N T S\n');
    var NewComponent = new Component();

    _inquirer2.default.prompt(questions).then(function (answers) {
        if (_fs2.default.existsSync('../' + answers.componentName)) {
            console.log(_chalk2.default.yellow('[WARNING] Component already created.'));
            return;
        }

        NewComponent.setName(answers.componentName);

        if (answers.componentParams) NewComponent.setParams(answers.componentParams);

        switch (answers.componentType) {
            case 'Default':
                NewComponent.setKind('defaultComponent');
                NewComponent.render();
                break;
            case 'Stateless':
                NewComponent.setKind('statelessComponent');
                NewComponent.render();
                break;
            case 'High Order':
                var hocQuestions = [{
                    name: 'hocStores',
                    message: 'Insert the component\'s Stores (User, Interaction, Views, ...):'
                }, {
                    name: 'hocActions',
                    message: 'Insert the component\'s Actions (User, Interaction, Views, ...):'
                }];

                _inquirer2.default.prompt(hocQuestions).then(function (hocAnswers) {
                    NewComponent.setKind('hocComponent');
                    NewComponent.setStores(hocAnswers.hocStores);
                    NewComponent.setActions(hocAnswers.hocActions);
                    NewComponent.render();
                    return;
                });

                break;
        }
    });
});
