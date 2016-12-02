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


const bindStore = (Wrapped) => {
  return class StoreBinding extends Component {
    componentDidMount() {
      for (let store of _.get(this.props, 'stores', [])) {
        dispatcher.bind(store, this);
      }
    }

    componentWillUnmount() {
      for (let store of _.get(this.props, 'stores', [])) {
        dispatcher.unbind(store, this);
      }
    }
    render() {
      return <Wrapped {...this.state} />
    }
  }
};

export {
  dispatcher,
  bindStore
}