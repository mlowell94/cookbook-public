import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios';
import cameraOff from '../assets/camera-off.svg'

const SearchResult = () => {
    const [recipes, setRecipes] = useState([])
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        const fetchRecipes = async () => {
            try{
                const res = await axios.get('http://localhost:8800/searchresult?search='+location.state.query)
                setRecipes(res.data)
            } catch(err) {
                console.log(err);
            }
        }
        fetchRecipes()
    }, [location])

    const handleClick = (recipeName) => {
        navigate('/recipe', {state: {query: recipeName}})
    }
    if(!recipes) {
        return (
            'haha loading :)'
        )
    } else {
    return (
        <div>
            {recipes.map(recipe => 
                    <div onClick = {() => handleClick(recipe.name)} className = "recipe-container" key={recipe.name}>
                        <img src = {recipe.image_url !== null ? 'http://localhost:8800/uploads/?filename='+recipe.image_url : cameraOff} 
                        alt = {recipe.name} className = 'thumbnail'/>    
                        {recipe.name.length < 35 ? recipe.name : recipe.name.substring(0, 32) + '...'}
                </div>)} 
        </div>
        )
    }
}

export default SearchResult;