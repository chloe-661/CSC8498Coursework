import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import TaskDescription from './TaskDescription';
import SessionStats from './SessionStats';
import UserRole from './UserRole';
import Instructions from '../components/Instructions';
import QuitWarning from '../components/QuitWarning';
import GoBackWarning from '../components/GoBackWarning';

function TaskDashboard(props) {

  return (
    <>
      <div class="taskDashboard grid-container">
        <div class="grid-item__name">
            {/* <UserRole title="TASK NAME"/> */}
        </div>
        <div class="grid-item__description">
          {/* <SessionStats title="TASK DESCRIPTION" description="hnfdvjl fndvfn jlavnfdl vngfj rjgf vnileagfv rnae hrf abgvpd janl" /> */}

        </div>
        <div class="grid-item__hint">
        {/* <UserRole description="Need a hint?"/> */}
        </div>
        <div class="grid-item__task">
          {/* <UserRole description="hnfdvjl fndvfn jlavnfdl vngfj rjgf vnileagfv rnae hrf abgvpd janl"/> */}
        </div>
        <div class="grid-item__info">
          {/* <UserRole description={<>Type: {props.type} | Language: {props.language} | Role: {props.userDetails.role}</>}/> */}
        </div>
        <div class="grid-item__button">
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