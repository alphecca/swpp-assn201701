'use strict';

exports.__esModule = true;
exports.router = exports.createHashHistory = exports.createBrowserHistory = undefined;

var _createBrowserHistory2 = require('history/createBrowserHistory');

var _createBrowserHistory3 = _interopRequireDefault(_createBrowserHistory2);

var _createHashHistory2 = require('history/createHashHistory');

var _createHashHistory3 = _interopRequireDefault(_createHashHistory2);

var _router2 = require('./router');

var _router3 = _interopRequireDefault(_router2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.createBrowserHistory = _createBrowserHistory3.default;
exports.createHashHistory = _createHashHistory3.default;
exports.router = _router3.default;