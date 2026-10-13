import { Component } from "react";
import { Link } from "react-router-dom";

// Catches render-time errors anywhere below it so one broken component
// can't take the whole app down to a blank white screen.
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 px-6 text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Something went wrong
          </h1>
          <p className="text-slate-500 max-w-md">
            An unexpected error occurred. Try reloading — if the problem
            continues, please come back in a moment.
          </p>
          <Link
            to="/"
            onClick={() => this.setState({ hasError: false })}
            className="inline-flex items-center gap-2 bg-primary-600 text-white font-semibold rounded-full px-6 py-3 hover:bg-primary-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;