// rafce = readable stream default controller

import React, { useState } from 'react';
// linking the css
import './style.css';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, query, collection, where, getDocs } from 'firebase/firestore';

const SignUpForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    // for redirection
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            // Validate input
            if (!email || !password || !username) {
                throw new Error('All fields are required.');
            }

            // username already exists
            const usernameQuery = query(collection(db, 'users'), where('username', '==', username));
            const usernameQuerySnapshot = await getDocs(usernameQuery);

            if (!usernameQuerySnapshot.empty) {
                throw new Error('Username already exists');
            }

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Store additional user information in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                username: username,
                email: email
            });
            console.log("Account Created!");
            navigate('/login');
        } catch (error) {
            console.error('Error during sign-up:', error);
            if (error.message === 'Username already exists') {
                alert('Username is already taken. Please choose a different username.');
            } else if (error.code === 'auth/email-already-in-use') {
                alert('Email is already in use. Please use a different email.');
            } else if (error.code === 'auth/invalid-email') {
                alert('Invalid email address. Please enter a valid email.');
            } else if (error.code === 'auth/weak-password') {
                alert('Password is too weak. Please enter a stronger password.');
            } else {
                alert('An error occurred: ' + error.message);
            }
        }
    }
    return (
        <div className='signup-container'>
            <div className='logo-container'>
                <div className='logo'></div>
                <span className='logo-name'>MiSan Tech</span>
            </div>
            <form className='signup-form' onSubmit={handleSubmit}>
                <h2>Sign Up</h2>
                {/* username */}
                <label htmlFor='username' className='form-group'>
                    <span>Username:</span>
                    <input
                        type='text'
                        id='username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </label>
                {/* email */}
                <label htmlFor='email' className='form-group'>
                    <span>Email:</span>
                    <input
                        type='text'
                        id='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                <button type='submit'>Sign Up</button> <br />
                <p>Already Have An Account? <Link to="/login">Login</Link></p>
            </form>
        </div>
    )
}

export default SignUpForm;