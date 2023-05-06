import React from 'react';
import { useState, useEffect } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import {
    getFirestore,
    query,
    doc,
    getDoc,
    getDocs,
    collection,
    where,
    addDoc,
    updateDoc,
    onSnapshot,
} from "firebase/firestore";
import { 
    db,
    auth, 
    getWebStacks, //Gets all the different webstacks available
    getAllTaskSets, //Gets all task sets but NOT the tasks within
    getAllTaskSetsAndTasks, //Gets all sets + the tasks in them
    getAllTaskSetsIdsWithWebStack, //Gets all task set ids that match a webstack type
    getAllTaskswithinTaskSet, //Gets all the tasks within a task set but ONLY gets the task information
    startNewSessionInDb, //Setup of the session
    startSessionInDb, //Starts the session for all users
    joinSessionInDb,
    deleteSessionInDb,
    deleteUserInSessionInDb,
    endSessionInDb,
} from "../firebase";

//Styles
import Button from 'react-bootstrap/Button';

//Components
import Background1 from '../components/Background1';
import GameOptionsCard from '../components/GameOptionsCard';
import Instructions from '../components/Instructions';
import QuitWarning from '../components/QuitWarning';
import TaskListDashboard from '../components/TaskListDashboard';
import SessionDurationStats from '../components/SessionDurationStats';
import TaskDashboard from '../components/TaskDashboard';

