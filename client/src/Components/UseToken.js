import {useState} from 'react'

const UseToken = () => {
    const getToken = () => {
        const tokenString = sessionStorage.getItem('token'); // Gets the current item from session storage corresponding to the 'token' key
        const userToken = JSON.parse(tokenString) // Takes that string and converts it back into an object
        return userToken?.token // Returns the property denoted by token if it exists.
    };

    const [token, setToken] = useState(getToken()); // The token value will be initialized to whatever exists in storage

    const saveToken = (userToken) => {
        sessionStorage.setItem('token', JSON.stringify(userToken)); // The new token is converted to JSON
        setToken(userToken.token); // The component's token state is set to the value provided by the user
    };

    return {
        setToken: saveToken,
        token
    }
}

export default UseToken