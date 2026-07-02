import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('React error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.error) {
      return (
        <main className="min-h-screen bg-white text-[#111827] flex items-center justify-center px-6">
          <section className="max-w-md text-center">
            <h1 className="text-2xl font-semibold mb-3">Something went wrong</h1>
            <p className="text-sm text-[#4b5563] mb-5">
              Please refresh the page. If the problem continues, contact SAPI support.
            </p>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded bg-[#111827] px-4 py-2 text-sm font-medium text-white"
              onClick={() => window.location.reload()}
            >
              Refresh
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
