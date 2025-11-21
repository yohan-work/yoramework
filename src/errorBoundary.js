// errorBoundary.js
// Implements Error Boundaries for catching and handling component errors

import { useState, useEffect } from './hooks.js';
import { createElement } from './createElement.js';

/**
 * ErrorBoundary Component
 * Catches JavaScript errors in child components and displays a fallback UI
 * 
 * @param {object} props - Component props
 * @param {any} props.children - Child components to wrap
 * @param {any} props.fallback - Fallback UI to show on error (can be a component or element)
 * @param {function} props.onError - Optional callback when error occurs (error, errorInfo) => void
 * @returns {object} Virtual DOM node
 */
export function ErrorBoundary(props) {
  const { children, fallback, onError } = props;
  const [error, setError] = useState(null);
  const [errorInfo, setErrorInfo] = useState(null);

  // Reset error when children change
  useEffect(() => {
    if (error) {
      setError(null);
      setErrorInfo(null);
    }
  }, [children]);

  // If there's an error, render fallback
  if (error) {
    // If fallback is a function, call it with error
    if (typeof fallback === 'function') {
      return fallback({ error, errorInfo, resetError: () => setError(null) });
    }
    
    // If fallback is provided, render it
    if (fallback) {
      return fallback;
    }
    
    // Default fallback UI
    return createElement(
      'div',
      {
        style: {
          padding: '20px',
          margin: '20px',
          border: '2px solid #ff6b6b',
          borderRadius: '8px',
          backgroundColor: '#ffe0e0',
          color: '#c92a2a',
          fontFamily: 'monospace',
        },
      },
      createElement('h2', { style: { margin: '0 0 10px 0' } }, '⚠️ Error Boundary'),
      createElement('p', { style: { margin: '0 0 10px 0' } }, 'Something went wrong:'),
      createElement('pre', { 
        style: { 
          margin: '0',
          padding: '10px',
          backgroundColor: '#fff',
          borderRadius: '4px',
          overflow: 'auto',
        } 
      }, error.toString()),
      errorInfo && createElement('details', { 
        style: { marginTop: '10px' } 
      },
        createElement('summary', { 
          style: { cursor: 'pointer', fontWeight: 'bold' } 
        }, 'Error Details'),
        createElement('pre', { 
          style: { 
            margin: '10px 0 0 0',
            padding: '10px',
            backgroundColor: '#fff',
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '12px',
          } 
        }, errorInfo.componentStack || 'No component stack available')
      ),
      createElement('button', {
        onClick: () => {
          setError(null);
          setErrorInfo(null);
        },
        style: {
          marginTop: '15px',
          padding: '8px 16px',
          backgroundColor: '#c92a2a',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold',
        },
      }, 'Try Again')
    );
  }

  // Wrap children in error catching wrapper
  return createElement(ErrorCatcher, { 
    onError: (err, info) => {
      setError(err);
      setErrorInfo(info);
      if (onError) {
        onError(err, info);
      }
    }
  }, children);
}

/**
 * ErrorCatcher Component
 * Internal component that wraps children and catches errors
 * This is used by ErrorBoundary to actually catch the errors
 */
function ErrorCatcher(props) {
  const { children, onError } = props;
  
  // Store error handler in component instance for access during render
  if (typeof window !== 'undefined') {
    // Store the error handler globally so component.js can access it
    window.__YORAMEWORK_ERROR_HANDLER__ = onError;
  }
  
  return children;
}

/**
 * withErrorBoundary HOC
 * Wraps a component with an ErrorBoundary
 * 
 * @param {function} Component - Component to wrap
 * @param {object} errorBoundaryProps - Props to pass to ErrorBoundary
 * @returns {function} Wrapped component
 */
export function withErrorBoundary(Component, errorBoundaryProps = {}) {
  return function WrappedWithErrorBoundary(props) {
    return createElement(
      ErrorBoundary,
      errorBoundaryProps,
      createElement(Component, props)
    );
  };
}

/**
 * useErrorHandler Hook
 * Allows function components to throw errors that will be caught by ErrorBoundary
 * 
 * @returns {function} Function to throw an error to nearest ErrorBoundary
 */
export function useErrorHandler() {
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);
  
  return setError;
}

