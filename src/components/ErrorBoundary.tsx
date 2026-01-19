import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
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
                <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border-2 border-red-100">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-10 h-10 text-red-500" />
                        </div>
                        <h1 className="text-2xl font-black text-gray-900 mb-2">Oups ! Une erreur est survenue</h1>
                        <p className="text-gray-600 mb-6 font-medium">
                            Quelque chose s'est mal passé lors du chargement de l'application.
                        </p>
                        <div className="bg-gray-100 p-4 rounded-xl text-left mb-6 overflow-auto max-h-40">
                            <p className="text-xs font-mono text-red-600 break-all">
                                {this.state.error && this.state.error.toString()}
                            </p>
                        </div>
                        <div className="flex gap-3 justify-center">
                            <Button
                                onClick={() => window.location.reload()}
                                className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl px-6"
                            >
                                Rafraîchir la page
                            </Button>
                            <Button
                                onClick={() => window.location.href = '/'}
                                variant="outline"
                                className="border-2 border-gray-200 hover:bg-gray-50 font-bold rounded-xl"
                            >
                                Retour à l'accueil
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
