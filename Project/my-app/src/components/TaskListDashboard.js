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

function TaskListDashboard(props) {

  const test2 = () => {
    return (
      <>
        {props.taskDetails.map(({title, description, language, completed, inUse, isLockedByDependancies}) => (
          <TaskDescription title={title} description={description} languages={language} completed={completed} inUse={inUse} isLockedByDependancies={isLockedByDependancies} />
        ))}
      </>
    )

  }
  
  const test = () => {
    let t = []
    props.taskDetails.forEach(task => {
      if (task.completed){
        const x = task;
        x.isLocked = false;
        t.push(x);
      }
      else if (!task.completed && !task.inUse){
        const x = task;
        x.isLocked = false;
        t.push(x);
      }
      else {
        let locked = false;
        if (task.taskDependancies.length > 1 ){
          task.taskDependancies.forEach(dep => {
            props.taskDetails.forEach(task2 => {
              if (dep != task.taskId && dep == task2.taskId){
                if (task2.completed){
                  locked = false;
                }
                else {
                  locked = true;
                }
              }
            })
          })
        }
        
        if (!locked){
          const x = task;
          x.isLocked = false;
          t.push(x);
        }

        if (locked){
          const x = task;
          x.isLocked = true;
          t.push(x);
        }
      }
    });

    return (
      <>
        {t.map(({title, description, language, completed, inUse, isLocked}) => (
          <TaskDescription title={title} description={description} languages={language} completed={completed} inUse={inUse} isLocked={isLocked} />
        ))}
      </>
    )

  }

  const displayTasks = () => {
    let t = [];
    props.taskDetails.forEach(task => {
      if (!task.completed && !task.inUse){
        t.push(task);
      }
      else {
        let locked = false;
        if (task.taskDependancies.length > 1 ){
          task.taskDependancies.forEach(dep => {
            props.taskDetails.forEach(task2 => {
              if (dep != task.taskId && dep == task2.taskId){
                if (task2.completed){
                  locked = false;
                }
                else {
                  locked = true;
                }
              }
            })
          })
        }
        
        if (!locked){
          t.push(task);
        }
      }
    });

    return (
      <>
        {t.map(({title, description, language, completed, inUse}) => (
          <TaskDescription title={title} description={description} languages={language} completed={completed} inUse={inUse} isLocked={false} />
        ))}
      </>
    )
  }

  const displayLockedTasks = () => {
    let t = [];
    props.taskDetails.forEach(task => {
      if (task.inUse){
        t.push(task);
      }
      else {
        let locked = false;
        if (task.taskDependancies.length > 1 ){
          task.taskDependancies.forEach(dep => {
            props.taskDetails.forEach(task2 => {
              if (dep != task.taskId && dep == task2.taskId){
                if (task2.completed){
                  locked = false;
                }
                else {
                  locked = true;
                }
              }
            })
          })
        }
        
        if (locked){
          t.push(task);
        }
      }
    });

    return (
      <>
        {t.map(({title, description, language, completed, inUse}) => (
          <TaskDescription title={title} description={description} languages={language} completed={completed} inUse={inUse} isLocked={true} />
        ))}
      </>
    )
  }

  const displayDoneTasks = () => {
    let t = [];
    props.taskDetails.forEach(task => {
      if (task.completed){
        t.push(task);
      }
    });

    return (
      <>
        {t.map(({title, description, language, completed, inUse}) => (
          <TaskDescription title={title} description={description} languages={language} completed={completed} inUse={inUse} isLocked={false} />
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
        {test2()}
        {/* {displayTasks()}
        {displayLockedTasks()}
        {displayDoneTasks()} */}
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
      </>
  );
}

export default TaskListDashboard;