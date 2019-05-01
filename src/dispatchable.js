import React from 'react';
import makeDispatch from "./dispatch";

const defaultSubscriber = (action, ...params) => {
  throw new Error(`Tried calling ${action}(${params.join(', ')}) before component is rendered.`);
};

const makeDispatchable = Comp => {
  const d = makeDispatch();
  d.setSubscriber(defaultSubscriber);

  const EnhancedComp = props => {
    d.setSubscriber((action, ...params) => {
      const callable = props[action];
      if (!callable || typeof callable !== 'function') {
        throw new Error(`Tried calling ${action}(${params.join(', ')}), but props['${action}'] (${callable}) is not a function`);
      }
      callable(...params);
    });
    return <Comp {...props}/>;
  };
  return [d.dispatch, EnhancedComp];
};

export default makeDispatchable;
