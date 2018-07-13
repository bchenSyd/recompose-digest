import { createFactory } from 'react';
// symbol-observable is a simple implementation of ECMA Observerable,
// it is the same as Rxjs, Xstream and Most.js, except that it doesn't implement transform utils like 'mapto, scan, combineLatest..etc'
// it can be converted into Rxjs
import $$observable from 'symbol-observable';
import { componentFromStreamWithConfig } from './componentFromStream';
import setDisplayName from './setDisplayName';
import wrapDisplayName from './wrapDisplayName';
import { config as globalConfig } from './setObservableConfig';

const identity = t => t;

export const mapPropsStreamWithConfig = config => {
  const componentFromStream = componentFromStreamWithConfig({
    fromESObservable: identity,
    toESObservable: identity,
  });
  return transform => BaseComponent => {
    const factory = createFactory(BaseComponent);
    const { fromESObservable, toESObservable } = config;

    const props2vdom = props$ =>
      // below object is `symbol-observable` polyfilled, mostly by having `[$$observable]() { return this; }`
      // so it conforms to ECMA Observable proposal and is a fullon Observable itself,
      // therefore it can be (later on) converted to an Rxjs observable
      // see ../../symbol-observable.js for details
      ({
        subscribe(observer) {
          const subscription = toESObservable(
            transform(fromESObservable(props$))
          ).subscribe({
            next: childProps => observer.next(factory(childProps)),
          });
          return {
            unsubscribe: () => subscription.unsubscribe(),
          };
        },
        [$$observable]() {
          return this;
        },
      });

    return componentFromStream(props2vdom);
  };
};

const mapPropsStream = transform => {
  const hoc = mapPropsStreamWithConfig(globalConfig)(transform);

  if (process.env.NODE_ENV !== 'production') {
    return BaseComponent =>
      setDisplayName(wrapDisplayName(BaseComponent, 'mapPropsStream'))(
        hoc(BaseComponent)
      );
  }
  return hoc;
};

export default mapPropsStream;
