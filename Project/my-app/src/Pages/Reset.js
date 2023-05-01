import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { auth, sendPasswordReset } from "../firebase";

//Styles
import Button from 'react-bootstrap/Button';

//Components
import Background1 from '../components/Background1';

function Reset() {
  const [email, setEmail] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) return;
    if (user) navigate("/dashboard");
  }, [user, loading]);
  return (
    <>
        <div className="reset">
            <div className="reset__container">
                <h2>Reset your password</h2>
                <br />

                <label for="emailAddress">Email Address:</label>
                <input
                type="text"
                id="emailAddress"
                className="reset__textBox"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E.g JaneDoe@email.com"
                />
                <Button
                className="reset__btn"
                onClick={() => sendPasswordReset(email)}
                >
                Send password reset email
                </Button>
                <div>
                    <p> Don't have an account? &nbsp;
                        <Link to="/register">Register now</Link>
                    </p>
                </div>
            </div>
        </div>
        <Background1 />
    </>
  );
}
export default Reset;