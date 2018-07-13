import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { omit } from 'lodash/fp';
import { mapProps, withState, compose } from '../';

describe('mapProps', () => {
  it.only('shoudl compose with lodash', () => {
    const component = sinon.spy(() => null);
    component.displayName = 'component';

    const OmitPropsComponent = compose(
      mapProps(props => {
        console.log(props); // { prop1: 'prop1', prop2: 'prop2' }
        const result = omit(['prop1'], props);
        console.log(result); // { prop1: 'prop1' }
        return result;
      })
    )(component);

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
