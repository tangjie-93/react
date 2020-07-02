import React, { Component } from 'react';
import './App.css';
// import Todo from "./Todo";
import TodoList from "./todoList"
class App extends Component {
  render(){
    return (
      <div className="App">
          <TodoList />
      </div>
    );
  }
 
}

export default App;
