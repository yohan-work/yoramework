// component.js
// Manages functional components and their instances

// Global state for component management
let currentComponent = null;
let currentHookIndex = 0;

// Component instance storage
const componentInstances = new WeakMap();
let instanceIdCounter = 0;

/**
 * Component instance class
 * Stores component state, hooks, and metadata
 */
class ComponentInstance {
  constructor(component, props) {
    this.id = instanceIdCounter++;
    this.component = component; // The component function
    this.props = props;
    this.hooks = []; // Array to store hook states
    this.vnode = null; // Current rendered vnode
    this.domElement = null; // Reference to actual DOM element
    this.effects = []; // useEffect cleanup functions
  }

  /**
   * Renders the component and returns the vnode
   */
  render() {
    // Set this component as the current one
    currentComponent = this;
    currentHookIndex = 0;

    try {
      // Call the component function to get the vnode
      this.vnode = this.component(this.props);
      return this.vnode;
    } catch (error) {
      // Check if there's an error handler (from ErrorBoundary)
      if (typeof window !== 'undefined' && window.__YORAMEWORK_ERROR_HANDLER__) {
        const errorInfo = {
          componentStack: this.component.name || 'Anonymous Component',
        };
        window.__YORAMEWORK_ERROR_HANDLER__(error, errorInfo);
        
        // Return a placeholder to prevent further errors
        return {
          type: 'div',
          props: {},
          children: [],
        };
      }
      
      // If no error handler, re-throw
      throw error;
    } finally {
      // Reset current component
      currentComponent = null;
      currentHookIndex = 0;
    }
  }
}

/**
 * Gets or creates a component instance
 * @param {function} component - Component function
 * @param {object} props - Component props
 * @returns {ComponentInstance} Component instance
 */
export function getComponentInstance(component, props) {
  // For now, we create a simple key based on component function
  // In a real implementation, we'd use a more sophisticated keying system
  if (!componentInstances.has(component)) {
    componentInstances.set(component, new ComponentInstance(component, props));
  }

  const instance = componentInstances.get(component);
  instance.props = props; // Update props
  return instance;
}

/**
 * Gets the current rendering component instance
 * Used by hooks to access the current component's state
 * @returns {ComponentInstance|null}
 */
export function getCurrentComponent() {
  return currentComponent;
}

/**
 * Gets the current hook index and increments it
 * @returns {number} Current hook index
 */
export function getNextHookIndex() {
  return currentHookIndex++;
}

/**
 * Checks if a vnode represents a component
 * @param {object} vnode - Virtual DOM node
 * @returns {boolean}
 */
export function isComponent(vnode) {
  return vnode && typeof vnode.type === "function";
}

/**
 * Renders a component and returns its vnode
 * @param {function} component - Component function
 * @param {object} props - Component props
 * @returns {object} Rendered vnode
 */
export function renderComponent(component, props) {
  const instance = getComponentInstance(component, props);
  return instance.render();
}

/**
 * Re-renders a component instance
 * This is called when state changes (e.g., from setState)
 * @param {ComponentInstance} instance - Component instance to re-render
 */
export function reRenderComponent(instance) {
  if (!instance || !instance.domElement || !instance.domElement.parentNode) {
    return;
  }

  const parent = instance.domElement.parentNode;
  const oldVNode = instance.vnode;

  // Render new vnode
  const newVNode = instance.render();

  // Find the index of the current DOM element in its parent
  const childNodes = Array.from(parent.childNodes);
  const index = childNodes.indexOf(instance.domElement);

  // Use reconciliation to update the DOM
  // Import reconcile dynamically to avoid circular dependency
  const { reconcile } = require("./reconciler.js");
  reconcile(parent, oldVNode, newVNode, index);

  // Update the stored DOM element reference
  instance.domElement = parent.childNodes[index];

  // Run effects after render
  runEffects(instance);
}

/**
 * Runs pending effects for a component instance
 * @param {ComponentInstance} instance - Component instance
 */
function runEffects(instance) {
  instance.effects.forEach((effect) => {
    if (effect && effect.shouldRun) {
      // Run cleanup first if it exists
      if (effect.cleanup) {
        effect.cleanup();
      }

      // Run the effect and store cleanup function
      effect.cleanup = effect.callback();
      effect.shouldRun = false;
    }
  });
}

/**
 * Component registry for mapping component functions to instances
 * This helps maintain component identity across renders
 */
const componentRegistry = new Map();

/**
 * Registers a component instance with its DOM element
 * @param {function} component - Component function
 * @param {HTMLElement} element - DOM element
 * @param {ComponentInstance} instance - Component instance
 */
export function registerComponentInstance(component, element, instance) {
  componentRegistry.set(element, instance);
  instance.domElement = element;
}

/**
 * Gets a component instance by its DOM element
 * @param {HTMLElement} element - DOM element
 * @returns {ComponentInstance|null}
 */
export function getInstanceByElement(element) {
  return componentRegistry.get(element) || null;
}
