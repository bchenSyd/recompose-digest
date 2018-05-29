import React from 'react'
import { mount } from 'enzyme'
import { Observable, Subject } from 'rxjs'
import sinon from 'sinon'
import rxjsConfig from '../rxjsObservableConfig'
import { componentFromStreamWithConfig } from '../componentFromStream'

const componentFromStream = componentFromStreamWithConfig(rxjsConfig)

// vdom$ = f(props$)
test('componentFromStream transform a props$ stream into a vdom$ stream', () => {
  const Double = componentFromStream(props$ =>
    props$.map(({ n }) =>
      <div>
        {n * 2}
      </div>
    )
  )
  const wrapper = mount(<Double n={112} />)
  const div = wrapper.find('div')
  expect(div.text()).toBe('224')
  wrapper.setProps({ n: 358 })
  expect(div.text()).toBe('716')
})

test('componentFromStream unsubscribes from stream before unmounting', () => {
  let subscriptions = 0
  const vdom$ = new Observable(observer => {
    subscriptions += 1
    observer.next(<div />)
    return {
      unsubscribe() {
        subscriptions -= 1
      },
    }
  })
  const Div = componentFromStream(() => vdom$)
  const wrapper = mount(<Div />)
  expect(subscriptions).toBe(1)
  wrapper.unmount()
  expect(subscriptions).toBe(0)
})

test('componentFromStream renders nothing until the stream emits a value', () => {
  const vdom$ = new Subject()
  const Div = componentFromStream(() => vdom$.mapTo(<div />))
  const wrapper = mount(<Div />)
  expect(wrapper.find('div').length).toBe(0)
  vdom$.next()
  wrapper.update()
  expect(wrapper.find('div').length).toBe(1)
})

test.only('handler multiple observers of props stream', () => {
  const Other = () => <div />
  const Div = componentFromStream(props$ =>
    // Adds three observers to props stream
    // Rx.Observable.combineLatest(...args, [resultSelector])
    // args: an array or arguments of Observable sequences
    // resultSelector: Function to invoke whenever either of the sources produces an elemen
    // returns :
    // An observable sequence containing the result of combining elements of the sources using the specified result selector function.
    props$.combineLatest(props$, props$ , (props1, props2, props3) => {  // here we have 3 observables:  firstOne.combineLatest(second, third, resultSelector)
      // if any of the observable sequences produces an element (called next), the selector function will be invoked;
      console.log('rxjs got a value: ',props1)
      return <Other {...props1} />
    })
  )

  const wrapper = mount(<Div data-value={1} another="hello" />)

  wrapper.setProps({ 'data-value': 2 })

  wrapper.update()
  const div2 = wrapper.find(Other)
  expect(div2.prop('data-value')).toBe(2)
})

test('complete props stream before unmounting', () => {
  let counter = 0

  const Div = componentFromStream(props$ => {
    const first$ = props$.first().do(() => {
      counter += 1
    })

    const last$ = props$
      .last()
      .do(() => {
        counter -= 1
      })
      .startWith(null)

    return props$.combineLatest(first$, last$, props1 => {
      console.log(props1)
      return <div {...props1} />
    })
  })

  const wrapper = mount(<Div />)

  expect(counter).toBe(1)
  expect(wrapper.find('div').length).toBe(1)

  wrapper.unmount()
  expect(counter).toBe(0)
})

test('completed props stream should throw an exception', () => {
  const Div = componentFromStream(props$ => {
    const first$ = props$.filter(() => false).first().startWith(null)

    return props$.combineLatest(first$, props1 => {
      return <div {...props1} />
    })
  })

  const wrapper = mount(<Div />)

  expect(wrapper.find('div').length).toBe(1)

  /* > https://stackoverflow.com/a/41224462/6560291
  You have to use global to access objects in the global context

  global.console = {warn: jest.fn()}
  expect(console.warn).toBeCalled()
  or use jest.spyOn added in 19.0.0

  jest.spyOn(global.console, 'warn')
  
  */
  const error = sinon.stub(console, 'error')

  expect(() => wrapper.unmount()).toThrowError(/no elements in sequence/)
  expect(error.called).toBe(true)
})
