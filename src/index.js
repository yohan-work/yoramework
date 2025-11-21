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
import { useState, useEffect, useRef, useMemo, useCallback, useReducer } from './hooks.js';
import { initEventDelegation } from './events.js';
import { createContext, useContext } from './context.js';

const Yoramework = {
  createElement,
  render,
  reconcile,
  renderComponent,
  getComponentInstance,
  getCurrentComponent,
  initEventDelegation,
  createContext,
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useReducer,
  useContext,
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
  createContext,
  useState, 
  useEffect, 
  useRef, 
  useMemo, 
  useCallback,
  useReducer,
  useContext
};

