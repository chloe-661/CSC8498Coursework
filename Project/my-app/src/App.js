// import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/main.scss';

//Navigation
import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import LogIn from './Pages/LogIn';
import MainGame from './Pages/Main';
import Minigames from './Pages/Minigames';
import MiniGame1 from './Pages/MiniGame1';
import MiniGame2 from './Pages/MiniGame2';
import Page404 from './Pages/Page404';
import Test from './Pages/Test';

//Components
import Navigation from './components/Navigation';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Navigation isLoggedIn="true" username="chloe"/>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/test" element={<Test />} />
          <Route path="/login" element={<LogIn />} />
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
