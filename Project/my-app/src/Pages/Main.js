import React from 'react';
import Button from 'react-bootstrap/Button';
import Background1 from '../components/Background1';

function Main (){
    const options = {
        solo: false,
        coop: false,
      }
    
    return (
        <>
        <Background1 />
        <div className="gameFrameContainer">
            <div className="gameFrame">  
                <h1>Main Page</h1>
                <div>
                <SoloOrCoop options={options}/>
                </div>
                <Button>How it works</Button>
            </div>
        </div>
        </>
    )
}

function SoloOrCoop(props) {
    const isSolo = props.options.solo;
    const isCoop = props.options.coop;
    if (!isSolo && !isCoop){
        return  (
            <>
            <h3>Play:</h3>
            <Button>Solo</Button>
            <Button>Coop</Button>
            </>
        )
    }
}

export default Main;