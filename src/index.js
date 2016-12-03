import _ from 'lodash';
import React, { Component } from 'react';

const stores = {};
const bindings = {};


const dispatcher = (() => {
  return {
    store: store => {
      stores[store.name] = _.assign({ data: {} }, store);
      bindings[store.name] = [];
    },
    bind: (store, component) => {
      bindings[store].push(component);
      component.setState(_.assign({}, stores[store].data));
    },
    unbind: (store, component) => {
      _.remove(bindings[store], item => item === component);
    },
    dispatch: (action, data) => {
      for (let store of _.values(stores)) {
        const actionFn = _.get(store, 'actions.' + action);
        if (_.isFunction(actionFn)) {
          store.data = _.assign(store.data, actionFn.call(null, store.data, data));
          for (let component of bindings[store.name]) {
            component.setState(store.data);
          }
        }
      }
    }
  };
})();


function bindStores(WrappedComponent, storesToBind) {

  if (!_.isArray(storesToBind)) {
    throw new Error('Stores is not an array');
  }

  return class StoreWrapper extends Component {
    componentDidMount() {
      for (let store of storesToBind) {
        dispatcher.bind(store, this);
      }
    }
    componentWillUnmount() {
      for (let store of storesToBind) {
        dispatcher.unbind(store, this);
      }
    }
    render() {
      return <WrappedComponent {...(_.assign({}, this.state)) } />
    }
  }
};

export {
  dispatcher,
  bindStores
}