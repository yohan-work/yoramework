// reconciler.js
// Implements the reconciliation algorithm for efficient DOM updates

/**
 * Updates an existing DOM element by comparing old and new Virtual DOM nodes
 * @param {HTMLElement} parentElement - Parent DOM element
 * @param {object} oldVNode - Old Virtual DOM node
 * @param {object} newVNode - New Virtual DOM node
 * @param {number} index - Index of the node in parent's children
 */
export function reconcile(parentElement, oldVNode, newVNode, index = 0) {
  // Case 1: New node added
  if (!oldVNode && newVNode) {
    const newElement = createDOMElement(newVNode);
    if (newElement) {
      parentElement.appendChild(newElement);
    }
    return;
  }
  
  // Case 2: Node removed
  if (oldVNode && !newVNode) {
    parentElement.removeChild(parentElement.childNodes[index]);
    return;
  }
  
  // Case 3: Node replaced (different type)
  if (hasTypeChanged(oldVNode, newVNode)) {
    const newElement = createDOMElement(newVNode);
    if (newElement) {
      parentElement.replaceChild(newElement, parentElement.childNodes[index]);
    }
    return;
  }
  
  // Case 4: Text node changed
  if (newVNode.type === 'TEXT_NODE') {
    if (oldVNode.text !== newVNode.text) {
      parentElement.childNodes[index].textContent = newVNode.text;
    }
    return;
  }
  
  // Case 5: Same type - update props and reconcile children
  const element = parentElement.childNodes[index];
  
  if (element && element.nodeType === 1) { // Element node
    updateProps(element, oldVNode.props || {}, newVNode.props || {});
    reconcileChildren(element, oldVNode.children || [], newVNode.children || []);
  }
}

/**
 * Reconciles children of a node
 * @param {HTMLElement} parentElement - Parent DOM element
 * @param {array} oldChildren - Old children Virtual DOM nodes
 * @param {array} newChildren - New children Virtual DOM nodes
 */
function reconcileChildren(parentElement, oldChildren, newChildren) {
  const maxLength = Math.max(oldChildren.length, newChildren.length);
  
  for (let i = 0; i < maxLength; i++) {
    reconcile(parentElement, oldChildren[i], newChildren[i], i);
  }
}

/**
 * Checks if the type of a Virtual DOM node has changed
 * @param {object} oldVNode - Old Virtual DOM node
 * @param {object} newVNode - New Virtual DOM node
 * @returns {boolean} True if type has changed
 */
function hasTypeChanged(oldVNode, newVNode) {
  return typeof oldVNode.type !== typeof newVNode.type || 
         oldVNode.type !== newVNode.type;
}

/**
 * Updates props on a DOM element
 * @param {HTMLElement} element - DOM element
 * @param {object} oldProps - Old props
 * @param {object} newProps - New props
 */
function updateProps(element, oldProps, newProps) {
  // Remove old props
  Object.keys(oldProps).forEach(name => {
    if (!(name in newProps)) {
      removeProp(element, name, oldProps[name]);
    }
  });
  
  // Set new or changed props
  Object.keys(newProps).forEach(name => {
    if (oldProps[name] !== newProps[name]) {
      setProp(element, name, newProps[name], oldProps[name]);
    }
  });
}

/**
 * Sets a property on a DOM element
 * @param {HTMLElement} element - DOM element
 * @param {string} name - Property name
 * @param {any} value - New property value
 * @param {any} oldValue - Old property value (for cleanup)
 */
function setProp(element, name, value, oldValue) {
  if (name === 'className') {
    element.className = value;
  } else if (name === 'style' && typeof value === 'object') {
    // Clear old styles if needed
    if (typeof oldValue === 'object') {
      Object.keys(oldValue).forEach(key => {
        if (!(key in value)) {
          element.style[key] = '';
        }
      });
    }
    Object.assign(element.style, value);
  } else if (name.startsWith('on')) {
    // Event handler
    const eventType = name.substring(2).toLowerCase();
    
    // Remove old listener
    if (oldValue) {
      element.removeEventListener(eventType, oldValue);
    }
    
    // Add new listener
    if (value) {
      element.addEventListener(eventType, value);
    }
  } else if (name === 'key' || name === 'ref') {
    // Special props - handled separately
    return;
  } else if (name === 'value' || name === 'checked') {
    // Form element properties
    element[name] = value;
  } else {
    // Regular attribute
    element.setAttribute(name, value);
  }
}

/**
 * Removes a property from a DOM element
 * @param {HTMLElement} element - DOM element
 * @param {string} name - Property name
 * @param {any} value - Property value
 */
function removeProp(element, name, value) {
  if (name === 'className') {
    element.className = '';
  } else if (name === 'style') {
    element.style.cssText = '';
  } else if (name.startsWith('on')) {
    const eventType = name.substring(2).toLowerCase();
    element.removeEventListener(eventType, value);
  } else if (name === 'key' || name === 'ref') {
    // Special props - no removal needed
    return;
  } else {
    element.removeAttribute(name);
  }
}

/**
 * Creates a DOM element from a Virtual DOM node
 * This is imported/used from render.js logic
 */
function createDOMElement(vnode) {
  if (!vnode) {
    return null;
  }
  
  // Handle text nodes
  if (vnode.type === 'TEXT_NODE') {
    return document.createTextNode(vnode.text || '');
  }
  
  // Handle component functions
  if (typeof vnode.type === 'function') {
    const componentVNode = vnode.type(vnode.props);
    return createDOMElement(componentVNode);
  }
  
  // Handle Fragment
  if (vnode.type === 'FRAGMENT') {
    const fragment = document.createDocumentFragment();
    vnode.children.forEach(child => {
      const childElement = createDOMElement(child);
      if (childElement) {
        fragment.appendChild(childElement);
      }
    });
    return fragment;
  }
  
  // Create regular DOM element
  const element = document.createElement(vnode.type);
  
  // Set properties
  Object.keys(vnode.props || {}).forEach(key => {
    setProp(element, key, vnode.props[key]);
  });
  
  // Recursively create children
  if (vnode.children) {
    vnode.children.forEach(child => {
      const childElement = createDOMElement(child);
      if (childElement) {
        element.appendChild(childElement);
      }
    });
  }
  
  return element;
}

