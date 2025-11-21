// hooks.js
// Implements React-like hooks for functional components

import {
  getCurrentComponent,
  getNextHookIndex,
  reRenderComponent,
} from "./component.js";

/**
 * useState Hook
 * Manages state in functional components
 * @param {any} initialValue - Initial state value
 * @returns {array} [state, setState] tuple
 */
export function useState(initialValue) {
  const component = getCurrentComponent();

  if (!component) {
    throw new Error("useState must be called inside a component");
  }

  const hookIndex = getNextHookIndex();

  // Initialize hook state if it doesn't exist
  if (component.hooks[hookIndex] === undefined) {
    component.hooks[hookIndex] = {
      type: "useState",
      state: typeof initialValue === "function" ? initialValue() : initialValue,
    };
  }

  const hook = component.hooks[hookIndex];

  // setState function
  const setState = (newValue) => {
    const nextState =
      typeof newValue === "function" ? newValue(hook.state) : newValue;

    // Only update if state actually changed
    if (nextState !== hook.state) {
      hook.state = nextState;

      // Schedule re-render
      scheduleReRender(component);
    }
  };

  return [hook.state, setState];
}

/**
 * useEffect Hook
 * Runs side effects in functional components
 * @param {function} callback - Effect callback
 * @param {array} deps - Dependency array
 */
export function useEffect(callback, deps) {
  const component = getCurrentComponent();

  if (!component) {
    throw new Error("useEffect must be called inside a component");
  }

  const hookIndex = getNextHookIndex();

  // Initialize hook state if it doesn't exist
  if (component.hooks[hookIndex] === undefined) {
    component.hooks[hookIndex] = {
      type: "useEffect",
      callback,
      deps,
      cleanup: null,
    };

    // Schedule effect to run after render
    scheduleEffect(component, hookIndex);
  } else {
    const hook = component.hooks[hookIndex];

    // Check if dependencies changed
    const depsChanged =
      !deps ||
      !hook.deps ||
      deps.length !== hook.deps.length ||
      deps.some((dep, i) => dep !== hook.deps[i]);

    if (depsChanged) {
      hook.callback = callback;
      hook.deps = deps;

      // Schedule effect to run after render
      scheduleEffect(component, hookIndex);
    }
  }
}

/**
 * useRef Hook
 * Creates a mutable ref object
 * @param {any} initialValue - Initial ref value
 * @returns {object} Ref object with 'current' property
 */
export function useRef(initialValue) {
  const component = getCurrentComponent();

  if (!component) {
    throw new Error("useRef must be called inside a component");
  }

  const hookIndex = getNextHookIndex();

  // Initialize hook state if it doesn't exist
  if (component.hooks[hookIndex] === undefined) {
    component.hooks[hookIndex] = {
      type: "useRef",
      ref: { current: initialValue },
    };
  }

  return component.hooks[hookIndex].ref;
}

/**
 * useMemo Hook
 * Memoizes a computed value
 * @param {function} factory - Function that returns the value to memoize
 * @param {array} deps - Dependency array
 * @returns {any} Memoized value
 */
export function useMemo(factory, deps) {
  const component = getCurrentComponent();

  if (!component) {
    throw new Error("useMemo must be called inside a component");
  }

  const hookIndex = getNextHookIndex();

  // Initialize hook state if it doesn't exist
  if (component.hooks[hookIndex] === undefined) {
    component.hooks[hookIndex] = {
      type: "useMemo",
      value: factory(),
      deps,
    };
  } else {
    const hook = component.hooks[hookIndex];

    // Check if dependencies changed
    const depsChanged =
      !deps ||
      !hook.deps ||
      deps.length !== hook.deps.length ||
      deps.some((dep, i) => dep !== hook.deps[i]);

    if (depsChanged) {
      hook.value = factory();
      hook.deps = deps;
    }
  }

  return component.hooks[hookIndex].value;
}

/**
 * useCallback Hook
 * Memoizes a callback function
 * @param {function} callback - Callback to memoize
 * @param {array} deps - Dependency array
 * @returns {function} Memoized callback
 */
export function useCallback(callback, deps) {
  return useMemo(() => callback, deps);
}

/**
 * useReducer Hook
 * Redux-style state management for components
 * @param {function} reducer - Reducer function (state, action) => newState
 * @param {any} initialState - Initial state value
 * @param {function} init - Optional lazy initialization function
 * @returns {array} [state, dispatch] tuple
 */
export function useReducer(reducer, initialState, init) {
  const component = getCurrentComponent();

  if (!component) {
    throw new Error("useReducer must be called inside a component");
  }

  const hookIndex = getNextHookIndex();

  // Initialize hook state if it doesn't exist
  if (component.hooks[hookIndex] === undefined) {
    const initializedState = init ? init(initialState) : initialState;

    component.hooks[hookIndex] = {
      type: "useReducer",
      state: initializedState,
      reducer,
    };
  }

  const hook = component.hooks[hookIndex];

  // Update reducer reference (in case it changes between renders)
  hook.reducer = reducer;

  // dispatch function
  const dispatch = (action) => {
    const nextState = hook.reducer(hook.state, action);

    // Only update if state actually changed
    if (nextState !== hook.state) {
      hook.state = nextState;

      // Schedule re-render
      scheduleReRender(component);
    }
  };

  return [hook.state, dispatch];
}

/**
 * Schedules a component re-render
 * Uses microtask queue for batching multiple state updates
 */
const reRenderQueue = new Set();
let isReRenderScheduled = false;

function scheduleReRender(component) {
  reRenderQueue.add(component);

  if (!isReRenderScheduled) {
    isReRenderScheduled = true;

    // Use microtask for batching
    queueMicrotask(() => {
      isReRenderScheduled = false;

      // Process all queued re-renders
      reRenderQueue.forEach((comp) => {
        reRenderComponent(comp);
      });

      reRenderQueue.clear();
    });
  }
}

/**
 * Schedules an effect to run after render
 */
function scheduleEffect(component, hookIndex) {
  const hook = component.hooks[hookIndex];

  // Add to component's effects queue
  if (!component.effects[hookIndex]) {
    component.effects[hookIndex] = {
      callback: null,
      cleanup: null,
      shouldRun: false,
    };
  }

  const effect = component.effects[hookIndex];
  effect.callback = hook.callback;
  effect.shouldRun = true;

  // Schedule effect to run after render completes
  queueMicrotask(() => {
    if (effect.shouldRun) {
      // Run cleanup first if it exists
      if (effect.cleanup) {
        effect.cleanup();
      }

      // Run the effect and store cleanup function
      const cleanup = effect.callback();
      if (typeof cleanup === "function") {
        effect.cleanup = cleanup;
      }

      effect.shouldRun = false;
    }
  });
}
