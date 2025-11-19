// context.js
// Implements React-like Context API for prop drilling avoidance

import { getCurrentComponent, getNextHookIndex } from './component.js';

/**
 * Creates a new Context object
 * @param {any} defaultValue - Default context value
 * @returns {object} Context object with Provider and Consumer
 */
export function createContext(defaultValue) {
  const context = {
    _currentValue: defaultValue,
    _defaultValue: defaultValue,
    _subscribers: new Set(),
    
    Provider: function Provider(props) {
      const { value, children } = props;
      
      // Update current value
      context._currentValue = value;
      
      // Return children
      return children;
    },
    
    Consumer: function Consumer(props) {
      const { children } = props;
      
      // Get current context value
      const value = context._currentValue;
      
      // Call children as a function with the value
      return children(value);
    },
  };
  
  return context;
}

/**
 * useContext Hook
 * Subscribes to context changes and returns the current context value
 * @param {object} context - Context object created by createContext
 * @returns {any} Current context value
 */
export function useContext(context) {
  const component = getCurrentComponent();
  
  if (!component) {
    throw new Error('useContext must be called inside a component');
  }
  
  const hookIndex = getNextHookIndex();
  
  // Initialize hook state if it doesn't exist
  if (component.hooks[hookIndex] === undefined) {
    component.hooks[hookIndex] = {
      type: 'useContext',
      context,
      value: context._currentValue,
    };
    
    // Subscribe to context changes
    context._subscribers.add(component);
  }
  
  const hook = component.hooks[hookIndex];
  
  // Return current context value
  return context._currentValue;
}

/**
 * Updates all components subscribed to a context
 * This is called when a Provider's value changes
 * @param {object} context - Context object
 */
export function notifyContextSubscribers(context) {
  const { reRenderComponent } = require('./component.js');
  
  context._subscribers.forEach(component => {
    reRenderComponent(component);
  });
}

