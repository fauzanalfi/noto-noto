import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '2rem',
            textAlign: 'center',
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-primary)',
          }}
        >
          <div style={{ maxWidth: '500px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                margin: '0 auto 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
              }}
            >
              ⚠️
            </div>
            <h2
              style={{
                fontSize: 'var(--font-size-xl)',
                fontWeight: '700',
                marginBottom: '0.75rem',
                color: 'var(--text-primary)',
              }}
            >
              Something went wrong
            </h2>
            <p
              style={{
                color: 'var(--text-secondary)',
                marginBottom: '0.5rem',
                lineHeight: '1.6',
                fontSize: 'var(--font-size-base)',
              }}
            >
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <details
              style={{
                marginBottom: '2rem',
                textAlign: 'left',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-md)',
                fontSize: 'var(--font-size-xs)',
                color: 'var(--text-tertiary)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              <summary style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}>
                Error details
              </summary>
              <pre style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {this.state.error?.stack || 'No stack trace available'}
              </pre>
            </details>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={this.handleReset}
                style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: 'var(--font-size-base)',
                  backgroundColor: 'var(--accent-primary)',
                  color: 'var(--text-on-accent)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                Reload Application
              </button>
              <button
                onClick={() => navigator.clipboard?.writeText(this.state.error?.stack || '')}
                style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: 'var(--font-size-base)',
                  backgroundColor: 'transparent',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                Copy Error
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
