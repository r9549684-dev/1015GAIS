import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center" style={{ backgroundColor: 'var(--tg-theme-bg-color)', color: 'var(--tg-theme-text-color)' }}>
            <h1 className="text-2xl font-bold mb-2">Что-то пошло не так.</h1>
            <p style={{ color: 'var(--tg-theme-hint-color)'}}>
                Мы уже работаем над исправлением. Пожалуйста, попробуйте перезагрузить приложение.
            </p>
            <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 rounded-lg font-semibold"
                style={{ backgroundColor: 'var(--tg-theme-button-color)', color: 'var(--tg-theme-button-text-color)' }}
            >
                Перезагрузить
            </button>
        </div>
      );
    }

    return this.props.children;
  }
}
