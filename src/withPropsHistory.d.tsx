import * as React from 'react';

type PropsHistory<P> = { propsHistory: P[] };

declare function withPropsHistory<P>(Comp?: React.ComponentType<P>)
  : React.ComponentType<P> & PropsHistory<P>;

export default withPropsHistory;
