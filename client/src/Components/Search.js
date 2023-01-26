import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import chevronDown from '../assets/chevron-down.svg';


const Search = () => {
    const [advanced, setAdvanced] = useState({
        searchType: 'recipes',
        searchBy: 'name',
        order: 'alpha-a',
        caloriesFilter: '>',
        fatFilter: '>',
        carbsFilter: '>',
        proteinFilter: '>',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
        prepFilter: '>',
        cookFilter: '>',
        prepTime: 0,
        cookTime: 0,
    })
    const navigate = useNavigate();
    const getOrder = () => {
        switch(advanced.order) {
            case 'alpha-a':
                return "`name`";
            case 'alpha-z':
                return "`name` DESC";
            case 'last-eaten-low':
                return "last_eaten";
            case 'last-eaten-high':
                return "last_eaten DESC";
            case 'calories-low':
                return "calories";
            case 'calories-high':
                return "calories DESC";
            case 'carbs-low':
                return "carbohydrates"
            case 'carbs-high':
                return "carbohydrates DESC";
            case 'fat-low':
                return "fat";
            case 'fat-high':
                return "fat DESC"
            case 'protein-low':
                return "protein";
            case 'protein-high':
                return "protein DESC";
            case 'prep-time-low':
                return "prep_time";
            case 'prep-time-high':
                return "prep_time DESC";
            case 'cook-time-low':
                return "cook_time";
            case 'cook-time-high':
                return "cook_time DESC"
            default:
                break;
        }
    }

    const convertSearch = (array) => {
        let newArray = [];
        for(let i = 0; i < array.length; i++) {
            if (i === (array.length - 1)) {
                newArray.push('LIKE "%' + array[i] +  '%" OR `name` LIKE "%' + array[i] + '" OR `name` LIKE "' + array[i] + '%"');
            } else {
                newArray.push('LIKE "%' + array[i] +  '%" OR `name` LIKE "%' + array[i] + '" OR `name` LIKE "' + array[i] + '%" OR `name` ');
            }
        }
        return newArray.join("");
    }

    const buildAdvanced = (e) => {
        let statement;
        if(advanced.searchType === 'recipes') {
            if(advanced.searchBy === 'name') {
                statement = 
                'SELECT `name`, image_url FROM recipes WHERE `name` ' + convertSearch(e.target.value.split(' ')) +
                ' AND calories ' + advanced.caloriesFilter + ' ' + advanced.calories +
                ' AND fat ' + advanced.fatFilter + ' ' + advanced.fat +
                ' AND carbohydrates ' + advanced.carbsFilter + ' ' + advanced.carbs +
                ' AND protein ' + advanced.proteinFilter + ' ' + advanced.protein +
                ' AND prep_time ' + advanced.prepFilter + ' ' + advanced.prepTime +
                ' AND cook_time ' + advanced.cookFilter + ' ' + advanced.cookTime +
                ' ORDER BY ' + getOrder();
            } else if (advanced.searchBy === 'tag') {
                statement = 
                'SELECT recipes.`name`, image_url FROM tags JOIN recipe_tag ON tag_id = tags.id' + 
                ' JOIN recipes ON recipe_id = recipes.id WHERE tags.id = ' +
                ' (SELECT id FROM tags WHERE tags.`name` = "' + e.target.value + '")' + 
                ' ORDER BY ' + getOrder();
            }    
        } else {
            if(advanced.searchBy === 'name') {
                statement = 
                'SELECT `name` FROM collections WHERE `name` ' + convertSearch(e.target.value.split(' ')) +
                ' ORDER BY ' + getOrder();
            } else if (advanced.searchBy === 'tag') {
                statement = 
                'SELECT collections.`name` FROM tags JOIN collection_tag ON tag_id = tags.id' + 
                ' JOIN collections ON collection_id = collections.id WHERE tags.id = ' +
                ' (SELECT id FROM tags WHERE tags.`name` = "' + e.target.value + '")' + 
                ' ORDER BY ' + getOrder();
        }
    }
    return statement;
}

    const handleKeyPress = (e) => {
        if(e.key === 'Enter') {
            const query = buildAdvanced(e)
            if(advanced.searchType === 'recipes') {
                openAdvanced();
                e.target.value = '';
                navigate('/searchresult', { state: { query: query }})
            } else {
                openAdvanced();
                e.target.value = '';
                navigate('/collections', {state: {query: query}})
            }
        }
    }

    const handleChange = (e) => {
        setAdvanced((prev) => ({...prev, [e.target.name]: e.target.value}))
    }

    const handleClick = (e) => {
        e.target.textContent === '>' ? e.target.textContent = '<' : e.target.textContent = '>';
        setAdvanced((prev) => ({...prev, [e.target.classList[0]]: e.target.textContent}));
    }

    const openAdvanced = () => {
        const chevron = document.querySelector('.chevron')
        if (chevron.getAttribute('id') === 'open') {
            chevron.removeAttribute('id');
            document.querySelector('.advanced').removeAttribute('id')
        } else {
            chevron.setAttribute('id', 'open');
            document.querySelector('.advanced').setAttribute('id','expanded-full')
        }
    }

    return (
        <div className='search'>
            <img className = 'chevron' src={chevronDown} alt = 'open advanced options' onClick = {(e) => openAdvanced(e)}/>
            <input type = 'text' id = 'search' name = 'search' onKeyDown = { (e) => handleKeyPress(e) } placeholder = "Search for a recipe" />
            <div>
                <div className = 'advanced'>
                <fieldset>
                    Search... 
                    <div className='radio-outer' id = 'first'>
                        <div className = 'radio-container' id = 'first'>
                            <input type = 'radio' id = 'recipes' name = 'searchType' value = 'recipes' defaultChecked  onChange = {(e) => handleChange(e)} />
                            <label htmlFor = 'recipes'>Recipes</label>
                        </div>
                        <div className = 'radio-container' id = 'second'>
                            <input type = 'radio' id = 'collections' name = 'searchType' value = 'collections' onChange = {(e) => handleChange(e)} />
                            <label htmlFor = 'collections'>Collections</label>
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    Search by... 
                    <div className='radio-outer' id = 'second'>
                        <div className = 'radio-container' id = 'third'>
                            <input type = 'radio' id = 'name' name = 'searchBy' value = 'name'defaultChecked  onChange = {(e) => handleChange(e)} />
                            <label htmlFor = 'name'>Name</label>
                        </div>
                        <div className = 'radio-container' id = 'fourth'>
                            <input type = 'radio' id = 'tag' name = 'searchBy' value = 'tag' onChange = {(e) => handleChange(e)} />
                            <label htmlFor = 'collections'>Tag</label>
                        </div>
                    </div>
                </fieldset>
                <label htmlFor = 'order'>Sort results by: </label>
                <select id  = 'order' name = 'order' onChange = {(e) => handleChange(e)}>
                    <option value = 'alpha-a'>Alphabet (A to Z)</option>
                    <option value = 'alpha-z'>Alphabet (Z to A)</option>
                    <option value = 'last-eaten-low'>Last Eaten Date (Oldest to Newest)</option>
                    <option value = 'last-eaten-high'>Last Eaten Date (Newest to Oldest)</option>
                    <option value = 'calories-low'>Calories (Lowest to Highest)</option>
                    <option value = 'calories-high'>Calories (Highest to Lowest)</option>
                    <option value = 'carbs-low'>Carbs (Lowest to Highest)</option>
                    <option value = 'carbs-high'>Carbs (Highest to Lowest)</option>
                    <option value = 'fat-low'>Fat (Lowest to Highest)</option>
                    <option value = 'fat-high'>Fat (Highest to Lowest)</option>
                    <option value = 'protein-low'>Protein (Lowest to Highest)</option>
                    <option value = 'protein-high'>Protein (Highest to Lowest)</option>
                    <option value = 'prep-time-low'>Prep Time (Lowest to Highest)</option>
                    <option value = 'prep-time-high'>Prep Time (Highest to Lowest)</option>
                    <option value = 'cook-time-low'>Cook Time (Lowest to Highest)</option>
                    <option value = 'cook-time-high'>Cook Time (Highest to Lowest)</option>
                </select>
                <div className = 'filters'>
                    <div className = 'nutrition-filter'>
                        <div>Filters</div>
                        <div className = "nutrition-filter-outer" id = "contracted">
                            <div className = 'filter-container'>
                                Calories <span className='caloriesFilter' onClick = {(e) => handleClick(e)}>&gt;</span>
                                <input id = "calories" name = "calories" type = "number" defaultValue='0' onChange = {(e) => handleChange(e)}></input>
                                <span className='bar'></span>
                            </div>
                            <div className = 'filter-container'>
                                Fat <span className='fatFilter' onClick = {(e) => handleClick(e)}>&gt;</span>
                                <input id = "fat" name = "fat" type = "number" defaultValue='0' onChange = {(e) => handleChange(e)}></input>
                                <span className='bar'></span>
                            </div>
                            <div className = 'filter-container'>
                                Carbs <span className='carbsFilter' onClick = {(e) => handleClick(e)}>&gt;</span>
                                <input id = "carbs" name = "carbs" type = "number" defaultValue='0' onChange = {(e) => handleChange(e)}></input>
                                <span className='bar'></span>
                            </div>
                            <div className = 'filter-container'>
                                Protein <span className='proteinFilter' onClick = {(e) => handleClick(e)}>&gt;</span>
                                <input id = "protein" name = "protein" type = "number" defaultValue='0' onChange = {(e) => handleChange(e)}></input>
                                <span className='bar'></span>
                            </div>
                            <div className = 'filter-container'>
                                Prep time: <span className='prepFilter' onClick = {(e) => handleClick(e)}>&gt;</span>
                                <input id = "prepTime" name = "prepTime" type = "number" defaultValue='0' onChange = {(e) => handleChange(e)}></input>
                                <span className='bar'></span>
                            </div>
                            <div className = 'filter-container'>
                                Cook time: <span className='cookFilter' onClick = {(e) => handleClick(e)}>&gt;</span>
                                <input id = "cookTime" name = "cookTime" type = "number" defaultValue='0' onChange = {(e) => handleChange(e)}></input>
                                <span className='bar'></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default Search