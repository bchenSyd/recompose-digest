const mapValues = (obj, func) => {
  debugger;

  const result = {};
  /* eslint-disable no-restricted-syntax */
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const val = obj[key];
      result[key] = func(val, key);
    }
  }
  /* eslint-enable no-restricted-syntax */
  return result;
};

export default mapValues;
