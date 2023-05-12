import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useState, useEffect } from 'react';
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
  getTaskName,
  getTaskDependanciesDetails,
} from "../firebase";

import TaskDescription from './TaskDescription';
import SessionStats from './SessionStats';
import UserRole from './UserRole';
import Instructions from '../components/Instructions';
import QuitWarning from '../components/QuitWarning';
import ReasonsLocked from '../components/ReasonsLocked';

function TaskListDashboard(props) {

  const [showLockedReasons, setShowLockedReasons] = useState(false);
  const [lockedReasons, setLockedReasons] = useState(null);

  const prepareReasonsLocked = async (reason, dependancies) => {
    // const request = await getTaskDependanciesDetails(props.sessionDetails.taskSetId, dependancies);

    if (reason == "dep"){
      let arr = []
      for (let i = 1; i < dependancies.length; i++){
        arr.push(dependancies[i]);
      }
      setLockedReasons({
        message: "these tasks need to be completed first:",
        tasks: arr,
      })
    }
    else if (reason == "use"){
      setLockedReasons({
        message: "someone else is currently attempting to do this task",
        tasks: [],
      })
    }
    setShowLockedReasons(true);
    
    
    
    
    // if (reason == "use"){
    //   setLockedReasons({
    //     message: "someone else is currently attempting to do this task",
    //     tasks: [],
    //   })
    // }
    // else if (reason == "dep"){
    //   console.log("dep");
    //   let text = [];
    //   dependancies.forEach(d => {
    //     const x = getTaskName(props.sessionDetails.taskSetId, d);
    //     text.push(x.data);
    //   });

    //   setLockedReasons({
    //     message: "these tasks need to be completed first:",
    //     tasks: text,
    //   })
    // }
    // setShowLockedReasons(true);
  }

  const displayTasks = () => {
    return (
      <>
        {props.taskDetails.map(({id, title, description, role, language, completed, inUse, isLockedByDependancies, taskDependancies}) => (
          <TaskDescription
            key={id}
            taskId={id}
            title={title} 
            description={description}
            role={role} 
            languages={language} 
            completed={completed} 
            inUse={inUse} 
            isLockedByDependancies={isLockedByDependancies}
            taskDependancies={taskDependancies}
            onShow={prepareReasonsLocked}
            onHide={() => setShowLockedReasons(false)}
            onOpenTask={props.onOpenTask}
            userDetails={props.userDetails}
          />
        ))}
      </>
    )
  }

  return (
    <>
      <div class="taskListDashboard grid-container">
        <div class="grid-item__role">
        <UserRole title="USER ROLE:" role={props.userDetails.role}/>
        </div>
        <div class="grid-item__stats">
          <SessionStats title="SESSION STATS:" sessionDetails={props.sessionDetails} sessionPeople={props.sessionPeople} taskDetails={props.taskDetails}/>
        </div>
        <div class="grid-item__tasks">
        {displayTasks()}
        </div>
        <div class="grid-item__button">
          <Button className="btn-back" onClick={props.onShowQuitWarning}>Quit</Button>
          <Button className="btn-instructions" onClick={props.onShowInstructions}>Need Help?</Button>
        </div>   
      </div>
      <Instructions
        show={props.showInstructions}
        onHide={props.onHideIntructions}
        />
      <QuitWarning 
        show={props.showQuitWarning}
        onHide={props.onHideQuitWarning}
        onQuit={props.onQuit}
        />
      <ReasonsLocked 
        show={showLockedReasons}
        onHide={() => setShowLockedReasons(false)}
        reasons={lockedReasons != null ? lockedReasons : ""}
        />
      </>
  );
}

export default TaskListDashboard;