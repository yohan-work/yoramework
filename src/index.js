// Yoramework - A React-like JavaScript Framework
// Main entry point

import { createElement } from './createElement.js';
import { render } from './render.js';
import { reconcile } from './reconciler.js';
import { useState, useEffect, useRef, useMemo, useCallback } from './hooks.js';

const Yoramework = {
  createElement,
  render,
  reconcile,
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  Fragment: 'FRAGMENT',
};

export default Yoramework;
export { createElement, render, reconcile, useState, useEffect, useRef, useMemo, useCallback };

