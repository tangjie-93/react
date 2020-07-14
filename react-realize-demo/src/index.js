import React from './react';
import ReactDOM from './react/react-dom';
import './index.css';
//函数组件
import App from './App';
import User from './pages/user'
const node = (
  <div className='border'>
    <div>raect 源码实现</div>
    <App />
    <User />
  </div>

)
ReactDOM.render(
  node,
  document.getElementById('root')
);

