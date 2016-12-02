import _ from 'lodash';
import React, { Component } from 'react';

const stores = {};
const bindings = {};


const dispatcher = (() => {
  return {
    registerStore: store => {
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
        if (_.has(store, 'actions.action') && _.isFunction(store.actions[action])) {
          store.data = _.assign(store.data, store.actions[action].apply(null, [store.data, data]));
          for (let component of bindings[store.name]) {
            component.setState(store.data);
          }
        }
      }
    }
  };
})();

class StoreBinding extends Component {
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
    return (
      <span>
        {React.Children.map(this.props.children, (child) =>
          (React.cloneElement(child, Object.assign({}, this.state)
          )))}
      </span>
    );
  }
}

export {
  dispatcher,
  StoreBinding
}