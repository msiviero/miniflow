'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bindStores = exports.dispatcher = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var stores = {};
var bindings = {};

var dispatcher = function () {
  return {
    store: function store(_store) {
      stores[_store.name] = _lodash2.default.assign({ data: {} }, _store);
      bindings[_store.name] = [];
    },
    bind: function bind(store, component) {
      bindings[store].push(component);
      component.setState(_lodash2.default.assign({}, stores[store].data));
    },
    unbind: function unbind(store, component) {
      _lodash2.default.remove(bindings[store], function (item) {
        return item === component;
      });
    },
    dispatch: function dispatch(store, action, data) {
      var instance = stores[store];
      if (!instance) {
        throw new Error('Store ' + store + ' doesn\'t exist');
      }
      var actionFn = _lodash2.default.get(instance, 'actions.' + action);
      if (!_lodash2.default.isFunction(actionFn)) {
        throw new Error('Store ' + store + ' doesn\'t have a ' + action + ' action');
      }
      instance.data = _lodash2.default.assign(instance.data, actionFn.call(null, instance.data, data));
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = bindings[store][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var component = _step.value;

          component.setState(instance.data);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  };
}();

function bindStores(WrappedComponent, storesToBind) {

  if (!_lodash2.default.isArray(storesToBind)) {
    throw new Error('Stores is not an array');
  }

  return function (_React$Component) {
    _inherits(StoreWrapper, _React$Component);

    function StoreWrapper() {
      _classCallCheck(this, StoreWrapper);

      return _possibleConstructorReturn(this, (StoreWrapper.__proto__ || Object.getPrototypeOf(StoreWrapper)).apply(this, arguments));
    }

    _createClass(StoreWrapper, [{
      key: 'componentWillMount',
      value: function componentWillMount() {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = storesToBind[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var store = _step2.value;

            dispatcher.bind(store, this);
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = storesToBind[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var store = _step3.value;

            dispatcher.unbind(store, this);
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }
      }
    }, {
      key: 'render',
      value: function render() {
        return _react2.default.createElement(WrappedComponent, _lodash2.default.assign({}, this.state));
      }
    }]);

    return StoreWrapper;
  }(_react2.default.Component);
}

exports.dispatcher = dispatcher;
exports.bindStores = bindStores;