import { useState, useEffect } from 'react';

//Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/Main.scss';

//Components
import Navigation from './components/Navigation';

//Navigation
import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import LogIn from './Pages/LogIn';
import Register from './Pages/Register';
import Reset from './Pages/Reset';
import MainGame from './Pages/Main';
import Minigames from './Pages/Minigames';
import MiniGame1 from './Pages/MiniGame1';
import MiniGame2 from './Pages/MiniGame2';
import Page404 from './Pages/Page404';
import Test from './Pages/Test';

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [username, setUsername] = useState("Chloe");

  return (
    <div className="App">
      <header className="App-header">
        <Navigation isLoggedIn={isLoggedIn} username={username}/>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/test" element={<Test />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/main" element={<MainGame />} />
          <Route path="/minigames" element={<Minigames />} />
          <Route path="/minigame1" element={<MiniGame1 />} />
          <Route path="/minigame2" element={<MiniGame2 />} />
          <Route path="*" element={<Page404 />} />
       </Routes>
      </header>
    </div>
  );
}

export default App;
