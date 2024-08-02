import logo from './logo.svg';
import './App.css';
import SignUpForm from './Login-Signup/SignUpForm';
import LoginForm from './Login-Signup/LoginForm';
import Dashboard from './Dashboard/Dashboard';
import Chessboard from './components/Chessboard/Chessboard';

import {BrowserRouter, Routes, Route} from 'react-router-dom';


function App() {
  return (
    <>
      {/* Commented out code
      <div className="App">
        <header className="App-header">
          <SignUpForm /> 
          
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a> 
        </header>
      </div> */}

      <BrowserRouter>
        <Routes>
          <Route path='/signup' element={<SignUpForm />}></Route>
          <Route path='/login' element={<LoginForm />}></Route>
          <Route path='/dashboard' element={<Dashboard />}></Route>
          <Route path='/chessboard' element={<Chessboard />}></Route>
        
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
