import React, {useState, useEffect} from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import cameraOff from '../assets/camera-off-recipe.png'
import axios from 'axios';

const Recipe = () => {
  const [currentRecipe, setCurrentRecipe] = useState('');
  const [addActive, setAddActive] = useState(false)
  const [removeActive, setRemoveActive] = useState(false)
  const [deleteRecipeActive, setDeleteRecipeActive] = useState(false)
  const [inclusive, setInclusive] = useState([]);
  const [exclusive, setExclusive] = useState([]);
  const [addSelection, setAddSelection] = useState('');
  const [delSelection, setDelSelection] = useState('');
  const location = useLocation();
  const navigate = useNavigate()
  useEffect(() => {
    const fetchRecipe = async () => {
        try{
            const res = await axios.get('http://localhost:8800/recipe?search='+location.state.query)
            setCurrentRecipe(res.data);
            const inclusiveCollections = await axios.get('http://localhost:8800/inclusive?search='+location.state.query);
            const inclusiveArray = []
            for (let i = 0; i < inclusiveCollections.data.length; i++) {
              inclusiveArray.push(inclusiveCollections.data[i].name)
            }
            setInclusive(inclusiveArray);
            const exclusiveCollections = await axios.get('http://localhost:8800/exclusive?search='+location.state.query);
            const exclusiveArray = []
            for (let i = 0; i < exclusiveCollections.data.length; i++) {
              exclusiveArray.push(exclusiveCollections.data[i].name)
            }
            setExclusive(exclusiveArray);
            setAddSelection(exclusiveArray[0]);
            setDelSelection(inclusiveArray[0]);
        } catch(err) {
            console.log(err);
        }
    }
    fetchRecipe();
  }, [location]);

  useEffect(() => {
    const populateCollections = async () => {
      const inclusiveCollections = await axios.get('http://localhost:8800/inclusive?search='+location.state.query);
      const inclusiveArray = []
      for (let i = 0; i < inclusiveCollections.data.length; i++) {
        inclusiveArray.push(inclusiveCollections.data[i].name)
      }
      setInclusive(inclusiveArray);
      const exclusiveCollections = await axios.get('http://localhost:8800/exclusive?search='+location.state.query);
      const exclusiveArray = []
      for (let i = 0; i < exclusiveCollections.data.length; i++) {
        exclusiveArray.push(exclusiveCollections.data[i].name)
      }
      setExclusive(exclusiveArray);
      setAddSelection(exclusiveArray[0]);
      setDelSelection(inclusiveArray[0]);
    }
    populateCollections();
  }, [addActive, removeActive, location.state.query])

  const disableScroll = () => {
    const html = document.querySelector('html')
    const body = document.querySelector('body');
    const content = document.querySelector('.recipe');
    if(!body.getAttribute('id')) {
      html.setAttribute('id', 'paused');
      body.setAttribute('id', 'paused');
      content.setAttribute('id', 'paused');
    } else {
      html.removeAttribute('id', 'paused');
      body.removeAttribute('id');
      content.removeAttribute('id');
    }
  }

  const handleModify = () => {
    navigate('/new-r', {state : {query: currentRecipe}});
  }

  const handleDeletion = async () => {
    await axios.post('http://localhost:8800/delete', currentRecipe[0][0])
    navigate('/recipes');
  }

  const addHandler = () => {
    addActive ? setAddActive(false) : setAddActive(true)
    disableScroll();
  }

  const addToCollection = async () => {
    const recipeID = currentRecipe[0][0].id
    await axios.post('http://localhost:8800/rc_add', {recipeID, collection: addSelection})
    addHandler();
  }

  const removeHandler = () => {
    removeActive ? setRemoveActive(false) : setRemoveActive(true)
    disableScroll();
  }

  const removeFromCollection = async () => {
    const recipeID = currentRecipe[0][0].id
    await axios.post('http://localhost:8800/rc_remove', {recipeID, collection: delSelection})
    removeHandler();
  }

  const optionsHandler = () => {
    const options = document.querySelector('.options');
    const openOptions = document.querySelector('.open-options')
    if(!options.getAttribute('id')) {
      options.setAttribute('id', 'active')
      openOptions.setAttribute('id', 'active')
    } else {
      options.removeAttribute('id')
      openOptions.removeAttribute('id')
      }
  }

  const formatCopy = (array, type) => {
    const newArray = [];
    for (let i = 0; i < array.length; i++) {
      if(type === 'ingredients') {
        newArray.push(array[i].name)
      } else {
        newArray.push((i + 1) + '. ' + array[i].name)
      }
    }
    return newArray.join('\n');
  }

  const copyToClipboard = () => {
    const toCopyBasics = currentRecipe[0][0];
    const toCopyIngredients = formatCopy(currentRecipe[1], 'ingredients');
    const toCopyInstructions = formatCopy(currentRecipe[2], 'instructions');
    navigator.clipboard.writeText(
      toCopyBasics.name + '\n' +
      'Serves: ' + toCopyBasics.serves + '\n\n' +
      'Ingredients:\n' + 
      toCopyIngredients + '\n\n' +
      'Instructions:\n' +
      toCopyInstructions
    )
  }
  if(!currentRecipe || currentRecipe.length === 0) {
    return (
        'haha loading :)'
    )
} else {
    return (
        <div className='recipe'>
            <div className='recipe-header'>
                {currentRecipe[0][0].name}
            </div>
            <div className='user-image'>
              <img src = {currentRecipe[0][0].image_url !== 'null' && currentRecipe[0][0].image_url !== null ? 'http://localhost:8800/uploads/?filename='+currentRecipe[0][0].image_url : cameraOff} 
              alt = "test" className="user-image"/>
              <div className='last-eaten'>
              Last Eaten: {currentRecipe[0][0].last_eaten.substring(0,10)}
            </div>
            </div>
            <div className='information'>
            <div className='ingredients-outer'>
              <h2>Ingredients</h2>
              <div className='ingredients-inner'>
                {currentRecipe[1].map(ingredient => <div className='ingredient' key={ingredient.name}>{ingredient.name}</div>)}
              </div>
            </div>
            <span className='border'></span>
            <div className='nutrition-outer'>
              <h2>Nutrition</h2>
              <div className='nutrition-inner'>
              <div className='nutrition'>Calories: <span>{currentRecipe[0][0].calories}</span></div>
              <div className='nutrition'>Carbs: <span>{currentRecipe[0][0].carbohydrates} grams</span></div>
              <div className='nutrition'>Fat: <span>{currentRecipe[0][0].fat} grams</span></div>
              <div className='nutrition'>Protein: <span>{currentRecipe[0][0].protein} grams</span></div>
              <div className='nutrition'>Prep Time: <span>{currentRecipe[0][0].prep_time} min</span></div>
              <div className='nutrition'>Cook Time: <span>{currentRecipe[0][0].cook_time} min</span></div>
            </div>
            </div>
            </div>
            <ol className='instructions'>
            <h2>Instructions</h2>
              <div className='instructions-inner'>
                {currentRecipe[2].map(instruction => <li className='instruction' key={instruction.name}>{instruction.name}</li>)}
              </div>
            </ol>
            <h2 className='open-options' onClick = {() => optionsHandler()}>Options</h2>
            <div className = 'options'>
              <div onClick = {() => copyToClipboard()}>Export</div>
              <div onClick = {() => removeHandler()}>Remove from Collection</div>
              <div onClick = {() => addHandler()}>Add to Collection</div>
              <div onClick = {() => handleModify()}>Edit</div>
              <div onClick = {() => {disableScroll(); setDeleteRecipeActive(true)}}>Delete</div>
            </div>
            {!addActive ? <div></div> : 
            <div className='outer'>
              <div>
                <h2>Add Recipe to Collection</h2>
                <label htmlFor = 'add-to'>Add to: </label>
                <select name = 'add-to' id = 'add-to' onChange = {(e) => setAddSelection(e.target.value)}>
                  {exclusive.map(collection => <option key={collection.name}>{collection}</option>)}
                </select>
                <button onClick = {() => addToCollection()}>Add</button>
              </div>
            </div>
            }
            {!removeActive ? <div></div> : 
            <div className='outer'>
              <div>
                <h2>Remove Recipe from Collection</h2>
                <label htmlFor = 'remove-from'>Remove from: </label>
                <select name = 'remove-from' id = 'remove-from' onChange = {(e) => setDelSelection(e.target.value)}>
                  {inclusive.map(collection => <option key={collection.name}>{collection}</option>)}
                </select>
                <button onClick = {() => removeFromCollection()}>Remove</button>
              </div>
            </div>
            }            
            {!deleteRecipeActive ? <div></div> : 
            <div className='outer'>
              <div>
                <h2>Delete {currentRecipe[0][0].name.substring(0, 32)}?</h2>
                <div>
                  <button onClick = {() => handleDeletion()}>Yes</button>
                  <button onClick = {() => {disableScroll(); setDeleteRecipeActive(false)}}>No</button>
                </div>
              </div>
            </div>
            }
        </div>
        )
    }
}

export default Recipe