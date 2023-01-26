import React, {useState, useEffect } from 'react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'

const Collections = () => {
    const location = useLocation();
    const [collections, setCollections] = useState([])
    useEffect(() => {
        const fetchAllRecipes = async () => {
            if(!location.state) {
                try{
                    const res = await axios.get('http://localhost:8800/collections')
                    setCollections(res.data);
                } catch(err) {
                    console.log(err);
                }
            } else {
                try{
                    const res = await axios.get('http://localhost:8800/searchresult?search='+location.state.query )
                    setCollections(res.data);
                } catch(err) {
                    console.log(err);
                }
            }
        }
        fetchAllRecipes();
    }, [location])

    const navigate = useNavigate();

    const buildQuery = (collectionName) => {
        const query = 
        'SELECT `name`, image_url FROM recipes JOIN recipes_collections ON recipe_id = recipes.id AND collection_id = ' +
        '(SELECT id FROM collections WHERE `name` = "' + collectionName + '");'
        return query;
    }

    const goToCollection = (destination) => {
        const query = buildQuery(destination);
        navigate('/searchresult', { state: { query: query }, })
    }

    const handleModify = async (name) => {
        const tags = await axios.get('http://localhost:8800/get_ct?search='+name)
        const collectionToModify = {name : name, tags : tags.data}
        navigate('/new-c', {state : {query : collectionToModify}})
    }

    const handleDeletion = async (name) => {
        await axios.post('http://localhost:8800/delete_c', {name})
        navigate('/collections');
    }

    if(collections.length === 0) {
        return (
            <div>
                loading xd
            </div>
        )
    } else {
        return (
            <div>
                <h2 className='header'>Collections</h2>
                {collections.map(collection => 
                    <div className = "collection-container" key = {collection.name}>
                        <div onClick = {() => goToCollection(collection.name)}>{collection.name.length < 35 ? collection.name : collection.name.substring(0, 32) + '...'}</div>
                        <div>
                            <div onClick = {() => handleModify(collection.name)}>Edit</div>
                            <div onClick = {() => handleDeletion(collection.name)}>Delete</div>
                        </div>
                    </div>)} 
            </div>
        )
        }
    }


export default Collections;