// symbol-observable is a simple implementation of ECMA Observerable,
// it is the same as Rxjs, Xstream and Most.js, except that it doesn't implement transform utils 
// like 'mapto, scan, combineLatest..etc'
// it can be converted into Rxjs

const $$observable = require('symbol-observable');

const myObservable = {
  subscribe(observer) {
    observer.next('hello');
    setTimeout(() => {
      observer.next('world');
      observer.complete(); // should cause observer to auto unsubcribe
    }, 500);
    return {
      unsubscribe() {
        console.log('unsubscribe');
      },
    };
  },
  [$$observable]() {
    return this;
  },
};

myObservable.subscribe({
  next: val => console.log(val),
  complete: () => console.log('completed'),
  error: err => console.error(err),
});
