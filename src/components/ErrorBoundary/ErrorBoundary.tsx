import React, { ErrorInfo, ReactNode } from 'react';
import { isDevOrTestNodeEnv } from '../../helpers/environment';

interface Props {
  children?: ReactNode;
}

interface State {
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * A component to encapsulate other components to catch errors
 * and avoid break the entire app, limiting error only for the children
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    // You can also log error messages to an error reporting service here
  }

  render() {
    if (this.state.errorInfo) {
      return (
        <div>
          <h2>Something went wrong. Try to reload the page.</h2>
          {isDevOrTestNodeEnv() && (
            <details style={{ whiteSpace: 'pre-wrap' }}>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo.componentStack}
            </details>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
