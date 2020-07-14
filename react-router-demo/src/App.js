import React from 'react';
import './App.css';
import UserPage from "./pages/UserPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import _404Page from "./pages/_404Page";
import Product from "./pages/Product";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
} from "./Trouter";
function App () {
  return (
    <div className="app">
      {/* <RouteComponentPage /> */}
      <Router>
        <Link to="/">首页</Link>
        <Link to="/user">用户中心</Link>
        <Link to="/login">登录</Link>
        <Link to="/product/123">商品</Link>

        <Switch>
          <Route
            exact
            path="/"
            // children={children}
            component={HomePage}
            render={render}
          />
          <Route path="/user" component={UserPage} />
          <Route path="/login" component={LoginPage} />
          {/* <Route path="/product/:id" component={Product} /> */}
          <Route path="/product/:id" render={() => <Product />} />

          <Route component={_404Page} />
        </Switch>
      </Router>
    </div>
  );
}
function children (props) {
  console.log("children props", props); //sy-log
  return <div>children</div>;
}
function render (props) {
  console.log("render props", props); //sy-log
  return <div>render</div>;
}
export default App;
