import React from 'react';
import Button from 'react-bootstrap/Button';
import {Link } from "react-router-dom";
// import '../assets/css/BackgroundAnimation.scss';
import '../assets/css/Background.scss';
// import '../assets/css/main.scss'
import Background1 from '../components/Background1';


function Home (){
    return (
        <>
        <Background1 />

        <div className="gameFrameContainer home">
          <div className="gameFrame">  
            <h1 className="title">HOME PAGE</h1>
            <h2>Lorem ipsum dolor sit amet. Et quae unde sit rerum pariatur qui enim dolorem in dignissimos magnam non internos nulla? Sed obcaecati voluptatem eum similique corrupti aut vero suscipit et dolorum impedit ea magni dolorum.</h2>
            <Button>Get Started</Button>
          </div>
        </div>
      </>
    )
}

export default Home;