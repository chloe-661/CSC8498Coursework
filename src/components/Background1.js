import React from 'react';
import Button from 'react-bootstrap/Button';
import {Link } from "react-router-dom";
// import '../assets/css/BackgroundAnimation.scss';
import '../assets/css/Background.scss';


function Background1 (){
    return (
        <>
          {/* <div class="hex--1">
              <svg xmlns="http://www.w3.org/2000/svg" width="270.11" height="649.9" overflow="visible">
              <g class="item-to bounce-1 hex" >
                  <polygon class="geo-arrow hexagon--1 draw-in" points="225,20 300,150 225,280 75,280 0,150 75,20"></polygon>
                  <polygon class="geo-arrow hexagon--2 draw-in" points="75,280 0,150 75,20, 225,20 300,150 225,280"></polygon>
              </g>
              </svg>
          </div>
          <div class="hex--2">
              <svg xmlns="http://www.w3.org/2000/svg" width="270.11" height="649.9" overflow="visible">
              <g class="item-to bounce-2 hex" >
                  <polygon class="geo-arrow hexagon--3 draw-in" points="225,20 300,150 225,280 75,280 0,150 75,20"></polygon>
                  <polygon class="geo-arrow hexagon--4 draw-in" points="225,280 75,280 0,150 75,20 225,20 300,150"></polygon>
                  <polygon class="geo-arrow hexagon--5 draw-in" points="0,150 75,20 225,20 300,150 225,280 75,280"></polygon>
              </g>
              </svg>
          </div> */}
          {/* <div class="hex--3">
              <svg xmlns="http://www.w3.org/2000/svg" class="dotted" width="450" height="450" overflow="visible">
                  <polygon class="dotted-hex" points="225,20 300,150 225,280 75,280 0,150 75,20"></polygon>
              </svg>
          </div> */}
          <div className="hex--3">
              <svg xmlns="http://www.w3.org/2000/svg" className="hexsvg--1 dotted-line " width="270" height="270" overflow="visible">
                  <polygon className="main-hex--1" points="225,20 300,150 225,280 75,280 0,150 75,20"></polygon>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" className="hexsvg--2 filled" width="270" height="270" overflow="visible">
                  <polygon className="main-hex--2" points="225,20 300,150 225,280 75,280 0,150 75,20"></polygon>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" className="hexsvg--3 solid-thin-line" width="270" height="270" overflow="visible">
                  <polygon className="main-hex--3 draw-in" points="225,20 300,150 225,280 75,280 0,150 75,20"></polygon>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" className="hexsvg--4 solid-thin-line" width="270" height="270" overflow="visible">
                  <polygon className="main-hex--4 draw-in" points="225,280 75,280 0,150 75,20 225,20 300,150"></polygon>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" className="hexsvg--5 dotted-line" width="210" height="210" overflow="visible">
                  <polygon className="main-hex--5 item-to bounce-1" points="225,20 300,150 225,280 75,280 0,150 75,20"></polygon>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" className="hexsvg--6 solid-thick-dotted-line--1" width="210" height="210" overflow="visible">
                  <polygon className="main-hex--6" points=" 75,20 225,20 300,150 225,280 75,280 0,150"></polygon>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" className="hexsvg--7 solid-thick-dotted-line--2" width="150" height="150" overflow="visible">
                  <polygon className="main-hex--7 item-to bounce-2" points="300,150 225,280 75,280 0,150 75,20 225,20"></polygon>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" className="hexsvg--8 filled" width="90" height="90" overflow="visible">
                  <polygon className="main-hex--8" points="225,20 300,150 225,280 75,280 0,150 75,20"></polygon>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" className="hexsvg--9 filled" width="90" height="90" overflow="visible">
                  <polygon className="main-hex--9" points="225,20 300,150 225,280 75,280 0,150 75,20"></polygon>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" className="hexsvg--10 dotted-line" width="150" height="150" overflow="visible">
                  <polygon className="main-hex--10 item-to bounce-3" points="225,20 300,150 225,280 75,280 0,150 75,20"></polygon>
              </svg>
          </div>
          {/* <div class="arrow arrow--top">
          <svg xmlns="http://www.w3.org/2000/svg" width="270.11" height="649.9" overflow="visible">
            <circle class="geo-arrow item-to bounce-2" cx="194.65" cy="69.54" r="7.96" />
            <circle class="geo-arrow draw-in" cx="194.65" cy="39.5" r="7.96" />
            <circle class="geo-arrow item-to bounce-3" cx="194.65" cy="9.46" r="7.96" />
            <g class="geo-arrow item-to bounce-2">
              <path class="st0 draw-in" d="M181.21 619.5l13.27 27 13.27-27zM194.48 644.5v-552" />
            </g>
          </svg>
        </div>
        <div class="arrow arrow--bottom">
          <svg xmlns="http://www.w3.org/2000/svg" width="31.35" height="649.9" overflow="visible">
            <g class="item-to bounce-1">
              <circle class="geo-arrow item-to bounce-3" cx="15.5" cy="580.36" r="7.96" />
              <circle class="geo-arrow draw-in" cx="15.5" cy="610.4" r="7.96" />
              <circle class="geo-arrow item-to bounce-2" cx="15.5" cy="640.44" r="7.96" />
              <g class="item-to bounce-2">
                <path class="geo-arrow draw-in" d="M28.94 30.4l-13.26-27-13.27 27zM15.68 5.4v552" />
              </g>
            </g>
          </svg>
        </div> */}
        {/* <div class="main">
          <div class="main__text-wrapper">
          <h1 class="main__title">Home Page</h1>
          <Button as={Link} to="/main">Get Started</Button>     
            
          </div>
        </div> */}
      </>
    )
}

export default Background1;