import { useState, FormEvent, ChangeEvent } from "react";
import { Link } from "react-router-dom";  // Import the Link component from react-router-dom

import Auth from '../utils/auth';  // Import the Auth utility for managing authentication state
import { login } from "../api/authAPI";  // Import the login function from the API
import { UserLogin } from "../interfaces/UserLogin";  // Import the interface for UserLogin

const Login = () => {
  // State to manage the login form data
  const [loginData, setLoginData] = useState<UserLogin>({
    username: '',
    password: ''
  });

  const [errorMessage, setErrorMessage] = useState<string>('');  // State to manage

  // Handle changes in the input fields
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value
    });
  };

  // Handle form submission for login
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate the data
    if (loginData.username === '' || loginData.password === '') {
      setErrorMessage('Please enter a username and password');
      return;
    }
    
    // Call the login API endpoint with loginData
    // Doing this as an execution chain to properly catch the Promise rejection message
    await login(loginData)
      .then(data => {
        Auth.login(data.token);
      })
      .catch(err => {
        console.error('Failed to login: ', err);  // Log any errors that occur during login
        setErrorMessage(err.message);  // Show the error message received from the server
      })
  };

  return (
    <div className='form-container'>
      <form className='form login-form' onSubmit={handleSubmit}>
        <h1>Login</h1>
        {/* Username input field */}
        <div className="form-group">
          <label>Username</label>
          <input 
            className="form-input"
            type='text'
            name='username'
            value={loginData.username || ''}
            onChange={handleChange}
          />
        </div>
        {/* Password input field */}
        <div className="form-group">
          <label>Password</label>
          <input 
            className="form-input"
            type='password'
            name='password'
            value={loginData.password || ''}
            onChange={handleChange}
          />
        </div>
        {/* Submit button for the login form */}
        <div className="form-group">
          <button className="btn" type='submit'>Login</button>
        </div>
        <p className="error">{errorMessage}</p>
      </form>
      <Link className="signupLink" to='/signup'>
        <p>No account? Click here to create one!</p>
        <p>No account? Tap here to create one!</p>
      </Link>
    </div>
  )
};

export default Login;
