import React from 'react';
// import logo from './logo.svg';
import './App.css';
import User from './react_antd/user/User';
import Role from './react_antd/role/Role';
import Category from './react_antd/category/Category';
import Product from './react_antd/product/Product';
import Order from './day/Order';
import UserRole from './react_antd/userrole/UserRole';
import OrderLine from './day/OrderLine';



import UserDetails from './react_antd/user/UserDetails';
import RoleDetails from './react_antd/role/RoleDetails';
import CategoryDetails from './react_antd/category/CategoryDetails';
import ProductDetails from './react_antd/product/ProductDetails';
import {BrowserRouter,Route,Link,Switch} from 'react-router-dom';

function App() {
  return (
   <div className="App">
     <header className='header'>
        <h1>在线点餐系统</h1>
      </header>
      <article className="content">
        <BrowserRouter>
            <ul className="nav">
            <li><Link to='/user'>用户管理</Link></li>
            <li><Link to='/role'>角色管理</Link></li>
            <li><Link to='/category'>食物分类管理</Link></li>
            <li><Link to='/product'>菜品管理</Link></li>
            <li><Link to='/order'>订单管理</Link></li>
            <li><Link to='/userrole'>用户角色管理</Link></li>
            <li><Link to='/orderline'>订单线管理</Link></li>
            </ul>

            <div className="content-right">
            <Switch>
                <Route path='/user' component={User}/>
                <Route path='/role' component={Role}/>
                <Route path='/category' component={Category}/>
                <Route path='/product' component={Product}/>
                <Route path='/order' component={Order}/>
                <Route path='/userrole' component={UserRole}/>
                <Route path='/orderline' component={OrderLine}/>
                <Route path='/userdetails' component={UserDetails}/>
                <Route path='/roledetails' component={RoleDetails}/>
                <Route path='/categorydetails' component={CategoryDetails}/>
                <Route path='/productdetails' component={ProductDetails}/>
            </Switch>
            </div>
        </BrowserRouter>
      </article>
   </div>
  );
}

export default App;
