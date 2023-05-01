import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword, signInWithGoogle } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {useLocation} from 'react-router-dom';

//Styles
import Button from 'react-bootstrap/Button';
import "../assets/css/LogIn.scss";

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
                <input
                type="text"
                className="login__textBox"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail Address"
                />
                <input
                type="password"
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
                <Button className="login__btn login__google" onClick={signInWithGoogle}>
                Login with Google
                </Button>
                <div>
                <Link to="/reset">Forgot Password</Link>
                </div>
                <div>
                Don't have an account? <Link to="/register">Register</Link> now.
                </div>
            </div>
        </div>
        <Background1 />
    </>
  );
}

export default LogIn;