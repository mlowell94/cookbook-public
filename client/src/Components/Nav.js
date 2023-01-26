import React from 'react';
import { Link, useNavigate } from 'react-router-dom'

const Nav = () => {
    const navigate = useNavigate();
    const createRecipe = () => {
        navigate('/new-r', {state : null});
    }

    const createCollection = () => {
        navigate('/new-c', {state : null});
    }
    const closeMenu = () => {
        if (document.querySelector('.navbar').classList.contains('active')) {
            document.querySelector('.navbar').classList.remove('active');
            document.querySelector('.open-menu').classList.remove('clicked');
        }
    }
    return (
        <div className='navbar'>
            <h1>My Cookbook</h1>
            <ul onClick = {() => {closeMenu()}}>
                <li><Link to = '/recipes'>Recipes</Link></li>
                <li onClick = {() => createRecipe()}>New Recipe</li>
                <li><Link to = '/collections'>Collections</Link></li>
                <li onClick = {() => createCollection()}>New Collection</li>
            </ul>
        </div>
    )
}

export default Nav;