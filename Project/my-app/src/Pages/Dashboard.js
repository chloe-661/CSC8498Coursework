import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";

//Styles
import Button from 'react-bootstrap/Button';

//Components
import Background1 from '../components/Background1';

function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const fetchUserName = async () => {
    try {
        console.log("trying");
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login", {state:{previousPath: "/dashboard"}});
    fetchUserName();
  }, [user, loading]);
  return (
    <>
        <div className="dashboard">
            <div className="dashboard__container">
                <h2>Logged in as:</h2>
                <div>
                    <p>{name}</p>
                    <p>{user?.email}</p>
                </div>
                <Button className="dashboard__btn" onClick={logout}>
                Logout
                </Button>
            </div>
        </div>
        <Background1 />
     </>
  );
}
export default Dashboard;