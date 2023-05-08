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
} from "../firebase";

import TaskDescription from './TaskDescription';
import SessionStats from './SessionStats';
import UserRole from './UserRole';
import Instructions from '../components/Instructions';
import QuitWarning from '../components/QuitWarning';
import ReasonsLocked from '../components/ReasonsLocked';

function TaskListDashboard(props) {

  const [showLockedReasons, setShowLockedReasons] = useState(false);

  const displayTasks = () => {
    return (
      <>
        {props.taskDetails.map(({title, description, role, language, completed, inUse, isLockedByDependancies}) => (
          <TaskDescription 
            title={title} 
            description={description}
            role={role} 
            languages={language} 
            completed={completed} 
            inUse={inUse} 
            isLockedByDependancies={isLockedByDependancies}
            onShow={() => setShowLockedReasons(true)}
            onHide={() => setShowLockedReasons(false)}
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
        <UserRole title="USER ROLE:" description={props.userDetails.role}/>
        </div>
        <div class="grid-item__stats">
          <SessionStats title="SESSION STATS:" description="hnfdvjl fndvfn jlavnfdl vngfj rjgf vnileagfv rnae hrf abgvpd janl" />
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
        />
      </>
  );
}

export default TaskListDashboard;