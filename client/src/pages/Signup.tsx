import { useState, FormEvent, ChangeEvent } from "react";
import { UserSignup } from "../interfaces/UserSignup";
import Auth from "../utils/auth";
import { signup } from "../api/authAPI";

const Signup = () => {
    // State to manage the signup foprm data
    const [signupData, setSignupData] = useState<UserSignup>({
        username: '',
        password: '',
        email: '',
        confirmPassword: ''
    });

    const [errorMessage, setErrorMessage] = useState<string>('');

    // Handle changes in the input fields
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSignupData({
            ...signupData,
            [name]: value
        });
    };

    // Handle form submission for login
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // Validate the data
        if ( signupData.username === '' ||
             signupData.email === '' ||
             signupData.password === '' ||
             signupData.confirmPassword === '') {
            setErrorMessage('All fields are required');
            return;
        } else if (signupData.password !== signupData.confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }
    
        // Call the signup API endpoint with loginData
        // Doing this as an execution chain to properly catch the Promise rejection message
        signup(signupData)
            .then(data => {
                Auth.login(data.token);
            })
            .catch(err => {
                console.error('Failed to signup: ', err);  // Log any errors that occur during login
                setErrorMessage(err.message);  // Show the error message received from the server
            })        
    };

    return (
        <div className="form-container">            
            <form className="form" onSubmit={handleSubmit}>
                <h1>Create New Account</h1>
                {/* Username input field */}
                <div className="form-group">
                    <label>Username</label>
                    <input
                        className="form-input"
                        type='text'
                        name='username'
                        value={signupData.username || ''}
                        onChange={handleChange}
                     />
                </div>
                {/* Email input field */}
                <div className="form-group">
                    <label>Email</label>
                    <input
                        className="form-input"
                        type="text"
                        name="email"
                        value={signupData.email || ''}
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
                        value={signupData.password || ''}
                        onChange={handleChange}
                    />
                </div>
                {/* Confirm Password input field */}
                <div className="form-group">
                    <label>Confirm Password</label>
                    <input
                        className="form-input"
                        type='password'
                        name='confirmPassword'
                        value={signupData.confirmPassword || ''}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <button className="btn btn-primary" type='submit'>Sign Up</button>
                </div>
                <p className="error">{errorMessage}</p>
            </form>
        </div>
    )
}

export default Signup;