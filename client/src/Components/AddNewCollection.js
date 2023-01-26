import React, { useState } from 'react'
import Input from './Input';
import check from '../assets/file-plus.svg'
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const AddNewCollection = () => {
  const location = useLocation();
  const convertTags = (array) => {
    let newArray = [];
    for (let i = 0; i < array.length; i++) {
      newArray.push(array[i].name)
    }
    return newArray.join(', ');
  }
  const [name, setName] = useState(location.state ? location.state.query.name : '');
  const [tags, setTags] = useState(location.state ? convertTags(location.state.query.tags) : '');
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === 'name') {
        setName(e.target.value);
    } else {
        setTags(e.target.value);
    }
  }

  const buildQuery = (collectionName) => {
    const query = 
    'SELECT `name`, image_url FROM recipes JOIN recipes_collections ON recipe_id = recipes.id AND collection_id = ' +
    '(SELECT id FROM collections WHERE `name` = "' + collectionName + '");'
    return query;
  }

  const handleClick = async () => {
    if (name) {
      if(!location.state) {
        try {
          await axios.post("http://localhost:8800/new_c", {name, tags})
          const query = buildQuery(name)
          navigate('/searchresult', { state: { query: query }})
        } catch(err) {
          console.log(err)
        }
      } else {
        try {
          await axios.post("http://localhost:8800/update_c", {newName: name, oldName: location.state.query.name, tags})
          const query = buildQuery(name)
          navigate('/searchresult', { state: { query: query }})
        } catch(err) {
        }
      }
    }
  }
  
  return (
  <div className='new-collection'>
    {location.state ? <h2 className='header'>Now editing - "{name}"</h2> : <h2 className='header'>Adding new collection</h2>}
    <div>
      <Input name = 'name' type = 'text'
      placeholder = 'Name of Collection' value = {name} 
      change = { handleChange } mode = 'main'/>

      <Input name = 'tags' type = 'text'
      placeholder = 'Tags' value = {tags} 
      change = { handleChange } mode = 'main'/>

      <div className = 'submit'><img onClick = {() => handleClick()} src = {check} alt = 'submit collection' /> </div>
    </div>
  </div>
  )
}

export default AddNewCollection