import * as React from 'react';

type PropsHistory<P> = { propsHistory: P[] };

export type WithPropsHistory<P> = React.ComponentType<P> & PropsHistory<P>;

declare function withPropsHistory<P>(Comp?: React.ComponentType<P>): WithPropsHistory<P>;

export default withPropsHistory;
