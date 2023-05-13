import React from 'react';
import { useState, useEffect } from 'react';

//Firebase
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import {
    query,
    doc,
    collection,
    onSnapshot,
} from "firebase/firestore";
import { 
    db,
    auth, 
    getWebStacks, //Gets all the different webstacks available
    getTaskSet, //Gets the info for a task set but NOT the tasks within it
    getAllTaskSetsIdsWithWebStack, //Gets all task set ids that match a webstack type
    startNewSessionInDb, //Setup of the session
    startSessionInDb, //Starts the session for all users
    joinSessionInDb,
    deleteUserInSessionInDb,
    endSessionInDb,
    setUserRoleInDb,
    openTaskInDb,
    closeTaskInDb,
    completeSessionInDb,
    saveSessionDataToUser
} from "../firebase";

//Styles
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

//Components
import Background1 from '../components/Background1';
import GameOptionsCard from '../components/GameOptionsCard';
import Instructions from '../components/Instructions';
import QuitWarning from '../components/QuitWarning';
import TaskListDashboard from '../components/TaskListDashboard';
import SessionDurationStats from '../components/SessionDurationStats';
import TaskDashboard from '../components/TaskDashboard';
import WebStackCard from '../components/WebStackCard';

function Main (){

    //State ------------------------------------------------------------------------------------------------------------------

    //User auth
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();

    //Modals
    const [modalShow, setModalShow] = useState(false);
    const [quitWarningShow, setQuitWarningShow] = useState(false);
    const [goBackWarningShow, setGoBackWarningShow] = useState(false);

    //Options to choose from before starting a game
    const [gameMode, setGameMode] = useState(null);                             //Stores the users choice between: Solo or Coop
    const [sessionStartType, setSessionStartType] = useState(null);             //Stores the users choice between: Start a new session or join an existing one
    const [inputtedSessionKey, setInputtedSessionKey] = useState(null);         //Stores the users attempt to add a session key (aka the data in the input box)
    const [allWebStacks, setAllWebstacks] = useState(null);                     //All available webstack options to choose from

    //Session Data
    const [isQuitting, setIsQuitting] = useState(false);
    const [sessionDbData, setSessionDbData] = useState({started: false});       //All data on the current session
    const [sessionDbTaskData, setSessionDbTaskData] = useState(null);           //All data on the tasks in the current session
    const [sessionDbUserData, setSessionDbUserData] = useState(null);           //All data on the users in the current session
    const [sessionDbThisUserData, setSessionDbThisUserData] = useState(null);   //All data on the user logged in in the current session
    const [sessionKey, setSessionKey] = useState(null);                         //The session key to be shared. Only set once all initalising of the session is done
    const [sessionPeople, setSessionPeople] = useState(null);                   //How many people in the session group
    const [sessionSenario, setSessionSenario] = useState("");                   //What the aim of the session is
    const [sessionStarted, setSessionStarted] = useState(false);                //The time the session was created (in milliseconds since January 1, 1970)
    const [sessionWebStack, setSessionWebStack] = useState(null);               //Stores the users choice of webstack for the session
    const [showTask, setShowTask] = useState(null);                             //Decides on whether or not to show the task dashboard
    const [showTaskList, setShowTaskList] = useState(null);                     //Decides on whether or not to show the tasklist dashboard
    const [completed, setCompleted] = useState(false);                          //Whether or not the session has been completed (aka all tasks done)
    const [endTime, setEndTime] = useState(null);                               //The time the session was completed (in milliseconds since January 1, 1970)

    
    //Database SnapShots ------------------------------------------------------------------------------------------------------------------
    const snap = (sessionId, subscribe) => {
        
        //Session Data
        const snap1 = onSnapshot(query(doc(db, "sessions", sessionId)), (snapshot) => {
            console.log("test: " + snapshot.id);
            let x = {
                sessionId: snapshot.id,
                active: snapshot.data().active,
                key: snapshot.data().key,
                started: snapshot.data().started,
                ended: snapshot.data().ended,
                taskSetId: snapshot.data().taskSetId,
                startTime: snapshot.data().startTime,
            }
            setSessionDbData(x);
        });

        //Task Data
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

        //User Data
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
                    questions: doc.data().questions,
                    answers: doc.data().answers,
                    answerLines: doc.data().answerLines,
                    longDescription: doc.data().longDescription,
                    hints: doc.data().hints,
                });
            })
            console.log("taskData= " + x[0].id);

            x.forEach(task => {
                let locked = false;
                if (task.taskDependancies.length > 1 ){
                    task.taskDependancies.forEach(dep => {
                        x.forEach(task2 => {
                            if (dep.taskId != task.taskId && dep.taskId == task2.taskId){
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

    //Hooks -------------------------------------------------------------------------------------------------------------------------------------------
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
    
    //Event Handlers -------------------------------------------------------------------------------------------------------------------------------------------------------
    
    function soloOrCoopButtonClick(e, mode) {
        setGameMode(mode);
    }

    function startOrJoinClick(e, type) {
        setSessionStartType(type);
    
        if (type == "join"){
            joinSession();
        }
    }    
    
    function onWebStack(webStackId){
        setSessionWebStack(webStackId);
        startSession(webStackId);
    }

    //Resets the state if the user presses the 
    //go back button based on what section they were at
    function goBackClick(e, num){
        switch(num){
            case 1:
                setGameMode(null);
                break;
            case 2:
                setSessionWebStack(null);
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

    //General Functions -------------------------------------------------------------------------------------------------------------------------------------------------

    function convertMillisecondsToMinutesAndSeconds(milliseconds){
        let minutes = Math.floor(milliseconds / 60000);
        let seconds = ((milliseconds % 60000) / 1000).toFixed(0);
        return (minutes + ":" + (seconds < 10 ? '0' : '') + seconds);
    }

    function getTimeDurationInMilliseconds(start, end){
        return (end - start);
    }

    const openTask = async (taskId) => {
        const request = await openTaskInDb(sessionDbData.sessionId, taskId);
        setShowTaskList(false);
        setShowTask(taskId);
    }

    const getWebStackOptions = async () => {
        const request = await getWebStacks();
        setAllWebstacks(request);
    }

    const getSenario = async () => {
        const request = await getTaskSet(sessionDbData.taskSetId);
        let senario = request.senarioDescription;
        setSessionSenario(senario);
    }

    const pickTaskSet = async (webStackId) => {
        const request = await getAllTaskSetsIdsWithWebStack(webStackId);
        const rnd = Math.floor(Math.random() * request.length);
        const choice = request[rnd].taskSetId;
        return choice;
    }

    const assignRoles = async () => {
        const request = await getTaskSet(sessionDbData.taskSetId);
        let roles = request.roles;

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
            let counter = 0;
            for (let i = 0; i < roles.length; i++){
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

    function generateKey(){
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

    //Session Started/Joined -----------------------------------------------------------------------------------------------------------------------------------------

    const startSession = async (webStackId) => {
        const key = generateKey();
        const taskSet = await pickTaskSet(webStackId);
        const request = await startNewSessionInDb(key, taskSet, user.uid);

        if (request.success){
            setSessionKey(key);
            snap(request.sessionId, true);
        }
        else {
            console.log(request.errMes);
            //Input a try again thing...
        }
    }

    const joinSession = async () => {
        const request = await joinSessionInDb(inputtedSessionKey, user.uid);

        if (request.success){
            setSessionKey(inputtedSessionKey);
            snap(request.sessionId, true);
            setShowTaskList(true);
        }
        else {
            console.log(request.errMes);
        }
    };
    
    const beginGame = async () => {
        assignRoles();
        getSenario();
        const request = await startSessionInDb(sessionDbData.sessionId);

        if (request.success){
            setShowTaskList(true);
        }
    }
    
    //Session Quit/End/Completed --------------------------------------------------------------------------------------------------------------------------------------

    let runOnce = false;
    const onCompleted = async() => {
        if (!runOnce){
            runOnce = true;
            setCompleted(true);
        
            let time = Date.now();
            setEndTime(time);
    
            if (sessionDbThisUserData.leader){
                completeSessionInDb(sessionDbData.sessionId, time);
            }
    
            const request = await saveSessionDataToUser(user.uid, sessionDbData.startTime, time, "hOOK382sKTHDCyOaaV0m", sessionDbData.taskSetId, sessionPeople, sessionDbThisUserData.role);
            console.log("testing Request");
        }  
    }
    
    const goBack = async (taskId) => {
        console.log("GOING BACK: " + taskId);
        const request = await closeTaskInDb(sessionDbData.sessionId, taskId);
        setGoBackWarningShow(false);
        setShowTaskList(true);
        setShowTask(null);
    }

    function leave(){
        snap(sessionDbData.sessionId, false);
        resetAllStates();
        navigate("/main", {state:{previousPath: "/main"}})
    }

    const quit = () => {
        console.log("starting quit");
        sessionDbUserData.forEach((u) => {
            if (u.uid == user.uid){
                if (u.leader){
                    //Delete the session
                    // deleteSessionInDb(sessionDbData.sessionId);
                    
                    
                    //Set the session to inactive
                    let time = Date.now();
                    endSessionInDb(sessionDbData.sessionId, time);
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
        setIsQuitting(true); //Takes you back to the dashboard
    }

    //Clean Up --------------------------------------------------------------------------------------------------------------------------------------------------------

    function resetAllStates() {
        setCompleted(false);
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
        setSessionStarted(false); //e.g 02:34 (2mins, 34 seconds)
    }

    //Element Display Functions ----------------------------------------------------------------------------------------------------------------------
    
    function optionBoards(){
        if (!sessionStarted) {
            //Solo or Coop options
            if (gameMode == null) {
                return (
                    <>
                        <h1 class="title2">GAME MODE</h1>
                        <GameOptionsCard className="card-options" title="SOLO" text="Play by yourself and make it a challenge" img="https://raw.githubusercontent.com/chloe-661/CSC8498Coursework/main/Project/my-app/src/assets/img/solo-img.png?token=GHSAT0AAAAAACBJF5EI4SPDDXPU2IXCVI4YZCQJK4A">
                            <Button onClick={(e)=>soloOrCoopButtonClick(e, 'solo')}>Play</Button>
                        </GameOptionsCard>
                        
                        <GameOptionsCard className="card-options" title="CO-OP" text="Play with up to 4 other people in a team" img="https://drive.google.com/file/d/1-7aiubacJspAAGAD5uELwfWJwBCX5tDI/preview">
                            <Button onClick={(e)=>soloOrCoopButtonClick(e, 'coop')}>Play</Button>
                        </GameOptionsCard>
                        <Button className="btn-instructions" onClick={() => setModalShow(true)}>How it works</Button>
                    </>
                )
            }
            //Coop
            else if (gameMode == "coop"){
                // If start a session is chosen
                if (sessionStartType == "start"){
                    if (allWebStacks == null){
                        getWebStackOptions();
                    }
                    if (sessionWebStack == null && allWebStacks != null){
                        return (
                            <>
                                <h1 class="title2">CO-OP</h1>
                                <h4>Pick the languages you want the tasks to be based on</h4>
                                {allWebStacks.map(({webStackId, languages}, index) => (
                                    <WebStackCard className="card-options card-options__bigger" key={index} title={`Option ${index+1}`} languages={languages} webStackId={webStackId} onWebStack={onWebStack}/>
                                ))}
                                <div>
                                    <Button style={{display:"inline-block", marginLeft: "0.5rem", marginRight: "0.5rem"}} className="btn-instructions" onClick={() => setModalShow(true)}>How it works</Button>
                                    <Button style={{display:"inline-block", marginLeft: "0.5rem", marginRight: "0.5rem"}} className="btn-back" onClick={(e)=>goBackClick(e, 1)}>Go Back</Button>
                                </div>
                            </>
                        )
                    }
                    //Will only display when the session exists in the database
                    if (sessionWebStack != null && sessionKey != null && !sessionDbData.started) {
                        return (
                            <>
                                <h1 class="title2">NEW SESSION</h1>
                                <GameOptionsCard className="card-options card-options__bigger" 
                                    title="SESSION KEY"
                                    topLine="--------------------" 
                                    bigText={sessionKey} 
                                    bottomLine="--------------------" 
                                    text="&nbsp;&nbsp;&nbsp;Give your friends this code &nbsp;&nbsp;&nbsp; Ask them to input it in the “Join Group Session” section of the “Co-op” page" 
                                    >
                                </GameOptionsCard>
    
                                <GameOptionsCard className="card-options card-options__bigger" 
                                    title="PEOPLE JOINED" 
                                    bigNumber={sessionPeople}
                                    tinyText="max: 4" 
                                    text="Wait until everyone has joined..."
                                    >
                                    <Button onClick={(e)=>beginGameClick(e)}>Start</Button>
                                </GameOptionsCard>
                                <div>
                                    <Button style={{display:"inline-block", marginLeft: "0.5rem", marginRight: "0.5rem"}} className="btn-instructions" onClick={() => setModalShow(true)}>Need Help?</Button>
                                    <Button style={{display:"inline-block", marginLeft: "0.5rem", marginRight: "0.5rem"}} className="btn-back" onClick={() => setQuitWarningShow(true)}>Quit</Button>
                                </div>

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
                                <GameOptionsCard className="card-options" title="JOINING A SESSION" text="Waiting for the leader to start the game..." img="">
                                </GameOptionsCard>
                                <div> 
                                    <Button style={{display:"inline-block", marginLeft: "0.5rem", marginRight: "0.5rem"}} className="btn-instructions" onClick={() => setModalShow(true)}>Need Help?</Button>
                                    <Button style={{display:"inline-block", marginLeft: "0.5rem", marginRight: "0.5rem"}} className="btn-back" onClick={() => setQuitWarningShow(true)}>Quit</Button>
                                </div>
                            </>
                        )
                    }
                }
                //Start or Join a session options
                else {
                    return (
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
                            <div>
                            <Button style={{display:"inline-block", marginLeft: "0.5rem", marginRight: "0.5rem"}} className="btn-instructions" onClick={() => setModalShow(true)}>How it works</Button>
                            <Button style={{display:"inline-block", marginLeft: "0.5rem", marginRight: "0.5rem"}} className="btn-back" onClick={(e)=>goBackClick(e, 2)}>Go Back</Button>
                            </div>
                        </>
                    )
                }

            }
            //Solo
            else if (gameMode == "solo"){
                if (sessionStartType == "start"){
                    if (allWebStacks == null){
                        getWebStackOptions();
                    }
                    if (sessionWebStack == null && allWebStacks != null){
                        return (
                            <>
                                <h1 class="title2">CO-OP</h1>
                                <h4>Pick the languages you want the tasks to be based on</h4>
                                {allWebStacks.map(({webStackId, languages}, index) => (
                                    <WebStackCard className="card-options card-options__bigger" key={index} title={`Option ${index+1}`} languages={languages} webStackId={webStackId} onWebStack={onWebStack}/>
                                ))}
                                <div>
                                    <Button style={{display:"inline-block", marginLeft: "0.5rem", marginRight: "0.5rem"}} className="btn-instructions" onClick={() => setModalShow(true)}>How it works</Button>
                                    <Button style={{display:"inline-block", marginLeft: "0.5rem", marginRight: "0.5rem"}} className="btn-back" onClick={(e)=>goBackClick(e, 1)}>Go Back</Button>
                                </div>
                            </>
                        )
                    }
                    //Will only display when the session exists in the database
                    if (sessionWebStack != null && sessionKey != null && !sessionDbData.started) {
                        return (
                            <>
                                <h1 class="title2">SOLO</h1>
                                <GameOptionsCard className="card-options" 
                                    title="SESSION KEY"
                                    topLine="--------------------" 
                                    bigText={sessionKey} 
                                    bottomLine="--------------------" 
                                    >
                                    <Button onClick={(e)=>beginGameClick(e)}>Start</Button>
                                </GameOptionsCard>
                                <div>
                                <Button style={{display:"inline-block", marginLeft: "0.5rem", marginRight: "0.5rem"}} className="btn-instructions" onClick={() => setModalShow(true)}>Need Help?</Button>
                                <Button style={{display:"inline-block", marginLeft: "0.5rem", marginRight: "0.5rem"}} className="btn-back" onClick={() => setQuitWarningShow(true)}>Quit</Button>
                                </div>
                            </>
                        )
                    }
                }
                //Start or Join a session options
                else {
                    return (
                        <>
                            <h1 class="title2">SOLO</h1>
                            <GameOptionsCard className="card-options" title="ARE YOU SURE?" text="You will take on up to 4 roles by yourself" img="">
                                <Button onClick={(e)=>startOrJoinClick(e, 'start')}>Continue</Button>
                            </GameOptionsCard>
                            <div>
                            <Button style={{display:"inline-block", marginLeft: "0.5rem", marginRight: "0.5rem"}} className="btn-instructions" onClick={() => setModalShow(true)}>How it works</Button>
                            <Button style={{display:"inline-block", marginLeft: "0.5rem", marginRight: "0.5rem"}} className="btn-back" onClick={(e)=>goBackClick(e, 1)}>Go Back</Button>
                            </div>
                        </>
                    )
                }
            }
        }
    }

    function taskBoards(){
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
                            onOpenTask={openTask}
                            onCompleted={onCompleted}
                            />;
        const task = <TaskDashboard
                            sessionDetails={sessionDbData}
                            userDetails={sessionDbThisUserData} 
                            taskDetails={sessionDbTaskData}
                            sessionPeople={sessionPeople}
                            showInstructions={modalShow}
                            showQuitWarning={quitWarningShow}
                            showGoBackWarning={goBackWarningShow}
                            onShowInstructions={() => setModalShow(true)}
                            onHideInstructions={() => setModalShow(false)}
                            onShowQuitWarning={() => setQuitWarningShow(true)}
                            onHideQuitWarning={() => setQuitWarningShow(false)}
                            onShowGoBackWarning={() => setGoBackWarningShow(true)}
                            onHideGoBackWarning={() => setGoBackWarningShow(false)}
                            onQuit={quit}
                            onGoBack={goBack}
                            taskId={showTask}
                            onOpenTask={openTask}
        />;
        const forceQuit = <>
            <h1 class="title2">OH NO!</h1>
            <GameOptionsCard className="card-options" title="SESSION UNEXPECTEDLY ENDED" text="The leader left this session which has forced it to end. Sorry" img="">
                <Button onClick={leave}>Start again</Button>
            </GameOptionsCard>
            <div>
            </div>
        </>
        if (sessionDbData.started && !sessionDbData.ended && sessionDbData.active){
            if (showTaskList){
                return (
                    <>
                        {stats}
                        {taskList}
                    </>
                )       
            }
            else{
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

    function completedBoard(){
        if (completed){
            const timeInMilliseconds = getTimeDurationInMilliseconds(sessionDbData.startTime, endTime);
            const timeFormatted = convertMillisecondsToMinutesAndSeconds(timeInMilliseconds);

            return (
                <>
                    <h1 class="title2">ALL TASKS COMPLETED</h1>
                    <Card className="completedCard">
                        <Card.Body>
                            <Card.Title className="taskDashboard__title">WELL DONE</Card.Title>
                            <br />
                            <Card.Text>All the tasks have been completed</Card.Text>
                            <Card.Text className="time">{timeFormatted}*</Card.Text>
                            <hr />
                            <Card.Text className="listP">Aim: &nbsp; {sessionSenario}</Card.Text>
                            <Card.Text className="listP">Tasks Completed: &nbsp; {sessionDbTaskData.length} </Card.Text>
                            <Card.Text className="listP">Session Key: &nbsp; {sessionKey} </Card.Text>
                            <Card.Text>People: &nbsp; {sessionPeople} </Card.Text>
                            <Button onClick={leave}>Continue</Button>
                        </Card.Body>
                    </Card>
                    <p className="tinyText listP">* The time displayed here may be different from what you saw during the session</p>
                    <p className="tinyText listP"> This is because the timer on the screen pauses when you change tab in the browser</p>
                    <p className="tinyText listP">The time displayed here is the total time from start to finish </p>
                </>
            )
        }
    }

    //Render Function --------------------------------------------------------------------------------------------------------------------------------------------------------

    return (
        <>
        <Background1 />
        <div className="gameFrameContainer">
            <div className="gameFrame">
                {optionBoards()}
                {taskBoards()}
                {completedBoard()}
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