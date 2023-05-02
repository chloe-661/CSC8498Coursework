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
import Instructions from '../components/Instructions';

function Main (){
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();
    
    
    
    const [gameMode, setGameMode] = useState(null); //Solo or Coop
    const [sessionStartType, setSessionStartType] = useState(null); //Start a new session or join an existing one
    
    const [inputtedSessionKey, setInputtedSessionKey] = useState(null); //e.g The users attempt to add a session key
    const [sessionKey, setSessionKey] = useState(null); //A valid session that can be joined
    const [sessionDuration, setSessionDuration] = useState(null); //e.g 02:34 (2mins, 34 seconds)
    const [sessionPeople, setSessionPeople] = useState(null); //How many people in the group

    const [userRole, setUserRole] = useState(null); //e.g Builder, Styler, Database, etc

    useEffect(() => {
        console.log("gameMode: " + gameMode);
        console.log("inputtedSessionKey: " + inputtedSessionKey);
        console.log("sessionKey: " + sessionKey);
        console.log("sessionPeople: " + sessionPeople);

        if (loading) return;
        if (!user) return navigate("/login", {state:{previousPath: "/main"}});
    });
    
    //Event Handlers --------------------------------------------------------------------------------------------
    
    function soloOrCoopButtonClick(e, mode) {
        setGameMode(mode);
    }

    function startOrJoinClick(e, type) {
        setSessionStartType(type);

        if (type == "start"){
            setSessionPeople(1);
        }
        //NEED TO ADD SESSION KEY AUTH IN HERE AND RESET sessionKey if it is invalid
    }

    function beginGame(e) {
        console.log("beginning game");
    }

    //Element Display Functions --------------------------------------------------------------------------------
    function SoloOrCoop() {
        if (gameMode == null){
            return  (
                <>
                <h1 class="title2">GAME MODE</h1>
                <GameOptionsCard className="card-options" title="SOLO" text="Play by yourself and make it a challenge" img="https://raw.githubusercontent.com/chloe-661/CSC8498Coursework/main/Project/my-app/src/assets/img/solo-img.png?token=GHSAT0AAAAAACBJF5EI4SPDDXPU2IXCVI4YZCQJK4A">
                    <Button onClick={(e)=>soloOrCoopButtonClick(e, 'solo')}>Play</Button>
                </GameOptionsCard>
                
                <GameOptionsCard className="card-options" title="CO-OP" text="Play with up to 4 other people in a team" img="https://drive.google.com/file/d/1-7aiubacJspAAGAD5uELwfWJwBCX5tDI/preview">
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
                <h1 class="title2">CO-OP</h1>
                <GameOptionsCard className="card-options" title="START A NEW SESSION" text="Start a new session for you and your friends" img="">
                    <Button onClick={(e)=>startOrJoinClick(e, 'start')}>Start</Button>
                </GameOptionsCard>
                
                <GameOptionsCard className="card-options" title="JOIN AN EXISTING SESSION" text="Join a friends session by entering the session key they gave you" img="">
                    <div> 
                        <input
                            type="text"
                            id="sessionKey"
                            className="sessionKey__textBox"
                            value={inputtedSessionKey}
                            onChange={(e) => setInputtedSessionKey(e.target.value)}
                            placeholder="E.g NH63HY"
                        />
                    </div>
                    <Button onClick={(e) => startOrJoinClick(e, 'join')}>Join</Button>
    
                </GameOptionsCard>
                </>
            )
        }
    }

    function generateKey(){
        //CONTACT DB AND MAKE KEY
        const key = "NHTWKU"
        if (!sessionKey) {
            setSessionKey(key);
        }

    }

    function StartSession(){
        if (sessionStartType == "start"){
            console.log("generating key");
            if (sessionKey == null) {
                generateKey();
            }
            return (
                <>
                    <h1 class="title2">NEW SESSION</h1>
                    <GameOptionsCard className="card-options" title="SESSION KEY" sessKey={sessionKey} text="Give your friends this code and ask them to input it in the “Join Group Session” section of the “Co-op” page" img="">
                    </GameOptionsCard>

                    <GameOptionsCard className="card-options" title="PEOPLE JOINED" number={sessionPeople} tinyText="max: 4" text="Wait until everyone has joined..." img="">
                        <Button onClick={(e)=>beginGame(e)}>Start</Button>
                    </GameOptionsCard>
                </>
            )

        }
    }

    function JoinAndWait(){
        if (sessionStartType == "join"){
            console.log("generating key");
            return (
                <>
                    <h1 class="title2">JOINING SESSION</h1>
                    <GameOptionsCard className="card-options" title="JOINING A SESSION" text="Waiting for the leader to start the game..." img="">
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
                <div>
                {/* <SoloOrCoop/> */}
                {/* <StartOrJoinSession/> */}
                {SoloOrCoop()}
                {StartOrJoinSession()}
                {StartSession()}
                {JoinAndWait()}
                </div>
                <Button className="btn-instructions">How it works</Button>
                {/* <Instructions /> */}
            </div>
        </div>
        </>
    )
}

export default Main;