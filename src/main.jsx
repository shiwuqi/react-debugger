import * as React from 'react'
// import ReactDOM from 'react-dom/client'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

debugger;

const root = createRoot(document.getElementById('root'));
console.log(root);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
