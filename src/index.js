// Yoramework - A React-like JavaScript Framework
// Main entry point

import { createElement } from './createElement.js';
import { render } from './render.js';
import { useState, useEffect, useRef, useMemo, useCallback } from './hooks.js';

const Yoramework = {
  createElement,
  render,
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  Fragment: 'FRAGMENT',
};

export default Yoramework;
export { createElement, render, useState, useEffect, useRef, useMemo, useCallback };

