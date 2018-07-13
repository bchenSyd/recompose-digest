/* eslint-disable */
import { createFactory, Component } from 'react';
import setDisplayName from './setDisplayName';
import wrapDisplayName from './wrapDisplayName';
import mapValues from './utils/mapValues';

/* {
    increase: ({updateState})=>()=>updateStae(n=>++n)
}*/
const withHandlers = handlers => BaseComponent => {
  const factory = createFactory(BaseComponent);
  class WithHandlers extends Component {
    constructor() {
      super();
      // this.handlers is only set up once during construction; Won't changed afterwards
      this.handlers = mapValues(
        typeof handlers ===
        'function' /* most of the time handler is an object with handler name as key (same as redux-actions, handleActions)*/
          ? handlers(this.props)
          : handlers,
        createHandler => (...args) => {
          debugger;
          const handler = createHandler(this.props); // pass `this.props` into handler function

          if (
            process.env.NODE_ENV !== 'production' &&
            typeof handler !== 'function'
          ) {
            console.error(
              // eslint-disable-line no-console
              'withHandlers(): Expected a map of higher-order functions. ' +
                'Refer to the docs for more info.'
            );
          }

          return handler(...args);
        }
      );
    }

    render() {
      return factory({
        ...this.props,
        ...this.handlers, // this.handlers never changes; only set during construction
      });
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'withHandlers'))(
      WithHandlers
    );
  }
  return WithHandlers;
};

export default withHandlers;
