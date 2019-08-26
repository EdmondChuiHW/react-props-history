import {cleanup, render} from 'react-testing-library';
import React from 'react';
import withPropsHistory from './withPropsHistory';

afterEach(cleanup);

const last = array => array[array.length - 1];

describe('withPropsHistory', () => {
  describe('with default component', () => {
    it('pushes history from initial render', () => {
      const DummyWithHistory = withPropsHistory();

      render(<DummyWithHistory once={1} upon a="time"/>);

      const history = DummyWithHistory.propsHistory;
      expect(history.length).toEqual(1);
      expect(history[0].once).toEqual(1);
      expect(history[0].upon).toEqual(true);
      expect(history[0].a).toEqual('time');
    });

    it('pushes history for subsequent renders', () => {
      const DummyWithHistory = withPropsHistory();

      render(<DummyWithHistory once={1} upon a="time"/>);
      render(<DummyWithHistory once={2} upon a="timez"/>);
      render(<DummyWithHistory once={5} upon a="timezzz"/>);

      const history = DummyWithHistory.propsHistory;
      expect(history.length).toEqual(3);

      const lastHistory = last(history);
      expect(lastHistory.once).toEqual(5);
      expect(lastHistory.upon).toEqual(true);
      expect(lastHistory.a).toEqual('timezzz');
    });

    it('renders children', () => {
      const DummyWithHistory = withPropsHistory();
      const testId = `test-id-${Math.random()}`;

      const {getByTestId} = render(<DummyWithHistory>
        <div data-testid={testId}/>
      </DummyWithHistory>);

      // getBy… throws a helpful error message when it fails to find the element
      getByTestId(testId);
    });
  });

  describe('with existing component', () => {
    const makeDummy = () => ({onClick}) => (
      <button onClick={onClick}/>
    );

    it('pushes history from initial render', () => {
      const DummyWithHistory = withPropsHistory(makeDummy());
      const onClick = jest.fn();

      render(<DummyWithHistory onClick={onClick}/>);

      const history = DummyWithHistory.propsHistory;
      expect(history.length).toEqual(1);
      expect(history[0].onClick).toEqual(onClick);
    });

    it('pushes history for subsequent renders', () => {
      const DummyWithHistory = withPropsHistory(makeDummy());
      const onClick0 = jest.fn();
      const onClick1 = jest.fn();
      const onClick2 = jest.fn();

      render(<DummyWithHistory onClick={onClick0}/>);
      render(<DummyWithHistory onClick={onClick1}/>);
      render(<DummyWithHistory onClick={onClick2}/>);

      const history = DummyWithHistory.propsHistory;
      expect(history.length).toEqual(3);
      expect(history[0].onClick).toEqual(onClick0);
      expect(history[1].onClick).toEqual(onClick1);
      expect(history[2].onClick).toEqual(onClick2);
    });
  });
});
