import React, { useState } from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

const ErrorBoundary: React.FunctionComponent<Props> = ({ children }) => {
  const [state, setState] = useState<State>({ hasError: false });

  const componentDidCatch = (error: Error, errorInfo: React.ErrorInfo): void => {
    console.error('Error caught in ErrorBoundary:', error, errorInfo.componentStack);
    setState({ hasError: true });
  };

  if (state.hasError) {
    return <h1>Something went wrong.</h1>;
  }

  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  );
};

export default ErrorBoundary;