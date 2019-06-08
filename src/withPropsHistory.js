import React from 'react';

const withPropsHistory = (Comp = () => <></>) => {
  const history = [];
  const WithHistory = (props) => {
    history.push(props);
    return <Comp {...props} />;
  };
  WithHistory.propsHistory = history;
  return WithHistory;
};

export default withPropsHistory;
