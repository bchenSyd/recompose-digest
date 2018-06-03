const  $$observable = require('symbol-observable');

const myObservable = {
    subscribe(observer) {
      observer.next('hello');
      setTimeout(() => {
          observer.next('world');
          observer.complete(); // should cause observer to auto unsubcribe
      }, 500);
      return {
        unsubscribe() {
          console.log('unsubscribe')
        }
      }
    },
    [$$observable]() { return this }
  };

myObservable.subscribe({
    next: val=> console.log(val),
    complete: ()=> console.log('completed'),
    error: err=> console.error(err)
})