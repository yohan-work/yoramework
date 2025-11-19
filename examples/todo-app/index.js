// Todo App - Demo application for Yoramework

import Yoramework from '../../src/index.js';

function App() {
  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '32px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
    }}>
      <h1 style={{ 
        fontSize: '32px', 
        marginBottom: '24px',
        color: '#333'
      }}>
        Yoramework Demo
      </h1>
      <p style={{ color: '#666', marginBottom: '16px' }}>
        Step 2 Complete: Virtual DOM & Render
      </p>
      <div style={{ 
        padding: '16px', 
        background: '#f0f0f0', 
        borderRadius: '8px',
        marginTop: '16px'
      }}>
        <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#333' }}>
          Features Working:
        </h3>
        <ul style={{ paddingLeft: '20px', color: '#555' }}>
          <li>createElement (JSX to Virtual DOM)</li>
          <li>render (Virtual DOM to Real DOM)</li>
          <li>Component rendering</li>
          <li>Style props</li>
        </ul>
      </div>
    </div>
  );
}

// Render the app!
Yoramework.render(<App />, document.getElementById('root'));

console.log('✅ Yoramework Step 2: Virtual DOM & Render complete!');

