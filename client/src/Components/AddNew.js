import axios from 'axios';
import cameraOff from '../assets/camera-off-recipe.png'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import plus from '../assets/plus.svg'
import check from '../assets/file-plus.svg'
import Input from './Input';

const AddNew = () => {
  const location = useLocation()
  const navigate = useNavigate();
  const data = (location.state ? location.state.query : null);

  const arrayHandler = (array) => {
    let newArray = [];
    for (let i = 0; i < array.length; i++) {
        newArray.push(array[i].name);
    }
    return newArray.length > 1 ? newArray : [''];
  } 

  const convertTags = (array) => {
    let newArray = [];
    for (let i = 0; i < array.length; i++) {
      newArray.push(array[i].name)
    }
    return newArray.join(', ');
  }

  const [newRecipe, setNewRecipe] = useState(!data ? {
    name: '',
    imageURL: '',
    lastEaten: new Date().toJSON().slice(0, 10), // this needs to change later i think
    serves: 0,
    calories : 0,
    protein: 0,
    carbohydrates: 0,
    fat: 0,
    prepTime: 0,
    cookTime: 0,
  } : 
  {
    name: data[0][0].name,
    imageURL: data[0][0].image_url,
    lastEaten: data[0][0].last_eaten, // this needs to change later i think
    serves: data[0][0].serves,
    calories : data[0][0].calories,
    protein: data[0][0].protein,
    carbohydrates: data[0][0].carbohydrates,
    fat: data[0][0].fat,
    prepTime: data[0][0].prep_time,
    cookTime: data[0][0].cook_time,
    })
  const [ingredients, setIngredients] = useState(!data ? [['']] : arrayHandler(data[1]));
  const [instructions, setInstructions] = useState(!data ? [['']] : arrayHandler(data[2]));
  const [tags, setTags] = useState(!data ? '' : convertTags(data[3]));
  const [image, setImage] = useState(new FormData());
  const [preview, setPreview] = useState(newRecipe.imageURL === '' || newRecipe.imageURL === null ? cameraOff : 'http://localhost:8800/uploads/?filename='+ newRecipe.imageURL)
  useEffect(() => {
    setNewRecipe(!data ? {
      name: '',
      imageURL: '',
      lastEaten: new Date().toJSON().slice(0, 10),
      serves: 0,
      calories : 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0,
      prepTime: 0,
      cookTime: 0,
    } : 
    {
      id: data[0][0].id,
      name: data[0][0].name,
      imageURL: data[0][0].image_url,
      lastEaten: data[0][0].last_eaten, // this needs to change later i think
      serves: data[0][0].serves,
      calories : data[0][0].calories,
      protein: data[0][0].protein,
      carbohydrates: data[0][0].carbohydrates,
      fat: data[0][0].fat,
      prepTime: data[0][0].prep_time,
      cookTime: data[0][0].cook_time,
      })
      setIngredients(!data ? [['']] : arrayHandler(data[1]))
      setInstructions(!data ? [['']] : arrayHandler(data[2]))
      setTags(!data ? '' : convertTags(data[3]));
  }, [data])
  
  const clipPath = (url) => {
    return url.slice(12);
  }

  const handleChangeMain = (e) => {
    if(e.target.name === 'imageURL') {
      setNewRecipe((prev) => ({...prev, [e.target.name]: clipPath(e.target.value)}));
    } else {
      setNewRecipe((prev) => ({...prev, [e.target.name]: e.target.value}));
    }
  }

  const handleChangeSub = (e, obj, index) => {
    let newObj = [...obj];
    newObj[index] = e.target.value;
    if(obj === ingredients) {
      setIngredients(newObj);
    } else {
      setInstructions(newObj)
    }
  }

  const handleChangeTags = (e) => {
    setTags(e.target.value)
  }

  const handleChangeImg = (e) => {
    const data = new FormData();
    data.set('image', e.target.files[0])
    handleChangeMain(e);
    setImage(data);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    }
    reader.readAsDataURL(e.target.files[0]);
  }


  const removeSub = (obj, index) => {
    let newObj = [...obj]
    newObj.splice(index, 1);
    if(obj === ingredients) {
      setIngredients(newObj);
    } else {
      setInstructions(newObj)
    }
  }

  const handleClick = async (e) => {
    e.preventDefault();
    if(data) {
      try {
        await axios.post("http://localhost:8800/update_r", {newRecipe, ingredients, instructions, tags});
        if (newRecipe.imageURL !== data[0][0].image_url) {
          axios({
            method: "post",
            url: "http://localhost:8800/upload",
            data: image,
            headers: 'multipart/form-data'
          }).then(axios.post('http://localhost:8800/delete_img', {data: data[0][0].image_url}))
        }
        navigate('/recipe', {state: {query: newRecipe.name}})
      } catch(err) {
        console.log(err)
    }
    } else {
    try {
        await axios.post("http://localhost:8800/new_r", {newRecipe, ingredients, instructions, tags})
        .then(axios({
          method: "post",
          url: "http://localhost:8800/upload",
          data: image,
          headers: 'multipart/form-data'
        }))
        navigate('/recipe', {state: {query: newRecipe.name}})
      } catch(err) {
        console.log(err)
      }
    }
  }
  useEffect(() => {
    console.log(ingredients)
  }, [ingredients])
  return (
      <div className='add-new'>
          <Input name = 'name' type = 'text'
          placeholder = 'Name of Recipe' value = {newRecipe.name} 
          change = { handleChangeMain } mode = 'main'/>

          <label htmlFor="imageURL"><img src={preview} alt = 'add visual' id = 'provided-image'/></label>
          <input type = "file" name = "imageURL" id = "imageURL" onChange = {(e) => handleChangeImg(e)}/>

          <div className='special-container'>
            <label htmlFor='lastEaten'>Last eaten on: </label>
            <Input name = 'lastEaten' type = 'date'
            placeholder = '' value = {newRecipe.lastEaten} 
            change = { handleChangeMain } mode = 'main'/>
          </div>

          <div className='special-container'>
            <label htmlFor='serves'>Serves: </label>
            <Input name = 'serves' type = 'number'
            placeholder = "Serves how many?" value = {newRecipe.serves} 
            change = { handleChangeMain } mode = 'main'/>
          </div>

          <div className='information'>
            <div className='ingredients-outer'>
              <h2>Ingredients</h2>
              <div className='ingredients-inner'>
              {ingredients.map((ingredient, index) =>
                <Input name = 'ingredient' type = 'text' key = {index}
                placeholder = 'Enter an ingredient' value = {ingredient}
                change = { handleChangeSub } changeArgs = { { obj: ingredients, index: ingredients.indexOf(ingredient) } } 
                click = { removeSub } mode = 'sub-ing'/>
              )}
              </div>
              <img onClick = {() => {setIngredients([...ingredients,  ''])}} src = {plus} alt = {'add ingredient'} />
            </div>
            <span className='border'></span>
            <div className='nutrition-outer'>
                <h2>Nutrition</h2>
                <div className='nutrition-inner'>
                  <Input name = 'calories' type = 'number'
                  value = {newRecipe.calories ? newRecipe.calories : ''} 
                  change = { handleChangeMain } 
                  mode = 'nutrition'/>

                  <Input name = 'carbohydrates' type = 'number'
                  value = {newRecipe.carbohydrates ? newRecipe.carbohydrates : ''} 
                  change = { handleChangeMain } 
                  mode = 'nutrition'/>

                  <Input name = 'fat' type = 'number'
                  value = {newRecipe.fat ? newRecipe.fat : ''} 
                  change = { handleChangeMain } 
                  mode = 'nutrition'/>

                  <Input name = 'prepTime' type = 'number'
                  value = {newRecipe.prepTime ? newRecipe.prepTime : ''} 
                  change = { handleChangeMain } placeholder = 'in minutes'
                  mode = 'nutrition'/>

                  <Input name = 'cookTime' type = 'number'
                  value = {newRecipe.cookTime ? newRecipe.cookTime : ''} 
                  change = { handleChangeMain } placeholder = 'in minutes'
                  mode = 'nutrition'/>
                </div>
              </div>
          </div>
          <div className='instructions-input'>
            <h2>Instructions</h2>
            <ol>
              {instructions.map((instruction, index) =>
                <Input name = 'instruction' type = 'text' key = {index}
                placeholder = 'Enter an instruction' value = {instruction} 
                change = { handleChangeSub } changeArgs = { { obj: instructions, index: instructions.indexOf(instruction) } } 
                click = { removeSub } mode = 'sub-inst'/>
                )}
            </ol>
            <ol>
              <li className='special-li'>
                <div className='spacer' /><img onClick = {() => {setInstructions([...instructions,  ['']])}} src = {plus} alt = {'add instruction'} />
              </li>
            </ol>
          </div>
          <Input name = 'tags' type = 'text'
          placeholder = 'tags' value = {tags !== '' ? tags : ''} 
          change = { handleChangeTags } mode = 'main'/>
          <div className = 'submit'><img onClick = {(e) => handleClick(e)} src = {check} alt = 'submit recipe' /> </div>
    </div>
  )
}

export default AddNew