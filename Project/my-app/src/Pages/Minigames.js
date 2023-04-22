import React from 'react';
import MiniGameDisplayCard from '../components/MiniGameDisplayCard';
import '../assets/css/Styles.css';
import Background1 from '../components/Background1';

function Minigames (){
    //List of all minigames and their details
    const games = [
        { title: "Minigame1", description: "bdshjl", src: "", route: "/minigame1" },
        { title: "Minigame2", description: "bfdbsdshjl", src: "", route: "/minigame2" },
        { title: "Minigame3", description: "bdshjgsbsl", src: "", route: "/minigame3" },
      ];

    return (
        <>
        <Background1 />
        <div className="gameFrame">
            <h1>Minigames</h1>
            
            {games.map(({ title, description, src, route }) => (
                <MiniGameDisplayCard key={title} title={title} text={description} img={src} path={route} />
            ))}
        </div>
        </>
      );
}

export default Minigames;