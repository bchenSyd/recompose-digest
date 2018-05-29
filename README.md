
While observables aren’t something you’ll find in the GoF’s Design Patterns, Subjects and Observers are the meat-and-potatoes of the [Observer Pattern](https://en.wikipedia.org/wiki/Observer_pattern).
![](https://cdn-images-1.medium.com/max/800/1*isWKTKNBoQrE5av1FZr6wQ.png)

```js
interface IObserver{
  next: (val)=>any, // notify
  error: err=>any,
  complete: ()=>any
}

interface ISubscription{
  unsubscribe: void=>any
}

interface IObservable{
  constructor: (IObserver)=> ISubscription,
  subscribe: IObserver => ISubscription,
}


const { Observable } = require("rxjs");

const observable = new Observable(observer => {
  observer.next(1); // notify observers
  observer.next(2);
  //if you emit `observer.complete()` from the observerable, all observers will be auto unsubscribed;
  return {
    unsubscribe() {
      console.log("unsubscribe");
    }
  };
});

console.log("before subscribe");

const subscription = observable.subscribe({
  next: x => console.log("got value" + x),
  error: err => console.error("error: " + err),
  complete: () => console.log("complete")
});

console.log("after subscribe");
subscription.unsubscribe(); // an observer proactively unsubscribe
```


Probably a more important distinction between Subject and Observable is that a Subject has state, it keeps a list of observers. On the other hand, an Observable is really just a function that sets up observation.