import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import TaskDescription from './TaskDescription';
import SessionStats from './SessionStats';
import UserRole from './UserRole';

function TaskDashboard(props) {
  return (
    <>
      <div class="taskDashboard grid-container">
        <div class="grid-item__name">
            <UserRole title="TASK NAME"/>
        </div>
        <div class="grid-item__description">
          <SessionStats title="TASK DESCRIPTION" description="hnfdvjl fndvfn jlavnfdl vngfj rjgf vnileagfv rnae hrf abgvpd janl" />

        </div>
        <div class="grid-item__hint">
        <UserRole description="Need a hint?"/>
        </div>
        <div class="grid-item__task">
          <UserRole description="hnfdvjl fndvfn jlavnfdl vngfj rjgf vnileagfv rnae hrf abgvpd janl"/>
        </div>
        <div class="grid-item__info">
          <UserRole description="hnfdvjl fndvfn jlavnfdl vngfj rjgf vnileagfv rnae hrf abgvpd janl"/>
        </div>
        <div class="grid-item__button">
        <Button className="btn-back">Go Back</Button>
        <Button>Submit</Button>
        </div>    
      </div>
    </>
  );
}

export default TaskDashboard;