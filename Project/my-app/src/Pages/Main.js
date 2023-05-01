import React from 'react';
import { useState, useEffect } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth} from "../firebase";

//Styles
import Button from 'react-bootstrap/Button';

//Components
import Background1 from '../components/Background1';
import GameOptionsCard from '../components/GameOptionsCard';

function Main (){
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();
    
    
    
    const [gameMode, setGameMode] = useState(null); //Solo or Coop
    const [sessionStartType, setSessionStartType] = useState(null); //Start a new session or join an existing one
    
    const [sessionKey, setSessionKey] = useState(null); //e.g NHWUI91
    const [sessionDuration, setSessionDuration] = useState(null); //e.g 02:34 (2mins, 34 seconds)

    const [userRole, setUserRole] = useState(null); //e.g Builder, Styler, Database, etc

    useEffect(() => {
        console.log(gameMode);
        if (loading) return;
        if (!user) return navigate("/login", {state:{previousPath: "/main"}});
    });
    
    //Event Handlers --------------------------------------------------------------------------------------------
    
    function soloOrCoopButtonClick(e, mode) {
        setGameMode(mode);
    }

    //Element Display Functions --------------------------------------------------------------------------------
    function SoloOrCoop() {
        if (gameMode == null){
            return  (
                <>
                <GameOptionsCard img="" title="SOLO" text="Play by yourself" buttonText="Play">
                    <Button onClick={(e)=>soloOrCoopButtonClick(e, 'solo')}>Play</Button>
                </GameOptionsCard>
                
                <GameOptionsCard img="" title="CO-OP" text="Play with up to 4 other people in a team">
                    <Button onClick={(e)=>soloOrCoopButtonClick(e, 'coop')}>Play</Button>
                </GameOptionsCard>
                </>
            )
        }
    }

    function StartOrJoinSession() {
        if (gameMode == "coop"){
            return  (
                <>
                <GameOptionsCard img="" title="Start" text="Play by yourself" buttonText="Play">
                    <Button onClick={(e)=>soloOrCoopButtonClick(e, 'solo')}>Play</Button>
                </GameOptionsCard>
                
                <GameOptionsCard img="" title="Join" text="Play with up to 4 other people in a team">
                    <Button onClick={(e)=>soloOrCoopButtonClick(e, 'coop')}>Play</Button>
                </GameOptionsCard>
                </>
            )
        }
    }
    
    return (
        <>
        <Background1 />
        <div className="gameFrameContainer">
            <div className="gameFrame">  
                <h1>Main Page</h1>
                <div>
                <SoloOrCoop/>
                <StartOrJoinSession/>
                </div>
                <Button className="red">How it works</Button>
            </div>
        </div>
        </>
    )
}

export default Main;