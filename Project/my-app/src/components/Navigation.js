import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link } from 'react-router-dom';

// import '../assets/css/Navigation.scss';

function Navigation(props) {

    const minigames = [
        { title: "Minigame1", route: "/minigame1" },
        { title: "Minigame2", route: "/minigame2" },
        { title: "Minigame3", route: "/minigame3" },
      ];

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
                  DevWeb
                </Offcanvas.Title>
              </Offcanvas.Header> 
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  <Nav.Link as={Link} to="/">Home</Nav.Link>
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
                    <AuthentificationDisplays isLoggedIn={props.isLoggedIn} username={props.username}/>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
    </>
  );
}

function AuthentificationDisplays(props) {
    const isLoggedIn = props.isLoggedIn;
    if (!isLoggedIn){
        return  (
            <Button as={Link} to="/login">Log In</Button>
        )
    }
    else {
        return  (
            <>
                <p><i>Logged in as: <b>{props.username}</b></i></p>
                <Button as={Link} to="/">Logout</Button>
            </>
        )
    }
}

export default Navigation;