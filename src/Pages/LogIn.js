import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword, signInWithGoogle } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {useLocation} from 'react-router-dom';

//Styles
import Button from 'react-bootstrap/Button';

//Components
import Background1 from '../components/Background1';

function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) {
        try {
            navigate(location.state.previousPath)
          } catch (err) {
            navigate("/dashboard");
          }
    }
  }, [user, loading]);
  
  return (
    <>
        <div className="login">
            <div className="login__container">
                <h2>Log In</h2>
                <br />

                <label for="emailAddress">Email Address:</label>
                <input
                type="text"
                id="emailAddress"
                className="login__textBox"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E.g janeDoe@email.com"
                />

                <label for="password">Password:</label>
                <input
                type="password"
                id="password"
                className="login__textBox"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                />
                <Button
                className="login__btn"
                onClick={() => logInWithEmailAndPassword(email, password)}
                >
                Login
                </Button>
                
                <p>OR</p>
                
                <Button className="login__btn login__google" onClick={signInWithGoogle}>
                Login with Google
                </Button>

                <div>
                    <Link to="/reset">Forgot Password</Link>
                </div>
                <div>
                    <p>Don't have an account? &nbsp;
                        <Link to="/register">Register now</Link> 
                    </p>
                </div>
            </div>
        </div>
        <Background1 />
    </>
  );
}

export default LogIn;