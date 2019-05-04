import React from 'react';
import copyFunctionsIntoDest from './copy-functions-into-dest';

const DummyComp = () => <></>;

const makeDispatchable = (Comp = DummyComp) => {
  const dispatch = {};

  const EnhancedComp = props => {
    copyFunctionsIntoDest(props, dispatch);
    return <Comp {...props}/>;
  };
  return [dispatch, EnhancedComp];
};

export default makeDispatchable;
