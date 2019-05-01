import makeDispatch from "./dispatch";

describe('makeDispatch', () => {
  it('sends action to no subscribers without crashing', () => {
    const dispatch = makeDispatch();
    dispatch.dispatch('onClick', '1', 2, {three: 4});
  });

  it('sends action to one subscriber', () => {
    const dispatch = makeDispatch();
    const subscriber = jest.fn();

    dispatch.setSubscriber(subscriber);
    dispatch.dispatch('onClick', '1', 2, {three: 4});

    expect(subscriber).toBeCalledTimes(1);
    expect(subscriber).toBeCalledWith('onClick', '1', 2, {three: 4});
  });

  it('sends action to last subscriber', () => {
    const dispatch = makeDispatch();
    const subscriberOne = jest.fn();
    const subscriberTwo = jest.fn();

    dispatch.setSubscriber(subscriberOne);
    dispatch.setSubscriber(subscriberTwo);
    dispatch.dispatch('onClick', '1', 2, {three: 4});

    expect(subscriberOne).toBeCalledTimes(0);
    expect(subscriberTwo).toBeCalledTimes(1);
    expect(subscriberTwo).toBeCalledWith('onClick', '1', 2, {three: 4});
  });
});
