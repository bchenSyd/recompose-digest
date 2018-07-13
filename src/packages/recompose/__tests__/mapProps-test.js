import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { omit } from 'lodash/fp';
import { mapProps, withState, compose } from '../';

describe('mapProps', () => {
  it('shoudl compose with lodash basic form', () => {
    const component = sinon.spy(() => null);
    component.displayName = 'component';

    const OmitPropsComponent = mapProps(props => {
      console.log(props); // { prop1: 'prop1', prop2: 'prop2' }
      const result = omit(['prop1'], props);
      console.log(result); // { prop1: 'prop1' }
      return result;
    })(component);

    expect(OmitPropsComponent.displayName).toBe('mapProps(component)');

    mount(<OmitPropsComponent prop1="prop1" prop2="prop2" />);
    const props = component.firstCall.args[0];
    expect(props).toEqual({ prop2: 'prop2' });
  });

  it('shoudl compose with lodash advanced', () => {
    const component = sinon.spy(() => null);
    component.displayName = 'component';

    const OmitPropsComponent = mapProps(omit(['prop1']))(component);

    expect(OmitPropsComponent.displayName).toBe('mapProps(component)');

    mount(<OmitPropsComponent prop1="prop1" prop2="prop2" />);
    const props = component.firstCall.args[0];
    expect(props).toEqual({ prop2: 'prop2' });
  });

  it('shoudl compose with lodash final: https://github.com/acdlite/recompose/blob/master/docs/API.md#mapprops', () => {
    const component = sinon.spy(() => null);
    component.displayName = 'component';

    // curring: for omit to take in ['prop1'] as input and output a partially implemented function, 
    // which will feed mapProps
    // very clever!
    // compose(function1, <- function2, <- function3)(para for **function 3**)
    const OmitPropsComponent = compose(mapProps,omit)(['prop1'])(component);

    expect(OmitPropsComponent.displayName).toBe('mapProps(component)');

    mount(<OmitPropsComponent prop1="prop1" prop2="prop2" />);
    const props = component.firstCall.args[0];
    expect(props).toEqual({ prop2: 'prop2' });
  });

  it('mapProps maps owner props to child props', () => {
    const component = sinon.spy(() => null);
    component.displayName = 'component';

    const StringConcat = compose(
      withState('strings', 'updateStrings', ['do', 're', 'mi']),
      mapProps(({ strings, ...rest }) => ({
        ...rest,
        string: strings.join(''),
      }))
    )(component);

    expect(StringConcat.displayName).toBe('withState(mapProps(component))');

    mount(<StringConcat />);
    const props = component.firstCall.args[0];
    const { updateStrings } = props;

    updateStrings(strings => [...strings, 'fa']);

    expect(component.firstCall.args[0].string).toBe('doremi');
    expect(component.secondCall.args[0].string).toBe('doremifa');
  });
});
