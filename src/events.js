// events.js
// Implements synthetic event system with event delegation

// Map of event types to their delegated handlers
const eventRegistry = new Map();

// Supported event types
const supportedEvents = [
  'click',
  'dblclick',
  'mousedown',
  'mouseup',
  'mousemove',
  'mouseenter',
  'mouseleave',
  'keydown',
  'keyup',
  'keypress',
  'change',
  'input',
  'submit',
  'focus',
  'blur',
];

/**
 * Initializes event delegation for a root container
 * This sets up event listeners at the root level for better performance
 * @param {HTMLElement} rootContainer - Root DOM container
 */
export function initEventDelegation(rootContainer) {
  if (eventRegistry.has(rootContainer)) {
    return; // Already initialized
  }
  
  const handlers = {};
  
  // Set up delegated listeners for each supported event type
  supportedEvents.forEach(eventType => {
    const handler = createDelegatedHandler(eventType);
    rootContainer.addEventListener(eventType, handler);
    handlers[eventType] = handler;
  });
  
  eventRegistry.set(rootContainer, handlers);
}

/**
 * Creates a delegated event handler for a specific event type
 * @param {string} eventType - Event type (e.g., 'click')
 * @returns {function} Event handler function
 */
function createDelegatedHandler(eventType) {
  return function(nativeEvent) {
    const target = nativeEvent.target;
    
    // Create synthetic event
    const syntheticEvent = createSyntheticEvent(nativeEvent);
    
    // Walk up the DOM tree to find handlers
    let currentTarget = target;
    
    while (currentTarget && currentTarget !== this) {
      const handler = getEventHandler(currentTarget, eventType);
      
      if (handler) {
        // Call the handler with synthetic event
        handler.call(currentTarget, syntheticEvent);
        
        // Check if propagation was stopped
        if (syntheticEvent._stopPropagation) {
          break;
        }
      }
      
      currentTarget = currentTarget.parentNode;
    }
  };
}

/**
 * Creates a synthetic event object that wraps the native event
 * @param {Event} nativeEvent - Native DOM event
 * @returns {object} Synthetic event
 */
function createSyntheticEvent(nativeEvent) {
  const syntheticEvent = {
    nativeEvent,
    type: nativeEvent.type,
    target: nativeEvent.target,
    currentTarget: nativeEvent.currentTarget,
    
    // Event data
    bubbles: nativeEvent.bubbles,
    cancelable: nativeEvent.cancelable,
    defaultPrevented: nativeEvent.defaultPrevented,
    
    // Mouse events
    clientX: nativeEvent.clientX,
    clientY: nativeEvent.clientY,
    pageX: nativeEvent.pageX,
    pageY: nativeEvent.pageY,
    screenX: nativeEvent.screenX,
    screenY: nativeEvent.screenY,
    
    // Keyboard events
    key: nativeEvent.key,
    keyCode: nativeEvent.keyCode,
    charCode: nativeEvent.charCode,
    
    // Form events
    value: nativeEvent.target?.value,
    checked: nativeEvent.target?.checked,
    
    // Modifiers
    altKey: nativeEvent.altKey,
    ctrlKey: nativeEvent.ctrlKey,
    metaKey: nativeEvent.metaKey,
    shiftKey: nativeEvent.shiftKey,
    
    // Internal flags
    _stopPropagation: false,
    _preventDefault: false,
    
    // Methods
    preventDefault() {
      this._preventDefault = true;
      nativeEvent.preventDefault();
    },
    
    stopPropagation() {
      this._stopPropagation = true;
      nativeEvent.stopPropagation();
    },
    
    persist() {
      // In React, this prevents event pooling
      // We don't pool events, so this is a no-op
    },
  };
  
  return syntheticEvent;
}

/**
 * Gets an event handler attached to a DOM element
 * @param {HTMLElement} element - DOM element
 * @param {string} eventType - Event type
 * @returns {function|null} Event handler or null
 */
function getEventHandler(element, eventType) {
  // Event handlers are stored as properties on the element
  const propName = `__${eventType}Handler`;
  return element[propName] || null;
}

/**
 * Attaches an event handler to a DOM element
 * This stores the handler on the element for retrieval during event delegation
 * @param {HTMLElement} element - DOM element
 * @param {string} eventType - Event type (e.g., 'click')
 * @param {function} handler - Event handler function
 */
export function attachEventHandler(element, eventType, handler) {
  const propName = `__${eventType}Handler`;
  element[propName] = handler;
}

/**
 * Removes an event handler from a DOM element
 * @param {HTMLElement} element - DOM element
 * @param {string} eventType - Event type
 */
export function removeEventHandler(element, eventType) {
  const propName = `__${eventType}Handler`;
  delete element[propName];
}

/**
 * Processes event props and attaches handlers
 * This is called when creating/updating DOM elements
 * @param {HTMLElement} element - DOM element
 * @param {object} props - Element props
 */
export function processEventProps(element, props) {
  Object.keys(props).forEach(propName => {
    if (propName.startsWith('on') && typeof props[propName] === 'function') {
      const eventType = propName.substring(2).toLowerCase();
      
      if (supportedEvents.includes(eventType)) {
        attachEventHandler(element, eventType, props[propName]);
      }
    }
  });
}

/**
 * Cleans up event handlers when removing an element
 * @param {HTMLElement} element - DOM element
 */
export function cleanupEventHandlers(element) {
  supportedEvents.forEach(eventType => {
    removeEventHandler(element, eventType);
  });
}

