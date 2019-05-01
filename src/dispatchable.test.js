import React, {useState} from 'react';
import makeDispatchable from './dispatchable';
import {render} from 'react-testing-library';
import {act} from 'react-dom/test-utils';

const Dummy = ({text}) => <>{text}</>;
const DumbDumbParent = ({DumbBoi}) => {
  const [status, setStatus] = useState('Failing');
  const setSuccess = () => setStatus('Success');

  return <>
    <div>{status}</div>
    <DumbBoi
      onClick={setSuccess}
    />
  </>;
};

describe('makeDispatchable', () => {
  it('fires with no param', () => {
    const [dispatch, Comp] = makeDispatchable();
    const onClick = jest.fn();
    render(<Comp onClick={onClick}/>);

    dispatch('onClick');
    expect(onClick).toBeCalledTimes(1);
  });

  it('fires with one param', () => {
    const [dispatch, Comp] = makeDispatchable();
    const onClick = jest.fn();
    render(<Comp onClick={onClick}/>);

    dispatch('onClick', 'you');
    expect(onClick).toBeCalledTimes(1);
    expect(onClick).toBeCalledWith('you');
  });

  it('fires with some params', () => {
    const [dispatch, Comp] = makeDispatchable();
    const onClick = jest.fn();
    render(<Comp onClick={onClick}/>);

    dispatch('onClick', '1', 2, {three: 4});
    expect(onClick).toBeCalledTimes(1);
    expect(onClick).toBeCalledWith('1', 2, {three: 4});
  });

  it('fires with some params to original component', () => {
    const [dispatch, Comp] = makeDispatchable();
    const {queryByText} = render(<DumbDumbParent DumbBoi={Comp}/>);
    expect(queryByText('Failing')).toBeTruthy();
    expect(queryByText('Success')).toEqual(null);

    act(() => dispatch('onClick', '1', 2, {three: 4}));

    expect(queryByText('Failing')).toEqual(null);
    expect(queryByText('Success')).toBeTruthy();
  });

  it('passes props to original component', () => {
    const [, Comp] = makeDispatchable(Dummy);
    const randStr = `${Math.random()}-${Date.now()}`;
    const {queryByText} = render(<Comp text={randStr}/>);

    expect(queryByText(randStr)).toBeTruthy();
  });

  it('fires with params only for the last instance', () => {
    const [dispatch, Comp] = makeDispatchable();
    const firstClickHandler = jest.fn();
    const secondClickHandler = jest.fn();
    render(<Comp onClick={firstClickHandler}/>);
    render(<Comp onClick={secondClickHandler}/>);

    dispatch('onClick', '1', 2);
    expect(firstClickHandler).toBeCalledTimes(0);
    expect(secondClickHandler).toBeCalledTimes(1);
    expect(secondClickHandler).toBeCalledWith('1', 2);
  });

  it('throws if dispatch is called before rendering', () => {
    const [dispatch] = makeDispatchable();
    const throwing = () => dispatch('onClick', '1', 2);
    expect(throwing).toThrow(`Tried calling onClick(1, 2) before component is rendered.`);
  });

  it('throws if dispatch is called on an undefined prop', () => {
    const [dispatch, Comp] = makeDispatchable();
    render(<Comp/>);
    const throwing = () => dispatch('onClick', '1', 2);
    expect(throwing).toThrow(`Tried calling onClick(1, 2), but props['onClick'] (undefined) is not a function`);
  });

  it('throws if dispatch is called on a non-function prop', () => {
    const [dispatch, Comp] = makeDispatchable();
    render(<Comp onClick="ORDAAAAA"/>);
    const throwing = () => dispatch('onClick', '1', 2);
    expect(throwing).toThrow(`Tried calling onClick(1, 2), but props['onClick'] (ORDAAAAA) is not a function`);
  });
});
