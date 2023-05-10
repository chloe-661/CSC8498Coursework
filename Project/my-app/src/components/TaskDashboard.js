import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import TaskDescription from './TaskDescription';
import SessionStats from './SessionStats';
import UserRole from './UserRole';
import Instructions from '../components/Instructions';
import QuitWarning from '../components/QuitWarning';
import GoBackWarning from '../components/GoBackWarning';
import TaskDashboardStats from '../components/TaskDashboardStats';
import Task from '../components/Task';
import Answers from '../components/Answers';

function TaskDashboard(props) {

  let title;
  let description;
  let type;
  let language;
  let role;

  function getTaskDetails(){
    props.taskDetails.forEach(t => {
      if (t.id == props.taskId){
        title = t.title;
        description = t.description;
        type = t.type;
        language = t.language;
        role = t.role;
      }
    })
  }
    

  return (
    <>
    {getTaskDetails()}
      <div class="taskDashboard grid-container">
        <div class="grid-item__name">
            <TaskDashboardStats extraClass="taskDashboard__title" title={title} />
        </div>
        <div class="grid-item__description">
          <TaskDashboardStats title="DESCRIPTION" description={description} />

        </div>
        <div class="grid-item__task">
          <Task taskDetails={props.taskDetails} taskId={props.taskId}/>
          {/* <UserRole description="hnfdvjl fndvfn jlavnfdl vngfj rjgf vnileagfv rnae hrf abgvpd janl"/> */}
        </div>
        <div class="grid-item__answers">
          <Answers />
          {/* <UserRole description="hnfdvjl fndvfn jlavnfdl vngfj rjgf vnileagfv rnae hrf abgvpd janl"/> */}
        </div>
        <div class="grid-item__info">
          <TaskDashboardStats description={<>Type: &nbsp; {type} &nbsp;&nbsp; | &nbsp;&nbsp; Language: &nbsp; {language} &nbsp;&nbsp; | &nbsp;&nbsp; Role: &nbsp; {role}</>}/>
        </div>
        <div class="grid-item__button">
          <Button className="btn-hint" >Hint?</Button>
          <Button className="btn-back" onClick={props.onShowQuitWarning}>Quit</Button>
          <Button className="btn-back" onClick={props.onShowGoBackWarning}>Go Back</Button>
          <Button>Submit</Button>
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
      <GoBackWarning 
        show={props.showGoBackWarning}
        onHide={props.onHideGoBackWarning}
        onGoBack={props.onGoBack}
        taskId={props.taskId}
        />
    </>
  );
}

export default TaskDashboard;