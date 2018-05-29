```js
const { Observable } = require("rxjs");

const observable = new Observable(observer => {
  observer.next(1);
  observer.next(2);
  //if you emit `observer.complete()` from the observerable, all observers will be auto unsubscribed;
  return {
    unsubscribe() {
      console.log("unsubscribe");
    }
  };
});

console.log("before subscribe");

const observer = observable.subscribe({
  next: x => console.log("got value" + x),
  error: err => console.error("error: " + err),
  complete: () => console.log("complete")
});

console.log("after subscribe");
observer.unsubscribe(); // an observer proactively unsubscribe
```
