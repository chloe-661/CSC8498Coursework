import React from 'react';
// import '../assets/css/BackgroundAnimation.scss';

function Test (){
    return (
        <>
        <div class="hex--1">
            <svg xmlns="http://www.w3.org/2000/svg" width="270.11" height="649.9" overflow="visible">
            <g class="item-to bounce-1 hex" >
                {/* <path class="geo-arrow draw-in" d="M135.06 142.564L267.995 275.5 135.06 408.434 2.125 275.499z" /> */}
                {/* <polygon class="geo-arrow hexagon draw-in" points="300,150 225,280 75,280 0,150 75,20 225,20"></polygon> */}
                <polygon class="geo-arrow hexagon--1 draw-in" points="225,20 300,150 225,280 75,280 0,150 75,20"></polygon>
                <polygon class="geo-arrow hexagon--2 draw-in" points="75,280 0,150 75,20, 225,20 300,150 225,280"></polygon>
            </g>
            </svg>
        </div>
        <div class="hex--2">
            <svg xmlns="http://www.w3.org/2000/svg" width="270.11" height="649.9" overflow="visible">
            <g class="item-to bounce-1 hex" >
                {/* <path class="geo-arrow draw-in" d="M135.06 142.564L267.995 275.5 135.06 408.434 2.125 275.499z" /> */}
                {/* <polygon class="geo-arrow hexagon draw-in" points="300,150 225,280 75,280 0,150 75,20 225,20"></polygon> */}
                <polygon class="geo-arrow hexagon--3 draw-in" points="225,20 300,150 225,280 75,280 0,150 75,20"></polygon>
                <polygon class="geo-arrow hexagon--4 draw-in" points="225,280 75,280 0,150 75,20 225,20 300,150"></polygon>
                <polygon class="geo-arrow hexagon--5 draw-in" points="0,150 75,20 225,20 300,150 225,280 75,280"></polygon>
            </g>
            </svg>
        </div>
        <div class="hex--3">
            <svg xmlns="http://www.w3.org/2000/svg" width="270.11" height="649.9" overflow="visible">
            <g class="item-to bounce-1 hex" >
                {/* <path class="geo-arrow draw-in" d="M135.06 142.564L267.995 275.5 135.06 408.434 2.125 275.499z" /> */}
                {/* <polygon class="geo-arrow hexagon draw-in" points="300,150 225,280 75,280 0,150 75,20 225,20"></polygon> */}
                <polygon class="geo-arrow hexagon--3 draw-in" points="225,20 300,150 225,280 75,280 0,150 75,20"></polygon>
                <polygon class="geo-arrow hexagon--4 draw-in" points="225,280 75,280 0,150 75,20 225,20 300,150"></polygon>
                <polygon class="geo-arrow hexagon--5 draw-in" points="0,150 75,20 225,20 300,150 225,280 75,280"></polygon>
            </g>
            </svg>
        </div>
        <div class="arrow arrow--top">
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
      </div>
      <div class="main">
        <div class="main__text-wrapper">
        <h1 class="main__title">Transitions & Animations</h1>
        <h2>Combined with SVGs</h2>      
          <svg xmlns="http://www.w3.org/2000/svg" class="dotted" width="400" height="400" overflow="visible">
      {/* <circle cx="176" cy="176" r="174" fill="none" stroke="#fff" stroke-width="2" stroke-miterlimit="10" stroke-dasharray="12.921,11.9271"/> */}
      <polygon class="dotted-hex" points="225,20 300,150 225,280 75,280 0,150 75,20"></polygon>
      {/* <polygon class="dotted-circle" points="300,150 225,280 75,280 0,150 75,20 225,20" fill="none" stroke="#fff" stroke-width="2" stroke-miterlimit="10" stroke-dasharray="12.921,11.9271"></polygon> */}
      {/* <svg class="dotted-circle" width="45" height="45" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" fill="white" fill-opacity="0.01"/><path d="M48 0H0V48H48V0Z" fill="white" fill-opacity="0.01"/>
        <path d="M7 14L41 14" stroke="#333" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M7 34L24 4" stroke="#333" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M41 34L24 4" stroke="#333" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M41 34L7 34" stroke="#333" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M41 14L24 44" stroke="#333" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M7 14L24 44" stroke="#333" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M15.5 9L7 14V24V34L15.5 39L24 44L32.5001 39L41 34V24V14L32.5001 9L24 4L15.5 9Z" stroke="#333" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
        </svg> */}
    </svg>
        </div>
      </div>
      </>
    )
}

export default Test;