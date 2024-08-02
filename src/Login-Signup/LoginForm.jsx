// rafce = readable stream default controller

import React, { useState } from 'react';
// linking the css
import './style.css';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';  // Corrected import
import { query, where, getDocs, collection } from 'firebase/firestore';

const LoginForm = () => {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // for redirection
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            let email = emailOrUsername;

            // checking if email or username
            if (!email.includes('@')) {
                const userQuery = query(
                    collection(db, 'users'),
                    where('username', '==', emailOrUsername)
                );
                const querySnapshot = await getDocs(userQuery);
                console.log('Query snapshot:', querySnapshot);

                if (!querySnapshot.empty) {
                    const userDoc = querySnapshot.docs[0].data();
                    email = userDoc.email;
                    console.log('Found email:', email);
                } else {
                    console.log('User not found in database');
                    throw new Error('User not found');

                }
            }

            // Authenticate with email and password
            console.log('Attempting to sign in with:', email);
            await signInWithEmailAndPassword(auth, email, password);
            console.log("Login Successfully!");
            navigate('/dashboard');
        } catch (error) {
            console.error('Firebase error:', error);
            if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                alert('Invalid credentials. Please check your email/username and password.');
            } else if (error.code === 'auth/user-not-found') {
                alert('User not found. Please check your email or username.');
            } else if (error.code === 'auth/invalid-email') {
                alert('Invalid email address. Please enter a valid email.');
            } else if (error.code === 'auth/too-many-requests') {
                alert('Too many failed login attempts. Please try again later.');
            } else if (error.message === 'User not found') {
                alert('User not found. Please check your username.');
            } else {
                // General error message
                alert(`An error occurred: ${error.message}`);
            }
        }
    };

    return (
        <div className='signup-container'>
            <div className='logo-container'>
                <div className='logo'></div>
                <span className='logo-name'>MiSan Tech</span>
            </div>
            <form className='signup-form' onSubmit={handleSubmit}>
                <h2>Login</h2>
                {/* email or username */}
                <label htmlFor='emailOrUsername' className='form-group'>
                    <span>Email or Username:</span>
                    <input
                        type='text'
                        id='emailOrUsername'
                        value={emailOrUsername}
                        onChange={(e) => setEmailOrUsername(e.target.value)}
                    />
                </label>
                {/* password */}
                <label htmlFor='password' className='form-group'>
                    <span>Password:</span>
                    <input
                        type='password'
                        id='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                {/* submit button */}
                <button type='submit'>Login</button> <br />
                <p>Don't Have An Account? <Link to="/signup">Register</Link></p>
            </form>
        </div>
    );
};

export default LoginForm;
