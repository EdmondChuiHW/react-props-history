const copyFunctionsIntoDest = (source, dest) => {
  if (!source) return;
  Object
    .keys(source)
    .forEach(k => {
      const v = source[k];
      if (typeof v === 'function') {
        dest[k] = v;
      }
    });
};

export default copyFunctionsIntoDest;
