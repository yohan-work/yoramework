// Todo App - Full-featured demo application for Yoramework

import Yoramework from '../../src/index.js';

const { useState, useEffect } = Yoramework;

// TodoItem Component
function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li style={{
      padding: '12px 0',
      background: 'white',
      borderBottom: '1px solid #f1f3f4',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          style={{
            width: '18px',
            height: '18px',
            marginRight: '16px',
            cursor: 'pointer',
            accentColor: '#1a73e8'
          }}
        />
        <span style={{
          textDecoration: todo.completed ? 'line-through' : 'none',
          color: todo.completed ? '#5f6368' : '#202124',
          fontSize: '14px',
          fontFamily: 'Roboto, sans-serif'
        }}>
          {todo.text}
        </span>
      </div>
      <button
        onClick={() => onDelete(todo.id)}
        style={{
          background: 'transparent',
          color: '#5f6368',
          border: 'none',
          padding: '8px',
          cursor: 'pointer',
          fontSize: '18px',
        }}
        onMouseEnter={(e) => e.target.style.color = '#d93025'}
        onMouseLeave={(e) => e.target.style.color = '#5f6368'}
      >
        ×
      </button>
    </li>
  );
}

// Main TodoApp Component
function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, completed

  // Effect: Log todos whenever they change
  useEffect(() => {
    console.log('📝 Todos updated:', todos);
  }, [todos]);

  // Effect: Load todos from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('yoramework-todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
    console.log('✅ App mounted!');

    // Cleanup function
    return () => {
      console.log('👋 App unmounting...');
    };
  }, []);

  // Effect: Save todos to localStorage whenever they change
  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem('yoramework-todos', JSON.stringify(todos));
    }
  }, [todos]);

  // Add new todo
  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, {
        id: Date.now(),
        text: input,
        completed: false
      }]);
      setInput('');
    }
  };

  // Toggle todo completion
  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // Delete todo
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Clear completed todos
  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  // Filter todos based on current filter
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;

  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      padding: '24px',
      boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
      maxWidth: '500px',
      width: '100%',
      margin: '0 auto'
    }}>
      <h1 style={{
        fontSize: '22px',
        marginBottom: '24px',
        color: '#202124',
        textAlign: 'center',
        fontWeight: '400',
        fontFamily: "'Google Sans', Roboto, sans-serif"
      }}>
        Tasks
      </h1>

      {/* Input Section */}
      {/* Input Section */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '24px'
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a new task"
          style={{
            flex: 1,
            padding: '10px 12px',
            border: '1px solid #dadce0',
            borderRadius: '4px',
            fontSize: '14px',
            outline: 'none',
            transition: 'border 0.2s'
          }}
          onFocus={(e) => e.target.style.border = '1px solid #1a73e8'}
          onBlur={(e) => e.target.style.border = '1px solid #dadce0'}
        />
        <button
          onClick={addTodo}
          style={{
            background: '#1a73e8',
            color: 'white',
            border: 'none',
            padding: '0 24px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 1px 2px rgba(66,133,244,0.3)'
          }}
        >
          Add
        </button>
      </div>

      {/* Filter Buttons */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '16px',
        justifyContent: 'center'
      }}>
        {['all', 'active', 'completed'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              background: filter === f ? '#e8f0fe' : 'transparent',
              color: filter === f ? '#1a73e8' : '#5f6368',
              border: 'none',
              padding: '6px 16px',
              borderRadius: '16px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              textTransform: 'capitalize',
              transition: 'background 0.2s'
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Todo List */}
      <ul style={{
        listStyle: 'none',
        padding: 0,
        margin: '0 0 16px 0'
      }}>
        {filteredTodos.length === 0 ? (
          <li style={{
            textAlign: 'center',
            padding: '32px',
            color: '#999',
            fontSize: '16px'
          }}>
            {todos.length === 0
              ? '🎉 No todos yet. Add one above!'
              : filter === 'active'
                ? '✨ All tasks completed!'
                : '📝 No completed tasks yet.'}
          </li>
        ) : (
          filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          ))
        )}
      </ul>

      {/* Stats Footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px',
        background: '#f9fafb',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#6b7280'
      }}>
        <span>
          {activeCount} active • {completedCount} completed
        </span>
        {completedCount > 0 && (
          <button
            onClick={clearCompleted}
            style={{
              background: 'transparent',
              color: '#ef4444',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Clear completed
          </button>
        )}
      </div>
    </div>
  );
}

// Render the app!
Yoramework.render(<TodoApp />, document.getElementById('root'));

console.log('✅ Yoramework Todo App running!');

