import { Component, ErrorInfo, ReactNode } from 'react';
import { GlassCard } from './GlassCard';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#020617] text-slate-200 flex items-center justify-center p-6">
          <GlassCard className="max-w-md w-full p-8">
            <div className="text-center space-y-4">
              <div className="text-5xl">⚠️</div>
              <h2 className="text-2xl font-bold text-white">
                Something went wrong
              </h2>
              <p className="text-slate-400 text-sm">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
              <button
                type="button"
                onClick={this.handleReset}
                className="mt-6 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-xl text-white font-medium transition-colors"
              >
                Reload Application
              </button>
            </div>
          </GlassCard>
        </div>
      );
    }

    return this.props.children;
  }
}
