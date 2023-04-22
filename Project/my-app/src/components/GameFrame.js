import React from 'react';

function GameFrame (){
    const mystyle = {
        backgroundColor: "blue",
        paddingTop: "4.5rem",
        paddingBottom: "1rem",
        paddingLeft: "1rem",
        paddingRight: "1rem",
        fontFamily: "Arial",
        width: "100%",
        height: "100vh",
        minWidth: "1080px",
        minHeight: "520px",
      };

    return (
        <div style={mystyle}>
        </div>
    )
}

export default GameFrame;