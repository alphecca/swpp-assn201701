'use strict';

exports.__esModule = true;
exports.default = createHistoryChannel;

var _reduxSaga = require('redux-saga');

var BUFFER_LIMIT = 5;

function createHistoryChannel(history) {
  function subscribe(emitter) {
    var initialLocation = void 0;

    if (typeof history.getCurrentLocation === 'function') {
      initialLocation = history.getCurrentLocation();
    } else {
      initialLocation = history.location;
    }

    if (initialLocation) {
      emitter(initialLocation);
    }

    return history.listen(function (location) {
      emitter(location);
    });
  }

  return (0, _reduxSaga.eventChannel)(subscribe, _reduxSaga.buffers.fixed(BUFFER_LIMIT));
}