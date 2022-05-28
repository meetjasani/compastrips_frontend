import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import './helper/i18n/index'
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { LastLocationProvider } from 'react-router-last-location';
import store from './redux/store';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <LastLocationProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </LastLocationProvider>
    </BrowserRouter >
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
