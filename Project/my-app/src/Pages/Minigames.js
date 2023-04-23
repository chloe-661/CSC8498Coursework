import React from 'react';
import MiniGameDisplayCard from '../components/MiniGameDisplayCard';
import Background1 from '../components/Background1';

function Minigames (){
    //List of all minigames and their details
    const games = [
        { title: "Minigame1", description: "bdshjl", src: "https://img.freepik.com/free-vector/earth-view-night-from-alien-planet-neon-space_33099-1876.jpg?w=1380&t=st=1682210995~exp=1682211595~hmac=e22c75ad99cb287c1190be793194e05e6e3524c68bf324d434e644340cbec71e", route: "/minigame1" },
        { title: "Minigame2", description: "bfdbsdshjl", src: "https://img.freepik.com/free-vector/space-game-background-neon-night-alien-landscape_107791-1624.jpg?w=1380&t=st=1682210963~exp=1682211563~hmac=9506265f88b84ad003af5138d63fe16b7eaaac1d295eeeef8d0281aa775d354e", route: "/minigame2" },
        { title: "Minigame3", description: "bdshjgsbsl", src: "https://img.freepik.com/free-vector/space-background-with-landscape-planet_107791-1083.jpg?w=1380&t=st=1682211197~exp=1682211797~hmac=aad9a2f134f6e7e54851a99045bab37ffca582cfae9abc249fda79bc793ab87a", route: "/minigame3" },
      ];

    return (
        <>
        <Background1 />

        <div className="gameFrameContainer">
          <div className="gameFrame">  
            <h1>Minigames</h1>
            {games.map(({ title, description, src, route }) => (
                    <MiniGameDisplayCard key={title} title={title} text={description} img={src} path={route} />
                ))}
          </div>
        </div>
        </>
      );
}

export default Minigames;