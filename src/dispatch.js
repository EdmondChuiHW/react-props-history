const makeDispatch = () => {
  // single subscriber by design. Only to be used by makeDispatchable(…)
  // use RxJS or similar for actual pub/sub
  let sub = () => {};

  return {
    setSubscriber: subscriber => sub = subscriber,
    dispatch: (...params) => sub(...params),
  };
};

export default makeDispatch;
