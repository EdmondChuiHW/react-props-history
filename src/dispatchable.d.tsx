import * as React from 'react';

// May 4 2019 https://medium.com/dailyjs/typescript-create-a-condition-based-subset-types-9d902cea5b8c
type SubType<Base, Condition> = Pick<Base, {
  [Key in keyof Base]: Base[Key] extends Condition ? Key : never
}[keyof Base]>;

type FunctionProps<P> = SubType<P, Function>;

declare function makeDispatchable<P>(Comp?: React.ComponentType<P>)
  : [FunctionProps<P>, React.ComponentType<P>];

export default makeDispatchable;
