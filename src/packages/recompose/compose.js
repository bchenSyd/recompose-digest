const compose = (...funcs) =>
  // from right to left, Ramda::compose, Lodash:flowRight
  funcs.reduce((a, b) => (...args) => a(b(...args)), arg => arg);

export default compose;
