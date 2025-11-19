# Yoramework

A React-like JavaScript framework built from scratch to understand how modern UI frameworks work under the hood.

## Features

- ✅ Virtual DOM
- ✅ Component System (Functional Components)
- ✅ Hooks (useState, useEffect, useRef, useMemo, useCallback)
- ✅ JSX Support
- ✅ Efficient Reconciliation Algorithm
- ✅ Event System

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Project Structure

```
yoramework/
├── src/              # Framework source code
├── examples/         # Demo applications
├── dist/             # Build output
└── package.json
```

## Usage

```jsx
import Yoramework from './src/index.js';

function App() {
  const [count, setCount] = Yoramework.useState(0);
  
  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}

Yoramework.render(<App />, document.getElementById('root'));
```

## License

MIT

