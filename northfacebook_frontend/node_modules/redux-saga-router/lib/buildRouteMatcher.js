'use strict';

exports.__esModule = true;
exports.default = buildRouteMatcher;

var _ruta = require('ruta3');

var _ruta2 = _interopRequireDefault(_ruta);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function buildRouteMatcher(routes) {
  var routeMatcher = (0, _ruta2.default)();

  Object.keys(routes).forEach(function (route) {
    routeMatcher.addRoute(route, routes[route]);
  });

  return routeMatcher;
}