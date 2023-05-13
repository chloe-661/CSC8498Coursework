import React from 'react';
import Button from 'react-bootstrap/Button';
import {Link } from "react-router-dom";
import '../assets/css/Background.scss';
import Background1 from '../components/Background1';


function Home (){
    return (
        <>
        <Background1 />

        <div className="gameFrameContainer home">
          <div className="gameFrame">
            <div>
              <h1 className="title">DevWeb</h1>
              <h2>An online tool to improve your web development skills</h2>
              <h6>You can work by yourself and have a go at all tasks, or work in a group to split them.</h6>
              <p className="tinyText greenText">Aimed at beginners, but you will need a small amount of coding knowledge beforehand</p>
              <Button as={Link} to="/main">Get Stated</Button>
            </div>  
            
          </div>
        </div>
        {/* <h2>An online tool to improve your web development skills</h2>
              <h4>You can work by yourself and have a go at all tasks, or work in a group to split them.</h4>
              <p>Aimed at beginners, but you will need a small amount of coding knowledge beforehand</p> */}
      </>
    )
}

export default Home;