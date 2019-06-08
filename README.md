# react-props-history
[![Build Status](https://dev.azure.com/EdmondChuiHW/react-props-history/_apis/build/status/EdmondChuiHW.react-props-history?branchName=master)](https://dev.azure.com/EdmondChuiHW/react-props-history/_build/latest?definitionId=3&branchName=master)
[![npm version](https://badge.fury.io/js/react-props-history.svg)](https://badge.fury.io/js/react-props-history)
![David](https://img.shields.io/david/EdmondChuiHW/react-props-history.svg)
![David](https://img.shields.io/david/dev/EdmondChuiHW/react-props-history.svg)

Allows props history of a React component to be inspected in tests

## Install
`npm i react-props-history -D`

## Example
Consider this `PizzaBuilder`:
```
import React, {useState} from 'react';
import Dropdown from "…";

const PizzaBuilder = props => {
  const [status, setStatus] = useState('Hungry');
  const setCrustType = crust => setStatus(`Selected 🍕 crust: ${crust}`);

  return <>
    <div>{status}</div>
    <Dropdown
      onItemSelected={setCrustType}
    />
  </>;
};
```
To test that the correct crust is shown after an item from `Dropdown` has been selected, you might be tempted to mock away `Dropdown`, or use some selectors to drill down the DOM tree, find the dropdown, simulate a click event, find the row with the target crust, simulate a click event, etc. 😨 It may look something like this: 
```
import {render} from 'react-testing-library';
import {Simulate} from 'react-dom/test-utils';

describe('SearchBar', () => {
  it('updates text on Dropdown item selected', () => {
    const {queryByText, container} = render(<PizzaBuilder/>);
    
    const dropdown = container.querySelector('[aria-label="Crust picker"]');
    Simulate.mouseDown(dropdown);
    
    // You probably have something more complicated than :first-of-type
    const thinCrustItem = dropdown.querySelector('li:first-of-type');
    Simulate.mouseDown(thinCrustItem);

    expect(queryByText('Selected 🍕 crust: thin')).toBeTruthy();
  });
});
```
The noise-to-signal ratio is _too damn high_. All you want is to assert `Selected 🍕 crust: thin` exists. But you have to spend 80% of your test doing irrelevant gymnastics to trigger your item-selected handler.  
If you decided to swap out Dropdown with RadioGroup, your tests will break immediately.

If you find a component hard to unit test, it’s a strong sign that it’s too tightly-coupled.

A well-composed component should be loosely-coupled, without the need to mock or drill down its children. Let's make PizzaBuilder take CrustSelector as a prop:
```
import Dropdown from "…";

const PizzaBuilder = ({CrustSelector = Dropdown}) => {
  …
  return <>
    <div>{status}</div>
    <CrustSelector
      onItemSelected={setCrustType}
    />
  </>;
};
```
It works exactly the same as before, except we now allow `CrustSelector` to be optionally passed in, while maintaining the simple syntax `<PizzaBuilder/>` with `Dropdown` as default.

If you decided to swap out `Dropdown` with `RadioGroup`, you can do that easily. Anyone could be a `CrustSelector` ~if you believe in yourself~, it just needs to implement `onItemSelected`.

The only link between `PizzaBuilder` and `CrustSelector` is `onItemSelected`.

Loosely-coupled components have minimal knowledge and dependencies on each other.

With [react-props-history](https://github.com/EdmondChuiHW/react-props-history), we can now pass in a special CrustSelector that lets us trigger onItemSelected in our tests:
```
import withPropsHistory from 'react-props-history';
import {render} from 'react-testing-library';
import {act} from 'react-dom/test-utils';

describe('SearchBar', () => {
  it('updates text on CrustSelector item selected', () => {
    const TestDropdown = withPropsHistory();  // or pass an actual Dropdown: withPropsHistory(Dropdown)
    const {queryByText} = render(<PizzaBuilder CrustSelector={TestDropdown}/>);

    expect(TestDropdown.propsHistory.length).toEqual(1);
    act(() => TestDropdown.propsHistory[0].onItemSelected('thin'));
    expect(queryByText('Selected 🍕 crust: thin')).toBeTruthy();
  });
});
```
No drilling down 50 levels deep to find the dropdown row or simulating any click events.  
Just call `onItemSelected`. That’s the beauty of loosely-coupled components.  
_Simple_. 🍻

## API
`withPropsHistory(ComponentType) => ComponentType & {propsHistory: Props[]}`  
Takes an optional input component, returns an enhanced component type with a `propsHistory` array property.  
* The propsHistory array will be filled with the props after each render.
* You can trigger functions passed in as props, i.e.  
`propsHistory[0].onItemSelected(1, '2', {three: 4})` is equivalent to calling  
`prop.onItemSelected(1, '2', {three: 4})` from inside the input component.

## Scripts
### `npm run build`
Runs babel and copies TypeScript definitions to `/lib`.  

### `npm test`
Runs [relevant](https://jestjs.io/docs/en/cli#watch) unit tests.  

### `npm run test:ci`
Runs all unit tests and saves the result in JUnit format.  

## Continuous Integration (CI)
All commits are tested ✅  
TODO: automatically `npm publish` if all tests pass.  
View the Azure Pipeline project: https://dev.azure.com/chuihinwai/react-dispatchable

## Dependencies
None, other than `react`
