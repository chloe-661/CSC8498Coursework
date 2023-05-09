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
    getTaskSet, //Gets the info for a task set but NOT the tasks within it
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
    setUserRoleInDb,
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

    //Modals
    const [modalShow, setModalShow] = useState(false);
    const [quitWarningShow, setQuitWarningShow] = useState(false);

    //Options to choose from before starting a game
    const [gameMode, setGameMode] = useState(null); //Solo or Coop
    const [sessionStartType, setSessionStartType] = useState(null); //Start a new session or join an existing one
    const [inputtedSessionKey, setInputtedSessionKey] = useState(null); //e.g The users attempt to add a session key

    //Session Data
    const [isQuitting, setIsQuitting] = useState(false);
    const [sessionDbData, setSessionDbData] = useState({started: false});
    const [sessionDbTaskData, setSessionDbTaskData] = useState(null);
    const [sessionDbUserData, setSessionDbUserData] = useState(null);
    const [sessionDbThisUserData, setSessionDbThisUserData] = useState(null);
    const [sessionKey, setSessionKey] = useState(null); //A valid session that can be joined
    const [sessionPeople, setSessionPeople] = useState(null); //How many people in the group
    const [sessionDuration, setSessionDuration] = useState(null); //e.g 02:34 (2mins, 34 seconds)
    const [sessionStarted, setSessionStarted] = useState(false); //e.g 02:34 (2mins, 34 seconds)
    const [userRole, setUserRole] = useState(null); //e.g Builder, Styler, Database, etc
    const [showTask, setShowTask] = useState(null); 
    const [showTaskList, setShowTaskList] = useState(null); 

    //Database SnapShots
    const snap = (sessionId, subscribe) => {
        const snap1 = onSnapshot(query(doc(db, "sessions", sessionId)), (snapshot) => {
            console.log("test: " + snapshot.id);
            let x = {
                sessionId: snapshot.id,
                active: snapshot.data().active,
                key: snapshot.data().key,
                started: snapshot.data().started,
                finished: snapshot.data().finished,
                taskSetId: snapshot.data().taskSetId,
                startTime: snapshot.data().startTime,
            }
            setSessionDbData(x);
        });

        const snap2 = onSnapshot(query(collection(db, "sessions", sessionId, "users")), (snapshot) => {
            let x = [];
            let y = {};

            snapshot.docs.forEach((doc) => {
                x.push({
                    userId: doc.id,
                    uid: doc.data().uid,
                    leader: doc.data().leader,
                    role: doc.data().role,
                });

                if (doc.data().uid == user.uid){
                    y = {
                        userId: doc.id,
                        uid: doc.data().uid,
                        leader: doc.data().leader,
                        role: doc.data().role,
                    };
                }
            })
            console.log("userData= " + x);
            setSessionDbUserData(x);
            setSessionDbThisUserData(y);
            setSessionPeople(x.length);
        });

        const snap3 = onSnapshot(query(collection(db, "sessions", sessionId, "tasks")), (snapshot) => {
            let x = [];

            snapshot.docs.forEach((doc) => {
                
                x.push({
                    id: doc.id,
                    taskId: doc.data().taskId,
                    completed: doc.data().completed,
                    inUse: doc.data().inUse,
                    role: doc.data().role,
                    taskDependancies: doc.data().taskDependancies,
                    content: doc.data().content,
                    description: doc.data().description,
                    language: doc.data().language,
                    title: doc.data().name,
                    type: doc.data().type,
                    isLockedByDependancies: false,  
                });
            })
            console.log("taskData= " + x[0].id);

            x.forEach(task => {
                let locked = false;
                if (task.taskDependancies.length > 1 ){
                    task.taskDependancies.forEach(dep => {
                        x.forEach(task2 => {
                            if (dep != task.taskId && dep == task2.taskId){
                                if (task2.completed){
                                locked = false;
                                }
                                else {
                                locked = true;
                                }
                            }
                        });
                    });
                }
                task.isLockedByDependancies = locked
            });
            setSessionDbTaskData(x);
        });

        //Unsubscribes when a user quits the session
        //Doesn't work for some reason.......
        if (subscribe == false){
            console.log("Unsubscribing");
            snap1()
            snap2()
            snap3()
        }
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
        
        if (isQuitting){
            return (
                navigate("/dashboard", {state:{previousPath: "/main"}})
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
                                {/* <Button className="btn-back"onClick={(e)=>goBackClick(e, 2)}>Go Back</Button> */}
                                <Button className="btn-back" onClick={() => setQuitWarningShow(true)}>Quit</Button>
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
                if (sessionStartType == "start"){
                    //Will only display when the session exists in the database
                    if (sessionKey != null && !sessionDbData.started) {
                        return (
                            <>
                                <h1 class="title2">SOLO</h1>
                                <Button className="btn-instructions" onClick={() => setModalShow(true)}>Need Help?</Button>
                                <GameOptionsCard className="card-options" 
                                    title="SESSION KEY"
                                    topLine="--------------------" 
                                    bigText={sessionKey} 
                                    bottomLine="--------------------" 
                                    >
                                    <Button onClick={(e)=>beginGameClick(e)}>Start</Button>
                                </GameOptionsCard>
                                <Button className="btn-back" onClick={() => setQuitWarningShow(true)}>Quit</Button>
                            </>
                        )
                    }
                }
                //Start or Join a session options
                else {
                    return (
                        <>
                            <h1 class="title2">SOLO</h1>
                            <Button className="btn-instructions" onClick={() => setModalShow(true)}>How it works</Button>
                            <GameOptionsCard className="card-options" title="Are you sure?" text="You will take on up to 4 roles by yourself" img="">
                                <Button onClick={(e)=>startOrJoinClick(e, 'start')}>Continue</Button>
                            </GameOptionsCard>
                            <Button className="btn-back" onClick={(e)=>goBackClick(e, 1)}>Go Back</Button>
                        </>
                    )
                }
            }
        }
    }

    function taskBoards(){
        console.log("HELLLLLLLLLLLLLLLLLLLLLLLLLLLLPPPPPPPPPPPPPPPPPPP");
        console.log("started: " + sessionDbData.started);
        const stats = <SessionDurationStats sessionKey={sessionKey} started={sessionDbData.started} />;
        const taskList = <TaskListDashboard 
                            sessionDetails={sessionDbData}
                            userDetails={sessionDbThisUserData} 
                            taskDetails={sessionDbTaskData}
                            sessionPeople={sessionPeople}
                            showInstructions={modalShow}
                            showQuitWarning={quitWarningShow}
                            onShowInstructions={() => setModalShow(true)}
                            onHideInstructions={() => setModalShow(false)}
                            onShowQuitWarning={() => setQuitWarningShow(true)}
                            onHideQuitWarning={() => setQuitWarningShow(false)}
                            onQuit={quit}
                            />;
        const task = <TaskDashboard
                            showInstructions={modalShow}
                            showQuitWarning={quitWarningShow}
                            onShowInstructions={() => setModalShow(true)}
                            onHideInstructions={() => setModalShow(false)}
                            onShowQuitWarning={() => setQuitWarningShow(true)}
                            onHideQuitWarning={() => setQuitWarningShow(false)}
                            onQuit={quit} 
        />;
        const forceQuit = <h1>The leader left this session, it therefore has been ended</h1>
        if (sessionDbData.started && !sessionDbData.ended && sessionDbData.active){
            if (showTaskList){
                return (
                    <>
                        {stats}
                        {taskList}
                    </>
                )       
            }
            else if (showTask){
                return (
                    <>
                        {stats}
                        {task}
                    </>
                )  
            }     
        }
        else if (sessionDbData.started && !sessionDbData.ended && !sessionDbData.active){
            return (
                <>
                    {forceQuit}
                </>
            )
        }
    }

    const joinSession = async () => {
        const request = await joinSessionInDb(inputtedSessionKey, user.uid);

        if (request.success){
            setSessionKey(inputtedSessionKey);
            console.log("123");
            snap(request.sessionId, true);
            setShowTaskList(true);
        }
        else {
            console.log(request.errMes);
        }
    };

    function test(){
        console.log("123456789");
    }

    const pickTaskSet = async () => {
        const request = await getAllTaskSetsIdsWithWebStack("hOOK382sKTHDCyOaaV0m");
        const rnd = Math.floor(Math.random() * request.length);
        const choice = request[rnd].taskSetId;
        console.log("set: " + choice);
        return choice;
    }

    const assignRoles = async (sessionId, taskSetId) => {
        const request = await getTaskSet("2rZdId43DTc2Mrgrt2kG");
        console.log("assigning roles");
        let roles = request.roles;
        console.log("roles.length " + roles.length);
        console.log("users.length " + sessionDbUserData.length);

        // for(let i = 0; i < roles.length; i++){
        //     let roleTaken = false;
        //     console.log(sessionDbUserData[0].uid);
        //     sessionDbUserData.forEach(u => {
        //         if (u.role == roles[i]){
        //             roleTaken = true;
        //         }
        //     });

        //     if (!roleTaken){
        //         setUserRoleInDb(sessionDbData.sessionId, sessionDbUserData.userId, roles[i])
        //         console.log("role is: " + roles[i]);
        //         break;
        //     }
        // };

        if (roles.length == sessionDbUserData.length){
            for (let i = 0; i < roles.length; i++){
                setUserRoleInDb(sessionDbData.sessionId, sessionDbUserData[i].userId, roles[i]);
            }
        }
        else if (roles.length < sessionDbUserData.length){
            let counter = 0;
            for (let i = 0; i < sessionDbUserData.length; i++){
                if (counter < roles.length){
                    setUserRoleInDb(sessionDbData.sessionId, sessionDbUserData[i].userId, roles[counter]);
                    counter++;
                }
                else {
                    counter = 0;
                    setUserRoleInDb(sessionDbData.sessionId, sessionDbUserData[i].userId, roles[counter]);
                    counter++;
                }
            }

        }
        else if (roles.length > sessionDbUserData.length){
            console.log("entering");


            let counter = 0;
            for (let i = 0; i < roles.length; i++){
                console.log("Counter:" + counter)
                if (counter < sessionDbUserData.length){
                    setUserRoleInDb(sessionDbData.sessionId, sessionDbUserData[counter].userId, roles[i]);
                    counter++;
                }
                else {
                    counter = 0;
                    setUserRoleInDb(sessionDbData.sessionId, sessionDbUserData[counter].userId, roles[i]);
                    counter++;
                }
            }
        }
    }

    const startSession = async () => {
        console.log("Starting session");
     
        //--------------------------------------------------------------------
        const key = generateKey();
        console.log(key);

        const taskSet = await pickTaskSet();
        console.log("setttt " + taskSet)

        const request = await startNewSessionInDb(key, taskSet, user.uid);
        console.log("request " + request);
        console.log("567: " + request.sessionId);
        if (request.success){
            setSessionKey(key);
            console.log("456");
            snap(request.sessionId, true);
        }
        else {
            console.log(request.errMes);
            //Input a try again thing...
        }
    }

    const beginGame = async () => {
        assignRoles(sessionDbData.sessionId, sessionDbData.taskSetId);
        const request = await startSessionInDb(sessionDbData.sessionId);

        if (request.success){
            setShowTaskList(true);
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
                    const role = u.role;
                    deleteUserInSessionInDb(sessionDbData.sessionId, u.userId);
                    role.forEach(r => {
                        setUserRoleInDb(sessionDbData.sessionId, sessionDbUserData[0].userId, r);
                    })
                }
            }
        });
        snap(sessionDbData.sessionId, false);
        setQuitWarningShow(false);
        resetAllStates();
        console.log("ending quit");
        setIsQuitting(true);

    }

    function resetAllStates() {
        setSessionDbData(null);
        setSessionDbData({started: false});
        setSessionDbTaskData(null);
        setSessionDbUserData(null);
        setSessionDbThisUserData(null);
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