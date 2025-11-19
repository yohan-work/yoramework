// Yoramework - A React-like JavaScript Framework
// Main entry point

import { createElement } from './createElement.js';
import { render } from './render.js';
import { reconcile } from './reconciler.js';
import { 
  renderComponent, 
  getComponentInstance, 
  getCurrentComponent 
} from './component.js';
import { useState, useEffect, useRef, useMemo, useCallback } from './hooks.js';
import { initEventDelegation } from './events.js';

const Yoramework = {
  createElement,
  render,
  reconcile,
  renderComponent,
  getComponentInstance,
  getCurrentComponent,
  initEventDelegation,
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  Fragment: 'FRAGMENT',
};

export default Yoramework;
export { 
  createElement, 
  render, 
  reconcile, 
  renderComponent,
  getComponentInstance,
  getCurrentComponent,
  initEventDelegation,
  useState, 
  useEffect, 
  useRef, 
  useMemo, 
  useCallback 
};

