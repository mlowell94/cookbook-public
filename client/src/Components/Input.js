import React from 'react';
import x from '../assets/x.svg';

const Input = (props) => {
    if (props.mode === 'sub-ing') {
        return (
        <div className={props.name + '-group'}>
            <img src = { x } alt = { 'remove ' + props.name }
            onClick = {() => 
                props.click(props.changeArgs.obj, props.changeArgs.index) }/>
            <input id = { props.name } type = {props.type}
            name = { props.name } placeholder = { props.placeholder }
            value = {props.value ? props.value : ''}
            onChange = {(e) => 
                props.change(e, props.changeArgs.obj, props.changeArgs.index)}/>
            <span className='bar'></span>
        </div>
        )
    } else if (props.mode === 'sub-inst') {
        return (
        <li>
            <input
              id = {props.name} name = {props.name} type = "text" placeholder = "instruction" 
              value = {props.value ? props.value : ''} 
              onChange = {(e) => 
                props.change(e, props.changeArgs.obj, props.changeArgs.index)}>
            </input>
            <span className='bar'></span>
            <img src = {x} alt = {'remove ' + props.name} onClick = {() => 
                {props.click(props.changeArgs.obj, props.changeArgs.index)}}/>
        </li>
        )
    } else if (props.mode === 'nutrition') {
        return (
            <div className='nutrition-input'>
                <label htmlFor = { props.name }>
                    {props.name !== 'carbohydrates' ? props.name.charAt(0).toUpperCase() + props.name.slice(1) + ': ' : 'Carbs: '}
                </label>
                    <div className='nutrition-group'>
                    <input id = { props.name } type = { props.type }
                    name = { props.name } value = {props.value ? props.value : ''} 
                    placeholder = {props.placeholder ? props.placeholder : ''}
                    onChange = {(e) => props.change(e)}
                    />
                    <span className='bar'></span>
                </div>
            </div>
        )
    }
return (
        <div className={props.name + '-group'}>
        <input 
            id = { props.name } type = {props.type}
            name = { props.name } placeholder = { props.placeholder }
            value = {props.value ? props.value : ''}
            onChange = {(e) => props.change(e)}
        />
            <span className='bar'></span>
        </div>
        )
    }

    export default Input;