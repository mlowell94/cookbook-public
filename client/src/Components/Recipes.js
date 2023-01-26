import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import cameraOff from '../assets/camera-off.svg';

const Recipes = () => {
    const [defaultRecipes, setDefault] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchAllRecipes = async () => {
            try{
                const res = await axios.get('http://localhost:8800/recipes')
                setDefault(res.data);
            } catch(err) {
                console.log(err);
            }
        }
        fetchAllRecipes();
    }, [])

    const handleClick = (recipeName) => {
        navigate('/recipe', {state: {query: recipeName}})
    }

    if(defaultRecipes.length === 0) {
        return (
            <div>
                loading xd
            </div>
        )
    } else {
        return (
            <div>
                <h2 className='header'>Recipes</h2>
                {defaultRecipes.map(defaultRecipe => 
                    <div onClick = {() => handleClick(defaultRecipe.name)} className = "recipe-container" key={defaultRecipe.name}>
                        <img src = {defaultRecipe.image_url !== null && defaultRecipe.image_url !== 'null' ? 'http://localhost:8800/uploads/?filename='+defaultRecipe.image_url : cameraOff} 
                        alt = {defaultRecipe.name} className = 'thumbnail'/>    
                        {defaultRecipe.name.length < 35 ? defaultRecipe.name : defaultRecipe.name.substring(0, 32) + '...'}
                    </div>)} 
            </div>
        )
        }
    }

export default Recipes;