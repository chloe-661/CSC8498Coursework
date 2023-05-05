import React from 'react';
import { useState, useEffect } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { 
    auth, 
    getWebStacks, //Gets all the different webstacks available
    getAllTaskSets, //Gets all task sets but NOT the tasks within
    getAllTaskSetsAndTasks, //Gets all sets + the tasks in them
    getAllTaskSetsIdsWithWebStack, //Gets all task set ids that match a webstack type
    getAllTaskswithinTaskSet //Gets all the tasks within a task set but ONLY gets the task information
} from "../firebase";

//Styles
import Button from 'react-bootstrap/Button';

//Components
import Background1 from '../components/Background1';
import GameOptionsCard from '../components/GameOptionsCard';
import Instructions from '../components/Instructions';
import TaskListDashboard from '../components/TaskListDashboard';
import SessionDurationStats from '../components/SessionDurationStats';
import TaskDashboard from '../components/TaskDashboard';

function Main (){
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();
    const [modalShow, setModalShow] = useState(false);
    
    
    //Options to choose from before starting a game
    const [gameMode, setGameMode] = useState(null); //Solo or Coop
    const [sessionStartType, setSessionStartType] = useState(null); //Start a new session or join an existing one
    
    const [inputtedSessionKey, setInputtedSessionKey] = useState(null); //e.g The users attempt to add a session key
    const [sessionKey, setSessionKey] = useState(null); //A valid session that can be joined
    const [sessionPeople, setSessionPeople] = useState(null); //How many people in the group

    const [sessionDuration, setSessionDuration] = useState(null); //e.g 02:34 (2mins, 34 seconds)
    const [sessionStarted, setSessionStarted] = useState(false); //e.g 02:34 (2mins, 34 seconds)

    const [userRole, setUserRole] = useState(null); //e.g Builder, Styler, Database, etc


    //Hooks -----------------------------------------------------------------------------------------------------
    useEffect(() => {
        console.log("gameMode: " + gameMode);
        console.log("inputtedSessionKey: " + inputtedSessionKey);
        console.log("sessionKey: " + sessionKey);
        console.log("sessionPeople: " + sessionPeople);

        if (loading) return;
        
        //If the user is not logged in, it redirects to the login page
        if (!user) {
            return (
                navigate("/login", {state:{previousPath: "/main"}})
            )
        }
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

    //Resets the state if the user presses the go back button based on what section they were at
    function goBackClick(e, num){
        switch(num){
            case 1:
                setGameMode(null);
                break;
            case 2:
                setSessionStartType(null);
                setInputtedSessionKey(null);
                setSessionKey(null);
                setSessionPeople(null);
                break;
        }
    }

    function beginGameClick(e) {
        console.log("beginning game");
        beginGame();
    }

    //Element Display Functions --------------------------------------------------------------------------------
    
    function optionBoards(){
        if (!sessionStarted) {
            if (gameMode == null) {
                return (
                    <>
                        <h1 class="title2">GAME MODE</h1>
                        <Button className="btn-instructions" onClick={() => setModalShow(true)}>How it works</Button>
                        <GameOptionsCard className="card-options" title="SOLO" text="Play by yourself and make it a challenge" img="https://raw.githubusercontent.com/chloe-661/CSC8498Coursework/main/Project/my-app/src/assets/img/solo-img.png?token=GHSAT0AAAAAACBJF5EI4SPDDXPU2IXCVI4YZCQJK4A">
                            <Button onClick={(e)=>soloOrCoopButtonClick(e, 'solo')}>Play</Button>
                        </GameOptionsCard>
                        
                        <GameOptionsCard className="card-options" title="CO-OP" text="Play with up to 4 other people in a team" img="https://drive.google.com/file/d/1-7aiubacJspAAGAD5uELwfWJwBCX5tDI/preview">
                            <Button onClick={(e)=>soloOrCoopButtonClick(e, 'coop')}>Play</Button>
                        </GameOptionsCard>
                    </>
                )
            }
            else if (gameMode == "coop"){
                if (sessionStartType == "start"){
                    startSession();
                    if (sessionKey == null) {
                        generateKey();
                    }
                    return (
                        <>
                            <h1 class="title2">NEW SESSION</h1>
                            <Button className="btn-instructions">Need Help?</Button>
                            <GameOptionsCard className="card-options" 
                                title="SESSION KEY"
                                topLine="--------------------" 
                                bigText={sessionKey} 
                                bottomLine="--------------------" 
                                text="&nbsp;&nbsp;&nbsp;Give your friends this code &nbsp;&nbsp;&nbsp; Ask them to input it in the “Join Group Session” section of the “Co-op” page" 
                                >
                            </GameOptionsCard>

                            <GameOptionsCard className="card-options" 
                                title="PEOPLE JOINED" 
                                bigNumber={sessionPeople}
                                tinyText="max: 4" 
                                text="Wait until everyone has joined..."
                                >
                                <Button onClick={(e)=>beginGameClick(e)}>Start</Button>
                            </GameOptionsCard>
                            <Button className="btn-back" onClick={(e)=>goBackClick(e, 2)}>Go Back</Button>
                        </>
                    )
                }
                else if (sessionStartType == "join"){
                    joinSession();
                    return (
                        <>
                            <h1 class="title2">JOINING SESSION</h1>
                            <Button className="btn-instructions">Need Help?</Button>
                            <GameOptionsCard className="card-options" title="JOINING A SESSION" text="Waiting for the leader to start the game..." img="">
                            </GameOptionsCard>
                            <Button className="btn-back"onClick={(e)=>goBackClick(e, 2)}>Go Back</Button>
                        </>
                    )
                }
                else {
                    return (
                        <>
                            <h1 class="title2">CO-OP</h1>
                            <Button className="btn-instructions">How it works</Button>
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
                            <Button className="btn-back" onClick={(e)=>goBackClick(e, 1)}>Go Back</Button>
                        </>
                    )
                }

            }
            else if (gameMode == "solo"){

            }
        }
    }

    function taskBoards(){
        if (sessionStarted){
            return (
                <>
                    {/* <SessionDurationStats sessionKey={sessionKey} sessionDuration={sessionDuration} /> */}
                    <SessionDurationStats sessionKey="NHYWID" sessionDuration="02:00" />
                    {/* <TaskListDashboard /> */}
                    <TaskDashboard />  
                </>
            )       
        }

    }

    function joinSession(){
        console.log("Authentificating Key");
    }

    function startSession(){
        console.log("Starting session");
        // Input board for choosing a webstack if more than one, for now ignore
        console.log(getWebStacks());
        console.log(getAllTaskswithinTaskSet("2rZdId43DTc2Mrgrt2kG"));
        console.log(getAllTaskSetsAndTasks());
        console.log(getAllTaskSetsIdsWithWebStack("hOOK382sKTHDCyOaaV0m"));
        
        //--------------------------------------------------------------------
        generateKey();
    }

    function generateKey(){
        //CONTACT DB AND MAKE KEY
        console.log("generating key");
        const key = "NHTWKU"
        if (!sessionKey) {
            setSessionKey(key);
        }

    }

    function beginGame(){
        setSessionStarted(true);
    }
    
    return (
        <>
        <Background1 />
        <div className="gameFrameContainer">
            <div className="gameFrame">
                {optionBoards()}
                {taskBoards()}
                <Instructions
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                />
            </div>


        </div>
        </>
    )
}

export default Main;