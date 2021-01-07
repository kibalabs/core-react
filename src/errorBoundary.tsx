import React from 'react';

interface IErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  info: React.ErrorInfo | null;
}

export interface IErrorBoundaryProps {
}

const errorStyle = {
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column' as const,
  color: 'rgb(69, 69, 69)',
};

const errorMessageStyle = {
  textAlign: 'center' as const,
  margin: '1em',
  lineHeight: '1.5em',
};

const resetButtonStyle = {
  border: '1px solid currentColor',
  padding: '4px 8px',
  borderRadius: '2px',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#efefef',
  },
  '&:active': {
    backgroundColor: '#dfdfdf',
  },
};

export class ErrorBoundary extends React.Component<IErrorBoundaryProps, IErrorBoundaryState> {
  public constructor(props: IErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      info: null,
    };
  }

  public componentDidCatch(error: Error, info: React.ErrorInfo): void {
    this.setState({ hasError: true, error, info });
  }

  public reset = (): void => {
    this.setState({ hasError: false, error: null, info: null });
  }

  public render(): React.ReactElement {
    if (this.state.hasError) {
      return (
        <div style={errorStyle}>
          <div style={errorMessageStyle}>
            <strong>Ooops 🤦‍♂️</strong>
            <br />
            <strong>Something is not right here. Check the error below or hit us up for help</strong>
            <br />
            <br />
            {this.state.error && String(this.state.error)}
            {this.state.info && this.state.info.componentStack.split('\n').slice(0, 10).map((message: string, index: number): React.ReactElement => (
              <span key={index}>
                {message}
                <br />
              </span>
            ))}
            <br />
            <button style={resetButtonStyle} onClick={this.reset}>Reset</button>
          </div>
        </div>
      );
    }
    return <React.StrictMode>{this.props.children}</React.StrictMode>;
  }
}
