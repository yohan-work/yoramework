// Todo App - Full-featured demo application for Yoramework

import Yoramework from '../../src/index.js';

const { useState, useEffect } = Yoramework;

// TodoItem Component
function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li style={{
      padding: '12px 16px',
      background: 'white',
      borderRadius: '8px',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      transition: 'all 0.2s ease'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          style={{
            width: '18px',
            height: '18px',
            marginRight: '12px',
            cursor: 'pointer'
          }}
        />
        <span style={{
          textDecoration: todo.completed ? 'line-through' : 'none',
          color: todo.completed ? '#999' : '#333',
          fontSize: '16px'
        }}>
          {todo.text}
        </span>
      </div>
      <button
        onClick={() => onDelete(todo.id)}
        style={{
          background: '#ef4444',
          color: 'white',
          border: 'none',
          padding: '6px 12px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500'
        }}
      >
        Delete
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
      borderRadius: '16px',
      padding: '32px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      maxWidth: '600px',
      width: '100%'
    }}>
      <h1 style={{ 
        fontSize: '36px', 
        marginBottom: '8px',
        color: '#667eea',
        textAlign: 'center',
        fontWeight: '700'
      }}>
        Yoramework Todo
      </h1>
      <p style={{ 
        color: '#999', 
        textAlign: 'center',
        marginBottom: '32px',
        fontSize: '14px'
      }}>
        Built with a custom React-like framework from scratch
      </p>
      
      {/* Input Section */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px'
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="What needs to be done?"
          style={{
            flex: 1,
            padding: '12px 16px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '16px',
            outline: 'none'
          }}
        />
        <button
          onClick={addTodo}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
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
              background: filter === f ? '#667eea' : '#f3f4f6',
              color: filter === f ? 'white' : '#6b7280',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              textTransform: 'capitalize'
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