function Main (){
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();
    const [modalShow, setModalShow] = useState(false);
    const [quitWarningShow, setQuitWarningShow] = useState(false);

    const [sessionDbData, setSessionDbData] = useState({started: false});
    const [sessionDbTaskData, setSessionDbTaskData] = useState(null);
    const [sessionDbUserData, setSessionDbUserData] = useState(null);
    
    
    //Options to choose from before starting a game
    const [gameMode, setGameMode] = useState(null); //Solo or Coop
    const [sessionStartType, setSessionStartType] = useState(null); //Start a new session or join an existing one
    
    const [inputtedSessionKey, setInputtedSessionKey] = useState(null); //e.g The users attempt to add a session key
    const [sessionKey, setSessionKey] = useState(null); //A valid session that can be joined
    const [sessionPeople, setSessionPeople] = useState(null); //How many people in the group

    const [sessionDuration, setSessionDuration] = useState(null); //e.g 02:34 (2mins, 34 seconds)
    const [sessionStarted, setSessionStarted] = useState(false); //e.g 02:34 (2mins, 34 seconds)

    const [userRole, setUserRole] = useState(null); //e.g Builder, Styler, Database, etc

    //Database SnapShots
    const snap = (sessionId) => {
        const q1 = query(doc(db, "sessions", sessionId));
        onSnapshot(q1, (snapshot) => {
            console.log("test: " + snapshot.id);
            let x = {
                sessionId: snapshot.id,
                active: snapshot.data().active,
                key: snapshot.data().key,
                started: snapshot.data().started,
                taskSetId: snapshot.data().taskSetId,
                startTime: snapshot.data().startTime,
            }
            setSessionDbData(x);
        });

        const q2 = query(collection(db, "sessions", sessionId, "users"));
        onSnapshot(q2, (snapshot) => {
            let x = [];

            snapshot.docs.forEach((doc) => {
                x.push({
                    userId: doc.id,
                    uid: doc.data().uid,
                    leader: doc.data().leader,
                    role: doc.data().role,
                });
            })
            console.log("userData= " + x);
            setSessionDbUserData(x);
            setSessionPeople(x.length);
        });

        const q3 = query(collection(db, "sessions", sessionId, "tasks"));
        onSnapshot(q3, (snapshot) => {
            let x = [];

            snapshot.docs.forEach((doc) => {
                x.push({
                    id: doc.id,
                    taskId: doc.data().taskId,
                    completed: doc.data().completed,
                    inUse: doc.data().inUse,
                    role: doc.data().role,
                    taskDependancies: doc.data().taskDependancies,
                    
                });
            })
            console.log("taskData= " + x[0].id);
            setSessionDbTaskData(x);
        });
    }

    //Hooks -----------------------------------------------------------------------------------------------------
    useEffect(() => {
        console.log("gameMode: " + gameMode);
        console.log("inputtedSessionKey: " + inputtedSessionKey);
        console.log("sessionKey: " + sessionKey);
        console.log("sessionPeople: " + sessionPeople);
        console.log("sessionDbData: " + sessionDbData);
        console.log("sessionDbTaskData: " + sessionDbData);
        console.log("sessionDbData: " + sessionDbData);

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
            startSession();
        }
        else if (type == "join"){
            joinSession();
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
            //Solo or Coop options
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
            //Coop
            else if (gameMode == "coop"){
                // If start a session is chosen
                if (sessionStartType == "start"){
                    //Will only display when the session exists in the database
                    if (sessionKey != null && !sessionDbData.started) {
                        return (
                            <>
                                <h1 class="title2">NEW SESSION</h1>
                                <Button className="btn-instructions" onClick={() => setModalShow(true)}>Need Help?</Button>
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
                                {/* <Button className="btn-back" onClick={(e)=>goBackClick(e, 2)}>Quit</Button> */}
                                <Button className="btn-back" onClick={() => setQuitWarningShow(true)}>Quit</Button>
                            </>
                        )
                    }
                }
                //If join a session is chosen
                else if (sessionStartType == "join"){
                    //Will only display when the session exists in the database and they have successfully joined
                    if (sessionKey != null && !sessionDbData.started) {
                        return (
                            <>
                                <h1 class="title2">JOINING SESSION</h1>
                                <Button className="btn-instructions" onClick={() => setModalShow(true)}>Need Help?</Button>
                                <GameOptionsCard className="card-options" title="JOINING A SESSION" text="Waiting for the leader to start the game..." img="">
                                </GameOptionsCard>
                                <Button className="btn-back"onClick={(e)=>goBackClick(e, 2)}>Go Back</Button>
                            </>
                        )
                    }
                }
                //Start or Join a session options
                else {
                    return (
                        <>
                            <h1 class="title2">CO-OP</h1>
                            <Button className="btn-instructions" onClick={() => setModalShow(true)}>How it works</Button>
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
            //Solo
            else if (gameMode == "solo"){

            }
        }
    }

    function taskBoards(){
        if (sessionDbData.started){
            return (
                <>
                    <SessionDurationStats sessionKey={sessionKey} started={sessionDbData.started} />
                    <TaskListDashboard />
                    {/* <TaskDashboard />   */}
                </>
            )       
        }

    }

    const joinSession = async () => {
        const request = await joinSessionInDb(inputtedSessionKey, user.uid, "Front-End Developer");

        if (request.success){
            setSessionKey(inputtedSessionKey);
            snap(request.sessionId);
        }
        else {
            console.log(request.errMes);
        }
    };

    const startSession= async () => {
        console.log("Starting session");
        // Input board for choosing a webstack if more than one, for now ignore
        console.log(getWebStacks());
        console.log(getAllTaskswithinTaskSet("2rZdId43DTc2Mrgrt2kG"));
        console.log(getAllTaskSetsAndTasks());
        console.log(getAllTaskSetsIdsWithWebStack("hOOK382sKTHDCyOaaV0m"));
        
        //--------------------------------------------------------------------
        const key = generateKey();
        console.log(key);
        const request = await startNewSessionInDb(key, "2rZdId43DTc2Mrgrt2kG", user.uid, "Front-End Developer");
        if (request.success){
            setSessionKey(key);
            snap(request.sessionId);
        }
        else {
            console.log(request.errMes);
            //Input a try again thing...
        }
    }

    const beginGame = async () => {
        const request = await startSessionInDb(sessionDbData.sessionId);

        if (request.success){
            
        }
    }

    function generateKey(){
        //CONTACT DB AND MAKE KEY
        console.log("generating key");

        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const charactersLength = characters.length;
        let key = '';
        let counter = 0;
        let keyLength = 6
        while (counter < keyLength) {
            key += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
    
        if (sessionKey == null) {
            return key;
        }
    }

    const quit = () => {
        console.log("starting quit");
        sessionDbUserData.forEach((u) => {
            if (u.uid == user.uid){
                if (u.leader){
                    //Delete the session
                    // deleteSessionInDb(sessionDbData.sessionId);
                    
                    
                    //Set the session to inactive
                    endSessionInDb(sessionDbData.sessionId);
                }
                else {
                    //Delete only the user from that session
                    deleteUserInSessionInDb(sessionDbData.sessionId, u.userId);
                }
            }
        });
        setQuitWarningShow(false);
        resetAllStates();
        console.log("ending quit");
    }

    function resetAllStates() {
        setSessionDbData({started: false});
        setSessionDbTaskData(null);
        setSessionDbUserData(null);
        setGameMode(null); //Solo or Coop
        setSessionStartType(null); //Start a new session or join an existing one
        setInputtedSessionKey(null); //e.g The users attempt to add a session key
        setSessionKey(null); //A valid session that can be joined
        setSessionPeople(null); //How many people in the group
        setSessionDuration(null); //e.g 02:34 (2mins, 34 seconds)
        setSessionStarted(false); //e.g 02:34 (2mins, 34 seconds)
        setUserRole(null); //e.g Builder, Styler, Database, etc
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
                <QuitWarning 
                    show={quitWarningShow}
                    onHide={() => setQuitWarningShow(false)}
                    onQuit={quit}
                />
            </div>
        </div>
        </>
    )
}

export default Main;