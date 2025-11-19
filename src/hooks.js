// hooks.js
// Placeholder - will be implemented in step 5

export function useState(initialValue) {
  // To be implemented
  return [initialValue, () => {}];
}

export function useEffect(callback, deps) {
  // To be implemented
}

export function useRef(initialValue) {
  // To be implemented
  return { current: initialValue };
}

export function useMemo(factory, deps) {
  // To be implemented
  return factory();
}

export function useCallback(callback, deps) {
  // To be implemented
  return callback;
}

