import React from 'react'
import { mount } from 'enzyme'
import { componentFromProp } from '../'

test('componentFromProp create child component based on the prop name', () => {
  const Container = componentFromProp('propName')
  expect(Container.displayName).toBe('componentFromProp(propName)')

  const Component = ({ pass }) =>
    <div>
      Pass: {pass}
    </div>

  const wrapper = mount(<Container propName={Component} pass="through" />)
  const div = wrapper.find('div')
  expect(div.text()).toBe('Pass: through')
})
