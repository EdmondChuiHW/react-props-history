# react-dispatchable
[![Build Status](https://dev.azure.com/chuihinwai/react-dispatchable/_apis/build/status/chuihinwai.react-dispatchable?branchName=master)](https://dev.azure.com/chuihinwai/react-dispatchable/_build/latest?definitionId=3&branchName=master)
[![npm version](https://badge.fury.io/js/react-dispatchable.svg)](https://badge.fury.io/js/react-dispatchable)
![David](https://img.shields.io/david/chuihinwai/react-dispatchable.svg)
![David](https://img.shields.io/david/dev/chuihinwai/react-dispatchable.svg)

`npm i react-dispatchable -D`

## Example
Consider this dummy `PizzaPicker`:
```
import React, {useState} from 'react';
import Dropdown from "…";

const PizzaPicker = props => {
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
To test that the correct crust is drawn on screen after an item from `Dropdown` has been selected, you might be tempted to mock away Dropdown, or use some selectors to drill down the DOM tree, find the dropdown, simulate a click event, find the curst item, simulate a click event, etc. 😨

A well-composed component should be loosely-coupled. Let's make `PizzaPicker` take a `Dropdown` prop instead:
```
import DefaultDropdown from "…";

const PizzaPicker = ({Dropdown = DefaultDropdown}) => {
  …
  return <>
    <div>{status}</div>
    <Dropdown
      onItemSelected={setCrustType}
    />
  </>;
};
```
It works exactly the same way as before, except we now allow `Dropdown` to be optionally passed in, while maintaining the simple syntax `<PizzaPicker/>` by default.

In our test, we can now pass in a special `Dropdown` that lets us trigger `onItemSelected` at will:
```
import makeDispatchable from 'react-dispatchable';
import {render} from 'react-testing-library';
import {act} from 'react-dom/test-utils';

describe('SearchBar', () => {
  it('updates text on ClearButton click', () => {
    const [dispatch, TestDropdown] = makeDispatchable();  // or pass an actual Dropdown: makeDispatchable(Dropdown)
    const {queryByText} = render(<PizzaPicker Dropdown={TestDropdown}/>);
    expect(queryByText('Hungry')).toBeTruthy();

    act(() => dispatch('onItemSelected', 'thin'));

    expect(queryByText('Selected 🍕 crust: thin')).toBeTruthy();
  });
});
```
No drilling down 50 levels deep to find the dropdown or its items or simulating any touch events.  
Just call the `onItemSelected` prop. Simple. 🍻

## API
`makeDispatchable(Component)`
Takes an optional input component, returns a dispatch function and an enhanced component.  
* The dispatch function can be called with the prop key from the input component and pass along remaining arguments, i.e.  
`dispatch('onItemSelected', 1, '2', {three: 4})` is equivalent to calling  
`onItemSelected(1, '2', {three: 4})` from inside the input component.
* The enhanced component should not be rendered more than once. The dispatch function only sends events to the last rendered enhanced component. [See spec](./src/dispatchable.test.js#L69)

## Dependencies
None, other than `react`

## Scripts
### `npm test`
Runs [relevant](https://jestjs.io/docs/en/cli#watch) unit tests. 

### `npm run test:ci`
Runs all unit tests and saves the result in JUnit format.

## Continuous Integration (CI)
All commits are tested ✅.  
TODO: continuous `npm publish` if all tests pass.  
View the Azure Pipeline project: https://dev.azure.com/chuihinwai/react-dispatchable
