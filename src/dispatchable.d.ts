import * as React from 'react';

declare function makeDispatchable<P>(Comp: React.ComponentType<P>): [makeDispatchable.DispatchReturnType<P>, React.ComponentType<P>];

declare namespace makeDispatchable {
  export type DispatchReturnType<P> = (propKey: keyof P, ...params) => void;
}

export default makeDispatchable;
