import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link } from 'react-router-dom';

import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, logout } from "../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";

// import '../assets/css/Navigation.scss';

function Navigation(props) {

    const minigames = [
        { title: "Minigame1", route: "/minigame1" },
        { title: "Minigame2", route: "/minigame2" },
        { title: "Minigame3", route: "/minigame3" },
      ];

  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");

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
    AuthentificationDisplays();
  }, [user, loading]);

  function AuthentificationDisplays() {
    if (!user){
        return  (
          <>
            <Button as={Link} to="/login">Log In</Button>
            <Button as={Link} to="/register">Register</Button>
          </>
        )
    }
    else {
      fetchUserName();
        return  (
            <>
                <p><i>Logged in as: <span class="greenText">{name}</span></i></p>
                <Button as={Link} to="/" onClick={() => logout()}>Logout</Button>
            </>
        )
    }
}

  return (
    <>
        <Navbar key={false} bg="light" expand={false} className="mb-3">
          <Container fluid>
            <Navbar.Brand as={Link} to="/"><img src={require('../assets/img/code-icon.png')} className="logo" />DevWeb</Navbar.Brand>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${false}`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${false}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${false}`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${false}`}>
                <img src={require('../assets/img/code-icon.png')} className="logoOffCanvas" />
                DevWeb
                </Offcanvas.Title>
              </Offcanvas.Header> 
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  <Nav.Link as={Link} to="/">Home</Nav.Link>
                  <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                  <Nav.Link as={Link} to="/main">Main Game</Nav.Link>
                  <NavDropdown
                    title="Minigames"
                    id={`offcanvasNavbarDropdown-expand-${false}`}
                  >
                    {minigames.map(({ title, route }) => (
                        <NavDropdown.Item as={Link} to={route}>{title}</NavDropdown.Item>
                    ))}
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={Link} to="/minigames" >
                      All
                    </NavDropdown.Item>
                  </NavDropdown>

                    <hr/>
                    <AuthentificationDisplays />
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
    </>
  );
}

export default Navigation;