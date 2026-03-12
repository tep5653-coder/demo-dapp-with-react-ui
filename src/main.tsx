import React from 'react';
import { render } from 'react-dom';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

render(<App />, rootElement);
