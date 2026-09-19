"use client";

import { RotateCw } from "lucide-react";
import { Component, type ErrorInfo, type ReactNode } from "react";

import { cn } from "@/lib/cn";

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Rendered when a child throws. Receives the error and a reset callback. */
  fallback?: (error: Error, reset: () => void) => ReactNode;
  /** Optional side-effect on catch (logging, telemetry). */
  onError?: (error: Error, info: ErrorInfo) => void;
  /**
   * When any value in this array changes, the boundary auto-resets. Pass props
   * the subtree depends on so recovery is automatic once inputs change.
   */
  resetKeys?: unknown[];
  /**
   * Message shown by the default fallback. English by default — a published
   * library cannot reach an app's translation function, so localized copy
   * arrives from the call site.
   * @defaultValue `"Something went wrong rendering this view."`
   */
  message?: string;
  /**
   * Label on the default fallback's retry button.
   * @defaultValue `"Retry"`
   */
  retryLabel?: string;
  /**
   * Base for derived test ids. The fallback root becomes
   * `${testId}-error-fallback` and the retry button `${testId}-retry-button`.
   * Omit it and neither node gets an id.
   */
  "data-testid"?: string;
  /** Extra classes merged onto the default fallback's root. */
  className?: string;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Catches render-phase errors in its subtree so one broken widget can't take
 * the whole view down with it.
 *
 * A class component, unlike everything else in this library: React exposes no
 * hook equivalent of `getDerivedStateFromError`, so an error boundary has no
 * function form.
 *
 * **It does not catch async, event-handler or rAF errors** — React never routes
 * those through a boundary. Those need a window-level handler, which belongs in
 * the app, not here: which async failures are benign is an application
 * question, and a library that silently swallowed them would be hiding real
 * bugs from consumers who never asked it to.
 *
 * @param props.fallback - Full replacement for the default fallback UI. Gets
 *   the error and a `reset` callback; render whatever the surrounding surface
 *   needs. When given, `message`, `retryLabel` and `className` are unused.
 * @param props.onError - Side effect on catch — logging or telemetry.
 * @param props.resetKeys - Values that, when changed, clear the error. Pass the
 *   props the subtree depends on so recovery happens on its own once the inputs
 *   that broke it change.
 * @param props.message - Copy for the default fallback.
 * @param props.retryLabel - Label for the default fallback's retry button.
 *
 * @example
 * ```tsx
 * <ErrorBoundary resetKeys={[toolId]} onError={report}>
 *   <PreviewPane toolId={toolId} />
 * </ErrorBoundary>
 * ```
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info);
  }

  componentDidUpdate(prev: ErrorBoundaryProps) {
    if (!this.state.error) {
      return;
    }
    const a = prev.resetKeys;
    const b = this.props.resetKeys;
    if (a && b && (a.length !== b.length || a.some((v, i) => v !== b[i]))) {
      this.reset();
    }
  }

  reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (!error) {
      return this.props.children;
    }
    if (this.props.fallback) {
      return this.props.fallback(error, this.reset);
    }

    const {
      message = "Something went wrong rendering this view.",
      retryLabel = "Retry",
      className,
    } = this.props;
    const testId = this.props["data-testid"];

    return (
      <div
        data-slot="error-boundary-fallback"
        data-testid={testId ? `${testId}-error-fallback` : undefined}
        role="alert"
        className={cn(
          "flex flex-col items-center justify-center gap-2 p-4 text-center text-xs text-app-dim",
          className,
        )}
      >
        <span>{message}</span>
        <button
          type="button"
          onClick={this.reset}
          data-slot="error-boundary-retry"
          data-testid={testId ? `${testId}-retry-button` : undefined}
          className="inline-flex items-center gap-1.5 rounded-md border border-app-border px-2 py-1 font-medium hover:bg-app-hover focus-visible:ring-2 focus-visible:ring-app-accent focus-visible:outline-none"
        >
          <RotateCw size={12} aria-hidden /> {retryLabel}
        </button>
      </div>
    );
  }
}

export { ErrorBoundary, type ErrorBoundaryProps };
