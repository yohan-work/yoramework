// createElement.js
// Converts JSX into Virtual DOM objects

/**
 * Creates a Virtual DOM node
 * @param {string|function} type - HTML tag name or component function
 * @param {object} props - Properties and attributes
 * @param {...any} children - Child nodes
 * @returns {object} Virtual DOM node
 */
export function createElement(type, props, ...children) {
  // Flatten and filter children
  const flattenedChildren = flattenChildren(children);
  
  return {
    type,
    props: props || {},
    children: flattenedChildren,
  };
}

/**
 * Flattens nested children arrays and filters out null/undefined
 * Converts primitives (string, number, boolean) to text nodes
 */
function flattenChildren(children) {
  const result = [];
  
  for (let child of children) {
    if (child == null || child === false || child === true) {
      // Skip null, undefined, false, true
      continue;
    }
    
    if (Array.isArray(child)) {
      // Recursively flatten arrays
      result.push(...flattenChildren(child));
    } else if (typeof child === 'object') {
      // Already a vnode
      result.push(child);
    } else {
      // Primitive value (string, number)
      result.push(createTextNode(String(child)));
    }
  }
  
  return result;
}

/**
 * Creates a text node vnode
 */
function createTextNode(text) {
  return {
    type: 'TEXT_NODE',
    props: {},
    children: [],
    text,
  };
}

