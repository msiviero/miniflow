import _ from 'lodash';
import React from 'react';

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
    dispatch: (store, action, data) => {
      const instance = stores[store];
      if (!instance) {
        throw new Error(`Store ${store} doesn't exist`);
      }
      const actionFn = _.get(instance, 'actions.' + action);
      if (!_.isFunction(actionFn)) {
        throw new Error(`Store ${store} doesn't have a ${action} action`);
      }
      instance.data = _.assign(instance.data, actionFn.call(null, instance.data, data));
      for (let component of bindings[store]) {
        component.setState(instance.data);
      }
    }
  };
})();


function bindStores(WrappedComponent, storesToBind) {

  if (!_.isArray(storesToBind)) {
    throw new Error('Stores is not an array');
  }

  return class StoreWrapper extends React.Component {
    componentWillMount() {
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
      return <WrappedComponent {...(_.assign({}, this.state)) } />;
    }
  };
}

export {
  dispatcher,
  bindStores
};
