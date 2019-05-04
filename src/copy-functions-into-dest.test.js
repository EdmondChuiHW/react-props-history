import copyFunctionsIntoDest from './copy-functions-into-dest';

describe('copyFunctionsIntoDest', () => {
  it('copies single function from source to dest', () => {
    const onClick = () => {};
    const source = {onClick};
    const dest = {};
    copyFunctionsIntoDest(source, dest);

    const actual = dest;
    const expected = {onClick};
    expect(actual).toEqual(expected);
  });

  it('copies single function preserving other props in dest', () => {
    const onClick = () => {};
    const source = {onClick};
    const dest = {text: 'some'};
    copyFunctionsIntoDest(source, dest);

    const actual = dest;
    const expected = {onClick, text: 'some'};
    expect(actual).toEqual(expected);
  });

  it('copies single function omitting non-function props in source', () => {
    const onClick = () => {};
    const source = {onClick, irrelevant: 'string'};
    const dest = {};
    copyFunctionsIntoDest(source, dest);

    const actual = dest;
    const expected = {onClick};
    expect(actual).toEqual(expected);
  });

  it('copies all functions from source to dest', () => {
    const onClick = () => {};
    const onTap = () => {};
    const source = {onClick, onTap};
    const dest = {};
    copyFunctionsIntoDest(source, dest);

    const actual = dest;
    const expected = {onClick, onTap};
    expect(actual).toEqual(expected);
  });

  it('returns copy of dest when source is empty', () => {
    const source = {};
    const dest = {that: 'thing'};
    copyFunctionsIntoDest(source, dest);

    const actual = dest;
    const expected = {that: 'thing'};
    expect(actual).toEqual(expected);
  });

  it('returns copy of dest when source is undefined', () => {
    const source = undefined;
    const dest = {that: 'thing'};
    copyFunctionsIntoDest(source, dest);

    const actual = dest;
    const expected = {that: 'thing'};
    expect(actual).toEqual(expected);
  });

  it('returns copy of dest when source is null', () => {
    const source = null;
    const dest = {that: 'thing'};
    copyFunctionsIntoDest(source, dest);

    const actual = dest;
    const expected = {that: 'thing'};
    expect(actual).toEqual(expected);
  });
});
