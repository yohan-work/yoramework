// Todo App - Demo application for Yoramework
// This file will be populated in later steps

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
      <p style={{ color: '#666' }}>
        Framework is being set up...
      </p>
    </div>
  );
}

// This will work once we implement render in step 2
// Yoramework.render(<App />, document.getElementById('root'));

console.log('Yoramework loaded:', Yoramework);

