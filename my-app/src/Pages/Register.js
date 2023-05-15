import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  registerWithEmailAndPassword,
  signInWithGoogle,
} from "../firebase";

//Styles
import Button from 'react-bootstrap/Button';

//Components
import Background1 from '../components/Background1';


function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();
    const register = () => {

    if (!name) alert("Please enter name");
        registerWithEmailAndPassword(name, email, password);
    };
  
    useEffect(() => {
        if (loading) return;
        if (user) navigate('/dashboard', { replace: true })
    }, [user, loading]);
    
    return (
        <>
            <div className="register">
                <div className="register__container">
                    <h2>Register</h2>
                    <br />

                    <label for="fullName">Full Name</label>
                    <input
                    type="text"
                    id="fullName"
                    className="register__textBox"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.g Jane Doe"
                    />

                    <label for="emailAddress">Email Address:</label>
                    <input
                    type="text"
                    id="emailAddress"
                    className="register__textBox"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E.g janeDoe@email.com"
                    />

                    <label for="password">Password</label>
                    <input
                    type="password"
                    id="password"
                    className="register__textBox"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    />

                    <Button className="register__btn" onClick={register}>
                    Register
                    </Button>

                    <p>OR</p>

                    <Button
                    className="register__btn register__google"
                    onClick={signInWithGoogle}
                    >
                    Register with Google
                    </Button>

                    <div>
                        <p>Already have an account? &nbsp;
                            <Link to="/login">Login now</Link>
                        </p>
                    </div>
                </div>
            </div>
            <Background1 />
        </>
    );
}
export default Register;