import React from 'react';
import Nav from './Nav'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Collections from './Collections';
import Recipes from './Recipes';
import Search from './Search';
import SearchResult from './SearchResult';
import Recipe from './Recipe'
import AddNew from './AddNew';
import MobileNav from './MobileNav';
import Login from './Login';
import UseToken from './UseToken';
import AddNewCollection from './AddNewCollection';

const App = () => {
  const { token, setToken } = UseToken();

  if(!token) {
    return <Login setToken = { setToken } />
  }

  return (
    <BrowserRouter>
    <MobileNav />
    <Nav />
    <Search />
    <Routes>
      <Route path = "/" element = { <Recipes /> } />
      <Route path = "/collections" element = { <Collections /> } />
      <Route path = "/recipes" element = { <Recipes /> } />
      <Route path = "/searchresult" element = { <SearchResult /> } />
      <Route path = "/recipe" element = { <Recipe /> } />
      <Route path = "/new-r" element = { <AddNew data = {null}/> } />
      <Route path = "/new-c" element = { <AddNewCollection data = {null}/> } />
    </Routes>
  </BrowserRouter>
  )
}

export default App