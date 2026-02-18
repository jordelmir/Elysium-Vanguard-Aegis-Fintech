
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
    children: ReactNode;
    fallbackTitle?: string;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

/**
 * React Error Boundary — Catches runtime errors in child component trees
 * and renders an Aegis-styled recovery UI instead of crashing the entire app.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        this.setState({ errorInfo });
        // Log to telemetry service if available
        try {
            fetch('http://localhost:8081/api/telemetry/error', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: error.message,
                    stack: error.stack,
                    componentStack: errorInfo.componentStack,
                    timestamp: new Date().toISOString(),
                }),
            }).catch(() => { /* Telemetry unavailable — silent fail */ });
        } catch {
            // Telemetry service unreachable — no-op
        }
    }

    handleRecover = (): void => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render(): ReactNode {
        if (this.state.hasError) {
            return (
                <div className="min-h-[400px] flex items-center justify-center p-8">
                    <div className="glass rounded-[3rem] p-10 md:p-16 max-w-xl w-full text-center border border-red-500/20 bg-red-950/10">
                        {/* Pulse indicator */}
                        <div className="w-16 h-16 mx-auto mb-8 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_20px_#ef4444]"></div>
                        </div>

                        <h2 className="text-[11px] font-black text-red-500 uppercase tracking-[0.4em] mb-4 font-mono">
                            {this.props.fallbackTitle || 'SUBSYSTEM_FAULT'}
                        </h2>

                        <p className="text-slate-500 text-sm font-mono mb-2">
                            A runtime exception was intercepted by the error boundary.
                        </p>

                        {this.state.error && (
                            <div className="mt-6 mb-8 p-4 bg-black/40 rounded-2xl border border-white/5 text-left overflow-auto max-h-32">
                                <code className="text-[10px] font-mono text-red-400 leading-relaxed break-all">
                                    {this.state.error.message}
                                </code>
                            </div>
                        )}

                        <button
                            onClick={this.handleRecover}
                            className="px-10 py-4 rounded-2xl bg-white text-black text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
                        >
                            ⟳ Attempt Recovery
                        </button>

                        <p className="text-[9px] font-mono text-slate-800 mt-6 uppercase tracking-widest">
                            Error logged to telemetry pipeline
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
