# Yoramework
based js. like react

## Features

- Virtual DOM
- JSX Support
- Functional Components
- Hooks
- Reconciliation
- Synthetic Events
- Context API

## 📁 Project Structure

```
yoramework/
├── src/
│   ├── index.js           # 메인 진입점
│   ├── createElement.js   # JSX → Virtual DOM 변환
│   ├── render.js          # Virtual DOM → Real DOM
│   ├── reconciler.js      # Diffing & Patching 알고리즘
│   ├── component.js       # 컴포넌트 인스턴스 관리
│   ├── hooks.js           # Hooks 구현
│   ├── events.js          # 합성 이벤트 시스템
│   └── context.js         # Context API
├── examples/
│   └── todo-app/          # Todo 앱 데모
├── dist/                  # 빌드 결과물
└── package.json
```

## API Documentation

### Core API

#### `Yoramework.render(vnode, container)`

애플리케이션을 DOM에 렌더링

```jsx
import Yoramework from "./src/index.js";

function App() {
  return <h1>Hello Yoramework!</h1>;
}

Yoramework.render(<App />, document.getElementById("root"));
```

**Parameters:**

- `vnode` - 렌더링할 Virtual DOM 노드 (JSX 컴포넌트)
- `container` - 마운트할 DOM 컨테이너 엘리먼트

---

### Hooks

#### `useState(initialValue)`

컴포넌트에 상태를 추가

```jsx
function Counter() {
  const [count, setCount] = Yoramework.useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

**Parameters:**

- `initialValue` - 초기 상태 값 (값 또는 함수)

**Returns:**

- `[state, setState]` - 현재 상태와 상태 업데이트 함수

**특징:**

- 함수형 업데이트 지원: `setState(prev => prev + 1)`
- 상태가 변경되면 자동으로 컴포넌트 리렌더링
- 여러 상태 업데이트는 자동으로 배치 처리

---

#### `useEffect(callback, dependencies)`

사이드 이펙트를 실행합니다.

```jsx
function Timer() {
  const [seconds, setSeconds] = Yoramework.useState(0);

  Yoramework.useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    // 클린업 함수
    return () => clearInterval(timer);
  }, []); // 빈 배열 = 마운트 시에만 실행

  return <p>Seconds: {seconds}</p>;
}
```

**Parameters:**

- `callback` - 실행할 이펙트 함수 (클린업 함수 반환 가능)
- `dependencies` - 의존성 배열 (생략 가능)

**동작:**

- `dependencies`가 없으면 매 렌더링마다 실행
- 빈 배열 `[]`이면 마운트 시에만 실행
- 배열에 값이 있으면 해당 값이 변경될 때만 실행

---

#### `useRef(initialValue)`

렌더링 간 값을 유지하는 ref 객체를 생성

```jsx
function InputFocus() {
  const inputRef = Yoramework.useRef(null);

  const focusInput = () => {
    inputRef.current.focus();
  };

  return (
    <div>
      <input ref={inputRef} />
      <button onClick={focusInput}>Focus Input</button>
    </div>
  );
}
```

**Parameters:**

- `initialValue` - ref의 초기 값

**Returns:**

- `{ current: value }` - current 프로퍼티를 가진 ref 객체

**특징:**

- `current` 값 변경은 리렌더링을 트리거하지 않음
- DOM 엘리먼트 참조나 값 저장에 사용

---

#### `useMemo(factory, dependencies)`

계산 비용이 높은 값을 메모이제이션합니다.

```jsx
function ExpensiveCalculation({ items }) {
  const total = Yoramework.useMemo(() => {
    console.log("Calculating...");
    return items.reduce((sum, item) => sum + item.price, 0);
  }, [items]);

  return <p>Total: ${total}</p>;
}
```

**Parameters:**

- `factory` - 값을 계산하는 함수
- `dependencies` - 의존성 배열

**Returns:**

- 메모이제이션된 값

---

#### `useCallback(callback, dependencies)`

콜백 함수를 메모이제이션합니다.

```jsx
function TodoList() {
  const [todos, setTodos] = Yoramework.useState([]);

  const addTodo = Yoramework.useCallback(
    (text) => {
      setTodos([...todos, { id: Date.now(), text }]);
    },
    [todos]
  );

  return <TodoForm onAdd={addTodo} />;
}
```

**Parameters:**

- `callback` - 메모이제이션할 함수
- `dependencies` - 의존성 배열

**Returns:**

- 메모이제이션된 콜백 함수

---

#### `useContext(context)`

Context 값을 읽습니다.

```jsx
const ThemeContext = Yoramework.createContext("light");

