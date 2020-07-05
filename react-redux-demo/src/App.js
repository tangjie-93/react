import React from 'react';
import './App.css';
// import { Provider } from 'react-redux';
import { Provider } from "./Treact-redux"
import store from "./store"
import ReactReduxPage from './pages/ReactReduxPage';
import HooksPage from './pages/HooksPage';
import ReactReduxHookPage from './pages/ReactReduxHookPage';
function App () {
  return (
    <div className="App">
      <Provider store={store} >
        <ReactReduxPage></ReactReduxPage>
        <HooksPage />
        <ReactReduxHookPage />
      </Provider>
    </div>
  );
}

export default App;
