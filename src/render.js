// render.js
// Renders Virtual DOM to actual DOM

import { initEventDelegation } from './events.js';

/**
 * Renders a Virtual DOM node into a container
 * @param {object} vnode - Virtual DOM node
 * @param {HTMLElement} container - DOM container element
 */
export function render(vnode, container) {
  // Initialize event delegation for this container
  initEventDelegation(container);
  
  // Clear the container
  container.innerHTML = '';
  
  // Create the actual DOM element
  const domElement = createDOMElement(vnode);
  
  if (domElement) {
    container.appendChild(domElement);
  }
}

/**
 * Creates an actual DOM element from a Virtual DOM node
 * @param {object} vnode - Virtual DOM node
 * @returns {HTMLElement|Text} DOM element or text node
 */
export function createDOMElement(vnode) {
  if (!vnode) {
    return null;
  }
  
  // Handle text nodes
  if (vnode.type === 'TEXT_NODE') {
    return document.createTextNode(vnode.text || '');
  }
  
  // Handle component functions
  if (typeof vnode.type === 'function') {
    const { renderComponent, registerComponentInstance, getComponentInstance } = 
      require('./component.js');
    
    const instance = getComponentInstance(vnode.type, vnode.props);
    const componentVNode = instance.render();
    const element = createDOMElement(componentVNode);
    
    // Register the instance with its DOM element
    if (element) {
      registerComponentInstance(vnode.type, element, instance);
    }
    
    return element;
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
  
  // Set properties and attributes
  setProps(element, vnode.props);
  
  // Recursively create and append children
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

/**
 * Sets properties and attributes on a DOM element
 * @param {HTMLElement} element - DOM element
 * @param {object} props - Properties to set
 */
function setProps(element, props) {
  Object.keys(props).forEach(key => {
    setProp(element, key, props[key]);
  });
}

/**
 * Sets a single property on a DOM element
 * @param {HTMLElement} element - DOM element
 * @param {string} name - Property name
 * @param {any} value - Property value
 */
function setProp(element, name, value) {
  if (name === 'className') {
    element.className = value;
  } else if (name === 'style' && typeof value === 'object') {
    Object.assign(element.style, value);
  } else if (name.startsWith('on')) {
    // Event handler - use event delegation system
    const { attachEventHandler } = require('./events.js');
    const eventType = name.substring(2).toLowerCase();
    attachEventHandler(element, eventType, value);
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