function ThemedButton() {
  const theme = Yoramework.useContext(ThemeContext);

  return (
    <button
      style={{
        background: theme === "dark" ? "#333" : "#fff",
      }}
    >
      Button
    </button>
  );
}
```

**Parameters:**

- `context` - `createContext`로 생성한 Context 객체

**Returns:**

- 현재 Context 값

---

### Context API

#### `createContext(defaultValue)`

새로운 Context를 생성합니다.

```jsx
const UserContext = Yoramework.createContext(null);

function App() {
  const [user, setUser] = Yoramework.useState({ name: "John" });

  return (
    <UserContext.Provider value={user}>
      <ProfilePage />
    </UserContext.Provider>
  );
}

function ProfilePage() {
  const user = Yoramework.useContext(UserContext);
  return <h1>Hello, {user.name}!</h1>;
}
```

**Parameters:**

- `defaultValue` - 기본 Context 값

**Returns:**

- Context 객체 (Provider, Consumer 포함)

---

## 💡 Usage Examples

### Basic Counter

```jsx
import Yoramework from "./src/index.js";

function Counter() {
  const [count, setCount] = Yoramework.useState(0);

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

Yoramework.render(<Counter />, document.getElementById("root"));
```

### Form Handling

```jsx
function LoginForm() {
  const [email, setEmail] = Yoramework.useState("");
  const [password, setPassword] = Yoramework.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login:", { email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

### Data Fetching

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = Yoramework.useState(null);
  const [loading, setLoading] = Yoramework.useState(true);

  Yoramework.useEffect(() => {
    setLoading(true);
    fetch(`https://api.example.com/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>No user found</p>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

### Using Context

```jsx
const ThemeContext = Yoramework.createContext("light");

function App() {
  const [theme, setTheme] = Yoramework.useState("light");

  return (
    <ThemeContext.Provider value={theme}>
      <Toolbar />
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        Toggle Theme
      </button>
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

function ThemedButton() {
  const theme = Yoramework.useContext(ThemeContext);

  return (
    <button
      style={{
        background: theme === "dark" ? "#333" : "#fff",
        color: theme === "dark" ? "#fff" : "#333",
      }}
    >
      I'm a {theme} themed button
    </button>
  );
}
```

## 🔧 How It Works

### 1. Virtual DOM

JSX는 Babel에 의해 `createElement` 호출로 변환:

```jsx
<div className="container">
  <h1>Hello</h1>
</div>;

// ↓ 변환

Yoramework.createElement(
  "div",
  { className: "container" },
  Yoramework.createElement("h1", null, "Hello")
);
```

`createElement`는 Virtual DOM 객체를 생성 :

```javascript
{
  type: 'div',
  props: { className: 'container' },
  children: [
    {
      type: 'h1',
      props: {},
      children: [{ type: 'TEXT_NODE', text: 'Hello' }]
    }
  ]
}
```

### 2. Reconciliation

상태가 변경되면 새로운 Virtual DOM을 생성하고, Reconciler가 이전 Virtual DOM과 비교(Diffing)하여 변경된 부분만 실제 DOM에 반영:

- **Added**: 새 노드 추가
- **Removed**: 기존 노드 제거
- **Replaced**: 타입이 변경된 노드 교체
- **Updated**: 같은 타입이지만 props/children이 변경된 노드 업데이트

### 3. Hooks System

Hooks는 컴포넌트 인스턴스에 배열로 저장:

```javascript
// 컴포넌트 인스턴스
{
  hooks: [
    { type: "useState", state: 0 },
    { type: "useEffect", callback: fn, deps: [] },
    { type: "useState", state: "hello" },
  ];
}
```

Hook 호출 순서가 중요한 이유입니다!

### 4. Event System

이벤트는 각 엘리먼트에 직접 바인딩되지 않고, 루트 컨테이너에서 위임(delegation)됩니다:

```javascript
// 루트에 한 번만 리스너 등록
rootContainer.addEventListener("click", (e) => {
  // 이벤트가 발생한 타겟부터 루트까지 탐색
  // 각 엘리먼트에 저장된 핸들러 실행
});
```

## Limitations

학습 목적으로 만들어진 프레임워크로, 다음 제한사항 존재:

- Key 기반 리스트 최적화 미구현
- SSR(Server-Side Rendering) 미지원
- Error Boundaries 미구현
- Portals 미지원
- Suspense/Concurrent Mode 미지원
- 프로덕션 최적화 미흡
