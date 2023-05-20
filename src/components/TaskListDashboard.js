import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useState, useEffect } from 'react';
import { getTaskSet } from "../firebase";

import TaskDescription from './TaskDescription';
import SessionStats from './SessionStats';
import UserRole from './UserRole';
import Instructions from '../components/Instructions';
import QuitWarning from '../components/QuitWarning';
import ReasonsLocked from '../components/ReasonsLocked';

function TaskListDashboard(props) {

  const [showLockedReasons, setShowLockedReasons] = useState(false);
  const [lockedReasons, setLockedReasons] = useState(null);
  const [senarioDescription, setSenarioDescription] = useState(null);

  const prepareReasonsLocked = async (reason, dependancies) => {
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
  }

  function checkCompleted(){
    let completed = true;
    props.taskDetails.forEach(t => {
      if (!t.completed){
        completed = false;
      }
    });

    if (completed){
      props.onCompleted();
    }
  }

  const displayTasks = () => {
    getSenario();
    let arr = [...props.taskDetails];
    
    arr.sort((a, b) => {
      let ta = a.title.toLowerCase(),
          tb = b.title.toLowerCase();
  
      if (ta > tb) {
          return -1;
      }
      if (ta < tb) {
          return 1;
      }
      return 0;
    });

    return (
      <>
        {arr.map(({id, title, description, role, language, completed, inUse, isLockedByDependancies, taskDependancies}) => (
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

  const getSenario = async () => {
    const request = await getTaskSet(props.sessionDetails.taskSetId);
    setSenarioDescription(request.senarioDescription);
  }

  return (
    <>
      <div className="taskListDashboard grid-container">
        <div className="grid-item__role">
        <UserRole title="USER ROLE:" role={props.userDetails.role}/>
        </div>
        <div className="grid-item__stats">    
          <SessionStats title="GROUP SESSION STATS:" senario={senarioDescription != null ? senarioDescription : ""} sessionDetails={props.sessionDetails} sessionPeople={props.sessionPeople} taskDetails={props.taskDetails}/>
        </div>
        <div className="grid-item__tasks">
        {displayTasks()}
        {checkCompleted()}
        </div>
        <div className="grid-item__button">
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