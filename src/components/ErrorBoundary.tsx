import { Component, type ReactNode } from 'react';

/** Shows the error on screen instead of a blank page, which makes problems on the live site easy to report. */
export default class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (!this.state.error) return this.props.children;
    return <main><section className="head"><h1>Something went wrong</h1><p>{this.state.error.message}</p><p><a href="/">Back to all tools</a></p></section></main>;
  }
}
