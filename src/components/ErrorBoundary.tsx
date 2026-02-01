import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
                    <h1 className="text-3xl font-bold text-red-500 mb-4">Bir Sorun Oluştu</h1>
                    <p className="text-slate-300 mb-4">Uygulama yüklenirken bir hata meydana geldi.</p>
                    <div className="bg-black/50 p-4 rounded-lg overflow-auto max-w-full text-left font-mono text-sm text-red-400 border border-red-900/50">
                        {this.state.error?.toString()}
                    </div>
                    <button
                        onClick={() => {
                            localStorage.clear();
                            window.location.reload();
                        }}
                        className="mt-6 px-6 py-3 bg-teal-600 hover:bg-teal-700 rounded-xl text-white font-medium transition-colors"
                    >
                        Önbelleği Temizle ve Yenile
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
