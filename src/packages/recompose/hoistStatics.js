import hoistNonReactStatics from 'hoist-non-react-statics'

const hoistStatics = (higherOrderComponent, blacklist) => BaseComponent => {
  hoistNonReactStatics(higherOrderComponent(BaseComponent), BaseComponent, blacklist)
  return NewComponent
}

export default hoistStatics
